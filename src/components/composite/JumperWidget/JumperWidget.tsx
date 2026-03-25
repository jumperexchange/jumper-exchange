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
import {
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
import type {
  AnyFieldDefinition,
  JumperWidgetStatusSheetProp,
  SanitizeListener,
  WidgetView,
} from './types';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { GoBackHeader, MainHeader } from './components/Headers';
import { ContentContainer } from './JumperWidget.style';
import { mergeSx } from '@/utils/theme/mergeSx';
import { buildFieldListeners } from './utils';

const JUMPER_WIDGET_CONTAINER_ID = 'jumper-widget-container-id';
const JUMPER_WIDGET_SIDE_CONTAINER_ID = 'jumper-widget-side-container-id';
const BOTTOM_SHEET_TOP_OFFSET = 24;
const ANIMATION_DURATION_SECONDS = 0.3;
const ANIMATION_DURATION_MS = 0.3 * 1_000;

interface JumperFormViewProps {
  fields: AnyFieldDefinition[];
}

const JumperFormView: FC<JumperFormViewProps> = ({ fields }) => {
  const form = useFormContext();

  const values = useStore(form.store, (s) => s.values);

  return (
    <>
      {fields.map((field) => {
        const derived = field.deriveProps?.((key) => values[key]);

        return (
          <form.Field
            key={field.fieldKey}
            name={field.fieldKey}
            defaultValue={field.defaultValue}
            validators={{ onChange: field.schema }}
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
  // Subscribe to all values so the side panel's deriveProps stays reactive
  const values = useStore(form.store, (s) => s.values);

  const { currentViewId, goToView, submit } = useWidgetNavigation();
  const foundIndex = views.findIndex((v) => v.id === currentViewId);
  const activeViewIndex = foundIndex === -1 ? 0 : foundIndex;
  const activeView = views[activeViewIndex];
  const isFirstViewActive = activeViewIndex === 0;

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
      {(!isMobile || !showSidePanel) && (
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
                    (isFirstViewActive ? (
                      <MainHeader header={activeView.title} />
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
      )}

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
}

export const JumperWidget: FC<JumperWidgetProps> = ({
  views,
  statusSheet,
  style,
}) => {
  const uiStoreRef = useRef<ReturnType<typeof createWidgetStore> | null>(null);
  if (!uiStoreRef.current) {
    uiStoreRef.current = createWidgetStore();
  }

  const [currentViewId, setCurrentViewId] = useState(views[0].id);
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

  const activeView = views.find((v) => v.id === currentViewId) ?? views[0];

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
  });

  // Sync form state when defaultValues change (e.g. async data like lpTokenAmount loads)
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting) as boolean;

  const submit = useCallback(() => {
    void form.handleSubmit();
  }, [form]);

  const navigationContext = useMemo(
    () => ({
      currentViewId,
      goToView,
      submit,
      isSubmitting,
      error,
      clearError,
    }),
    [currentViewId, goToView, submit, isSubmitting, error, clearError],
  );

  return (
    <WidgetStoreContext.Provider value={uiStoreRef.current}>
      <FormContext.Provider value={form}>
        <NavigationContext.Provider value={navigationContext}>
          <JumperWidgetInner
            views={views}
            statusSheet={statusSheet}
            style={style}
          />
        </NavigationContext.Provider>
      </FormContext.Provider>
    </WidgetStoreContext.Provider>
  );
};
