import { useState, useMemo, useCallback, FormEvent, useEffect } from 'react';
import z from 'zod';
import FormControl from '@mui/material/FormControl';

import { Button } from 'src/components/Button/Button';
import { useMissionStore } from 'src/stores/mission';
import { TaskWidgetInformationInputData } from 'src/types/strapi';
import { MissionInstructionFormContainer } from './MissionWidget.styles';
import { useVerifyTaskWithSharedState } from 'src/hooks/tasksVerification/useVerifyTaskWithSharedState';
import { useTranslation } from 'react-i18next';
import { TaskInput } from 'src/components/Form/TaskInput/TaskInput';

const buildDynamicSchema = (taskInputs: TaskWidgetInformationInputData[]) => {
  const shape = taskInputs.reduce(
    (acc, { inputId }) => {
      acc[inputId] = z.string().min(1, 'Required');
      return acc;
    },
    {} as Record<string, z.ZodString>,
  );

  return z.object(shape);
};

export const MissionForm = () => {
  const {
    taskCTAText,
    taskInputs,
    currentActiveTaskId,
    currentActiveTaskName,
    missionId,
    setTaskFormState,
  } = useMissionStore();
  const { t } = useTranslation();
  const taskCTATextWithFallback =
    taskCTAText ?? t('missions.tasks.action.verify');

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { handleVerifyTask, isPending } = useVerifyTaskWithSharedState(
    missionId!,
    currentActiveTaskId!,
    currentActiveTaskName,
  );

  const schema = useMemo(
    () => buildDynamicSchema(taskInputs ?? []),
    [taskInputs],
  );

  const isFormValid = useMemo(() => {
    const result = schema.safeParse(formValues);
    return result.success;
  }, [formValues, schema]);

  useEffect(() => {
    if (currentActiveTaskId) {
      setTaskFormState(currentActiveTaskId, true, isFormValid);
    }
  }, [currentActiveTaskId, isFormValid, setTaskFormState]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLDivElement>) => {
      event.preventDefault();

      const form = event.currentTarget as unknown as HTMLFormElement;
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());

      const result = schema.safeParse(values);
      if (!result.success) {
        console.error('Validation failed', result.error.format());
        return;
      }

      handleVerifyTask({
        ...result.data,
      });
    },
    [schema, handleVerifyTask],
  );

  return (
    <MissionInstructionFormContainer as="form" onSubmit={handleSubmit}>
      {taskInputs?.map((taskInput) => (
        <FormControl key={taskInput.inputId} sx={{ width: '100%' }}>
          <TaskInput
            id={taskInput.inputId}
            name={taskInput.inputId}
            placeholder={taskInput.inputPlaceholder}
            onChange={handleChange}
            sx={{
              '& input': {
                borderColor: (theme) => {
                  const hasValue = !!formValues[taskInput.inputId]?.trim();
                  return hasValue
                    ? 'transparent'
                    : (theme.vars || theme).palette.grey[100];
                },
              },
            }}
          />
        </FormControl>
      ))}
      <Button
        fullWidth
        disabled={!isFormValid || isPending}
        variant={isFormValid && !isPending ? 'primary' : 'transparent'}
        type="submit"
      >
        {taskCTATextWithFallback}
      </Button>
    </MissionInstructionFormContainer>
  );
};
