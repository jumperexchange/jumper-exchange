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
import { useStore } from 'zustand';
import { z } from 'zod';
import {
  FieldMetaContext,
  FormSchemaContext,
  NavigationContext,
  useWidgetNavigation,
  type FieldMetaMap,
} from './context';
import {
  WidgetStoreContext,
  createWidgetStore,
  useWidgetStoreInstance,
} from './store';
import type {
  AnyFieldDefinition,
  JumperWidgetStatusSheetProp,
  WidgetView,
} from './types';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { GoBackHeader, MainHeader } from './components/Headers';
import { ContentContainer } from './JumperWidget.style';
import { mergeSx } from '@/utils/theme/mergeSx';

const JUMPER_WIDGET_CONTAINER_ID = 'jumper-widget-container-id';
const JUMPER_WIDGET_SIDE_CONTAINER_ID = 'jumper-widget-side-container-id';
const BOTTOM_SHEET_TOP_OFFSET = 24;
const ANIMATION_DURATION_SECONDS = 0.3;
const ANIMATION_DURATION_MS = 0.3 * 1_000;

// ─── Form view — field orchestration ─────────────────────────────────────────

interface JumperFormViewProps {
  fields: AnyFieldDefinition[];
}

const JumperFormView: FC<JumperFormViewProps> = ({ fields }) => {
  const store = useWidgetStoreInstance();
  const values = useStore(store, (s) => s.values);

  // Initialise default values on mount
  useEffect(() => {
    const defaults = Object.fromEntries(
      fields
        .filter((f) => f.defaultValue !== undefined)
        .map((f) => [f.fieldKey, f.defaultValue]),
    );
    if (Object.keys(defaults).length > 0) {
      store.getState().setValues(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Orchestration — derive + sanitize on every store update
  useEffect(() => {
    const { getValue, setValues } = store.getState();
    const pending: Record<string, unknown> = {};

    const getEffectiveValue = (key: string): unknown =>
      key in pending ? pending[key] : getValue(key);

    for (const field of fields) {
      const derived = field.deriveProps(getEffectiveValue);
      const current = getEffectiveValue(field.fieldKey);
      const sanitized = field.sanitizeValue(current, derived);

      if (sanitized !== current) {
        if (process.env.NODE_ENV === 'development') {
          if (JSON.stringify(sanitized) === JSON.stringify(current)) {
            console.warn(
              `[JumperWidget] sanitizeValue for "${field.fieldKey}" returned a new reference ` +
                `with the same value. Return the same reference when nothing changes to avoid infinite loops.`,
            );
          }
        }
        pending[field.fieldKey] = sanitized;
      }
    }

    if (Object.keys(pending).length > 0) {
      setValues(pending);
    }
  }, [values, fields, store]);

  const renderedFields = useMemo(() => {
    return fields.map((field) => {
      const derived = field.deriveProps((key) => values[key]);
      return (
        <Fragment key={field.fieldKey}>
          {field.renderField(derived.fieldProps)}
        </Fragment>
      );
    });
  }, [fields, values]);

  return <>{renderedFields}</>;
};

interface JumperWidgetInnerProps extends JumperWidgetProps {}

const JumperWidgetInner: FC<JumperWidgetInnerProps> = ({
  views,
  statusSheet,
  style,
}) => {
  const store = useWidgetStoreInstance();
  const values = useStore(store, (s) => s.values);
  const activeField = useStore(store, (s) => s.activeField);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const isAnySheetOpen = statusSheet?.isOpen ?? false;

  const { currentViewId, goToView, submit } = useWidgetNavigation();
  const activeViewIndex = views.findIndex((v) => v.id === currentViewId) ?? 0;
  const activeView = views[activeViewIndex];
  const isFirstViewActive = activeViewIndex === 0;

  const handleGoBack = () => {
    if (activeViewIndex === 0) {
      return;
    }
    const previousViewIndex = activeViewIndex - 1;
    const previewsViewId = views[previousViewIndex].id;

    goToView(previewsViewId);
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.stopPropagation();
    event.preventDefault();
    submit();
  };

  // Side panel only exists for form views
  const activeSidePanel = useMemo(() => {
    if (activeView.type !== 'form' || !activeField) {
      return null;
    }
    const config = activeView.fields.find((f) => f.fieldKey === activeField);
    if (!config?.renderSidePanel) {
      return null;
    }
    const derived = config.deriveProps((key) => values[key]);
    return config.renderSidePanel(derived.sidePanelProps);
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

      <AnimatePresence mode="wait">
        {showSidePanel && (
          <motion.div
            key={activeField}
            initial={{ opacity: 0, x: isMobile ? 0 : '-50%', zIndex: -1 }}
            animate={{ opacity: 1, x: 0, zIndex: -1 }}
            exit={{ opacity: 0, x: isMobile ? 0 : '-50%', zIndex: -1 }}
            transition={{ duration: 0.2 }}
            style={{
              width: isMobile ? '100%' : 'auto',
              height: isMobile ? '100%' : 'auto',
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

// ─── Outer widget — store, contexts, view state, async submit ─────────────────

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
  const storeRef = useRef<ReturnType<typeof createWidgetStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createWidgetStore();
  }

  const [currentViewId, setCurrentViewId] = useState(views[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const goToView = useCallback((id: string) => {
    setCurrentViewId(id);
    setError(null);
    // Close any open side panel when navigating between views
    storeRef.current!.getState().setActiveField(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const activeView = views.find((v) => v.id === currentViewId) ?? views[0];

  const submit = useCallback(async () => {
    if (!activeView.onSubmit || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await activeView.onSubmit({
        goToView,
        values: storeRef.current!.getState().values,
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsSubmitting(false);
    }
  }, [activeView, goToView, isSubmitting]);

  // Build field meta from ALL form views — store is shared across views
  const allFields = useMemo(
    () => views.flatMap((v) => (v.type === 'form' ? v.fields : [])),
    [views],
  );

  const fieldMetaMap = useMemo<FieldMetaMap>(
    () =>
      Object.fromEntries(
        allFields.map((f) => [
          f.fieldKey,
          { schema: f.schema, defaultValue: f.defaultValue },
        ]),
      ),
    [allFields],
  );

  // Form schema derived from all fields — used by useFormValidation
  const formSchema = useMemo(
    () =>
      z.object(
        Object.fromEntries(allFields.map((f) => [f.fieldKey, f.schema])),
      ),
    [allFields],
  );

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
    <WidgetStoreContext.Provider value={storeRef.current}>
      <FieldMetaContext.Provider value={fieldMetaMap}>
        <FormSchemaContext.Provider value={formSchema}>
          <NavigationContext.Provider value={navigationContext}>
            <JumperWidgetInner
              views={views}
              statusSheet={statusSheet}
              style={style}
            />
          </NavigationContext.Provider>
        </FormSchemaContext.Provider>
      </FieldMetaContext.Provider>
    </WidgetStoreContext.Provider>
  );
};
