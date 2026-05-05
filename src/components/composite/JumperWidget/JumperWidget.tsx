import isEqual from 'lodash/isEqual';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { HeightAnimatedContainer } from '@/components/core/HeightAnimatedContainer/HeightAnimatedContainer';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'motion/react';
import {
  Fragment,
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { useStore as useZustandStore } from 'zustand';
import { useTranslation } from 'react-i18next';
import {
  type NavigationContextValue,
  type WidgetFormApi,
  type JumperWidgetFormListeners,
  FormContext,
  NavigationContext,
  useFormContext,
  useWidgetNavigation,
} from './context';
import {
  WidgetStoreContext,
  createWidgetStore,
  useWidgetStoreInstance,
} from './store';
import type { JumperWidgetSettings } from './types';
import {
  INTERNAL_SETTINGS_VIEW_ID,
  type AnyFieldDefinition,
  type JumperWidgetStatusSheetProp,
  type WidgetView,
} from './types';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { GoBackHeader, MainHeader } from './components/Headers';
import { ContentContainer } from './JumperWidget.style';
import { mergeSx } from '@/utils/theme/mergeSx';
import type { FieldApiLike } from './utils';
import { buildFieldListeners, buildFieldValidators } from './utils';
import { SlippageSettings } from './components/SlippageSettings/SlippageSettings';
import z from 'zod';
import SuperJSON from 'superjson';

const JUMPER_WIDGET_CONTAINER_ID = 'jumper-widget-container-id';
const JUMPER_WIDGET_SIDE_CONTAINER_ID = 'jumper-widget-side-container-id';
const BOTTOM_SHEET_TOP_OFFSET = 24;
const ANIMATION_DURATION_SECONDS = 0.3;
const ANIMATION_DURATION_MS = 0.3 * 1_000;

/**
 * Re-subscribe whenever any part of `values` changes. useStore with selector
 * `(s) => s.values` and default referential comparison can miss updates when
 * the store mutates a nested field while keeping the same `values` object
 * reference—so cross-field `deriveProps` (e.g. after threshold change) do not
 * re-run.
 */
const useFormValuesForDerivation = (form: WidgetFormApi) => {
  const snapshot = useStore(form.store, (s) =>
    SuperJSON.stringify(s.values ?? null),
  );
  return useMemo(() => {
    try {
      const parsed = SuperJSON.parse(snapshot) as Record<
        string,
        unknown
      > | null;
      return parsed ?? {};
    } catch {
      return {};
    }
  }, [snapshot]);
};

interface JumperFormViewProps {
  fields: AnyFieldDefinition[];
}

const JumperFormView: FC<JumperFormViewProps> = ({ fields }) => {
  const form = useFormContext();
  const values = useFormValuesForDerivation(form);

  return (
    <>
      {fields.map((field) => {
        const derived = field.deriveProps?.((key) => values[key]);
        const sanitizeValidators = buildFieldValidators(
          field.sanitizeOn,
          field.sanitizeOnMount,
        );

        const validators = {
          ...sanitizeValidators,
          onChange: ({
            value,
            fieldApi,
          }: {
            value: unknown;
            fieldApi: FieldApiLike;
          }) => {
            sanitizeValidators?.onChange?.({ value, fieldApi });
            const result = field.schema?.safeParse(value);

            return result?.success
              ? undefined
              : (Object.values(
                  z.flattenError(result?.error).fieldErrors,
                ).flat() ?? undefined);
          },
        };

        return (
          <form.Field
            key={field.fieldKey}
            name={field.fieldKey}
            defaultValue={field.defaultValue}
            validators={validators}
            listeners={buildFieldListeners(
              field.sanitizeOn,
              field.sanitizeOnMount,
            )}
          >
            {() => (
              <Fragment key={field.fieldKey}>
                {field.renderField(derived?.fieldProps)}
              </Fragment>
            )}
          </form.Field>
        );
      })}
    </>
  );
};
interface JumperWidgetInnerProps extends JumperWidgetProps {}

const JumperWidgetInner: FC<JumperWidgetInnerProps> = ({
  views,
  statusSheet,
  style,
}) => {
  const form = useFormContext();
  const uiStore = useWidgetStoreInstance();
  const activeField = useZustandStore(uiStore, (s) => s.activeField);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const isAnySheetOpen = statusSheet?.isOpen ?? false;
  const values = useFormValuesForDerivation(form);

  const {
    currentViewId,
    goToView,
    submit,
    settingsViewId,
    goToSettings,
    returnFromSettings,
  } = useWidgetNavigation();
  const foundIndex = views.findIndex((v) => v.id === currentViewId);
  const activeViewIndex = foundIndex === -1 ? 0 : foundIndex;
  const activeView = views[activeViewIndex];
  const isSettingsViewActive =
    !!settingsViewId && currentViewId === settingsViewId;
  const isFirstViewActive = activeViewIndex === 0 && !isSettingsViewActive;

  const handleGoBack = () => {
    if (activeViewIndex === 0) {
      return;
    }
    goToView(views[activeViewIndex - 1].id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.stopPropagation();
    event.preventDefault();
    submit();
  };

  const activeSidePanel = useMemo(() => {
    if (activeView.type !== 'form' || !activeField) {
      return null;
    }
    const config = activeView.fields.find((f) => f.fieldKey === activeField);
    if (!config?.renderSidePanel) {
      return null;
    }
    const derived = config.deriveProps?.((key) => values[key]);
    return config.renderSidePanel(derived?.sidePanelProps);
  }, [activeView, activeField, values]);

  const showSidePanel = activeField && activeSidePanel && !isAnySheetOpen;
  // On small screens, keep the main form mounted while a field side panel is
  // open. Unmounting <JumperFormView> removed all `form.Field` nodes, so
  // dependent-field listeners (e.g. balances `onChangeListenTo: ['chain']`)
  // never ran when the user changed chain from the side panel, leaving
  // derived token lists empty.
  const hideMainViewForMobileSidePanel = isMobile && showSidePanel;

  return (
    <Box
      sx={mergeSx(style?.container, {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        zIndex: 1,
        position: 'relative',
        overflow: showSidePanel ? 'initial' : 'hidden',
      })}
      id={JUMPER_WIDGET_CONTAINER_ID}
    >
      <Box
        sx={hideMainViewForMobileSidePanel ? { display: 'none' } : undefined}
      >
        <HeightAnimatedContainer
          isOpen={isAnySheetOpen}
          offsetHeight={BOTTOM_SHEET_TOP_OFFSET}
          animationDuration={ANIMATION_DURATION_SECONDS}
          defaultHeight="100%"
        >
          {({ onHeightChange, motionProps }) => (
            <motion.div {...motionProps} style={{ x: 0, y: 0 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <SectionCard sx={style?.mainView}>
                  {activeView.title &&
                    (isSettingsViewActive ? (
                      <GoBackHeader
                        header={activeView.title}
                        onBack={returnFromSettings ?? handleGoBack}
                      />
                    ) : isFirstViewActive ? (
                      <MainHeader
                        header={activeView.title}
                        onSettingsClick={goToSettings}
                      />
                    ) : (
                      <GoBackHeader
                        header={activeView.title}
                        onBack={handleGoBack}
                      />
                    ))}
                  <Box sx={style?.mainViewContent}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeView.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ overflow: 'auto', flex: 1 }}
                      >
                        <ContentContainer>
                          {activeView.type === 'form' ? (
                            <>
                              {activeView.content}
                              <JumperFormView fields={activeView.fields} />
                            </>
                          ) : (
                            activeView.content
                          )}
                          {activeView.actions}
                        </ContentContainer>
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                </SectionCard>

                {statusSheet && (
                  <StatusBottomSheet
                    containerId={JUMPER_WIDGET_CONTAINER_ID}
                    isOpen={statusSheet.isOpen}
                    onClose={statusSheet.onClose}
                    onHeightChange={onHeightChange}
                    transitionDuration={{ enter: ANIMATION_DURATION_MS }}
                    {...statusSheet.content}
                  >
                    {statusSheet.children}
                  </StatusBottomSheet>
                )}
              </Box>
            </motion.div>
          )}
        </HeightAnimatedContainer>
      </Box>

      <AnimatePresence mode="popLayout">
        {showSidePanel && (
          <motion.div
            key={activeField}
            initial={{ opacity: 0, x: isMobile ? 0 : '-50%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : '-50%' }}
            transition={{ duration: 0.2 }}
            style={{
              width: isMobile ? '100%' : 'auto',
              height: isMobile ? '100%' : 'auto',
              zIndex: -1,
            }}
          >
            <SectionCard
              id={JUMPER_WIDGET_SIDE_CONTAINER_ID}
              sx={style?.sideView}
            >
              {activeSidePanel}
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

interface JumperWidgetProps {
  views: WidgetView[];
  statusSheet?: JumperWidgetStatusSheetProp;
  style?: {
    container?: SxProps<Theme>;
    mainView?: SxProps<Theme>;
    mainViewContent?: SxProps<Theme>;
    sideView?: SxProps<Theme>;
  };
  onNavigation?: (context: NavigationContextValue) => void;
  /**
   * Configures which built-in settings are shown in the auto-generated settings panel.
   * When provided, a settings icon appears in the main header.
   */
  settings?: JumperWidgetSettings;
  /** ID of a custom view to use as the settings panel. Use `settings` prop instead for built-in settings. */
  settingsViewId?: string;
  formListeners?: JumperWidgetFormListeners;
}

export const JumperWidget: FC<JumperWidgetProps> = ({
  views,
  statusSheet,
  style,
  onNavigation,
  settings,
  settingsViewId: externalSettingsViewId,
  formListeners: formListenersProp,
}) => {
  const { t } = useTranslation();

  const resolvedSettingsViewId = settings
    ? INTERNAL_SETTINGS_VIEW_ID
    : externalSettingsViewId;

  const allViews = useMemo(() => {
    if (!settings) {
      return views;
    }
    const settingsView: WidgetView = {
      type: 'custom',
      id: INTERNAL_SETTINGS_VIEW_ID,
      title: t('jumperWidget.settings.title'),
      content: (
        <>
          {settings.slippage && (
            <SlippageSettings
              value={settings.slippage.value}
              defaultValue={settings.slippage.defaultValue}
              onChange={settings.slippage.onChange}
              showWarning={settings.slippage.showWarning}
            />
          )}
        </>
      ),
    };
    return [...views, settingsView];
  }, [views, settings, t]);

  const uiStoreRef = useRef<ReturnType<typeof createWidgetStore> | null>(null);
  if (!uiStoreRef.current) {
    uiStoreRef.current = createWidgetStore();
  }

  const [currentViewId, setCurrentViewId] = useState(views[0].id);
  const [settingsReturnViewId, setSettingsReturnViewId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<Error | null>(null);

  const allFields = useMemo(
    () => views.flatMap((v) => (v.type === 'form' ? v.fields : [])),
    [views],
  );

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        allFields
          .filter((f) => f.defaultValue !== undefined)
          .map((f) => [f.fieldKey, f.defaultValue]),
      ),
    [allFields],
  );

  const goToView = useCallback((id: string) => {
    setCurrentViewId(id);
    setError(null);
    uiStoreRef.current!.getState().setActiveField(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const activeView =
    allViews.find((v) => v.id === currentViewId) ?? allViews[0];

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await activeView.onSubmit?.({ goToView, values: value });
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    listeners: formListenersProp
      ? {
          onChange: ({ formApi, fieldApi }) => {
            formListenersProp.onChange?.({
              formApi: formApi as WidgetFormApi,
              fieldApi: { name: String(fieldApi.name) },
            });
          },
        }
      : undefined,
  });

  // Sync form state when defaultValues change (e.g. async data like lpTokenAmount loads).
  // Guard with shallow equality: parent re-renders can produce a new defaultValues object
  // reference even when every key/value is identical, which would reset user input.
  const prevDefaultValuesRef = useRef<Record<string, unknown> | null>(null);
  useEffect(() => {
    const prev = prevDefaultValuesRef.current;
    if (!isEqual(prev, defaultValues)) {
      prevDefaultValuesRef.current = defaultValues;
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // Kept as a ref so resetForm doesn't need them as useCallback deps,
  // which would make navigationContext unstable on every render.
  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;
  const firstViewIdRef = useRef(views[0].id);
  firstViewIdRef.current = views[0].id;

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting) as boolean;

  const submit = useCallback(() => {
    void form.handleSubmit();
  }, [form]);

  const resetForm = useCallback(() => {
    form.reset(defaultValuesRef.current);
    setCurrentViewId(firstViewIdRef.current);
    setError(null);
    uiStoreRef.current!.getState().setActiveField(null);
  }, [form]);

  const closeSidePanel = useCallback(() => {
    uiStoreRef.current!.getState().setActiveField(null);
  }, []);

  const goToSettings = useCallback(() => {
    if (!resolvedSettingsViewId) {
      return;
    }
    setSettingsReturnViewId(currentViewId);
    setCurrentViewId(resolvedSettingsViewId);
    setError(null);
    uiStoreRef.current!.getState().setActiveField(null);
  }, [currentViewId, resolvedSettingsViewId]);

  const returnFromSettings = useCallback(() => {
    setCurrentViewId(settingsReturnViewId ?? firstViewIdRef.current);
    setSettingsReturnViewId(null);
    setError(null);
    uiStoreRef.current!.getState().setActiveField(null);
  }, [settingsReturnViewId]);

  const navigationContext = useMemo(
    () => ({
      currentViewId,
      goToView,
      submit,
      isSubmitting,
      error,
      clearError,
      resetForm,
      closeSidePanel,
      ...(resolvedSettingsViewId && {
        settingsViewId: resolvedSettingsViewId,
        goToSettings,
        returnFromSettings,
      }),
    }),
    [
      currentViewId,
      goToView,
      submit,
      isSubmitting,
      error,
      clearError,
      resetForm,
      closeSidePanel,
      resolvedSettingsViewId,
      goToSettings,
      returnFromSettings,
    ],
  );

  useEffect(() => {
    onNavigation?.(navigationContext);
  }, [navigationContext, onNavigation]);

  return (
    <WidgetStoreContext.Provider value={uiStoreRef.current}>
      <FormContext.Provider value={form}>
        <NavigationContext.Provider value={navigationContext}>
          <JumperWidgetInner
            views={allViews}
            statusSheet={statusSheet}
            style={style}
          />
        </NavigationContext.Provider>
      </FormContext.Provider>
    </WidgetStoreContext.Provider>
  );
};
