import { useState, useMemo, useCallback, FormEvent } from 'react';
import z from 'zod';
import FormControl from '@mui/material/FormControl';

import { Button } from 'src/components/Button/Button';
import { SelectCard } from 'src/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from 'src/components/Cards/SelectCard/SelectCard.styles';
import { useMissionStore } from 'src/stores/mission';
import { TaskWidgetInformationInputData } from 'src/types/strapi';
import { MissionInstructionFormContainer } from './MissionWidget.styles';
import { useVerifyTaskWithSharedState } from 'src/hooks/tasksVerification/useVerifyTaskWithSharedState';

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
  } = useMissionStore();
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
          <SelectCard
            mode={SelectCardMode.Input}
            id={taskInput.inputId}
            name={taskInput.inputId}
            placeholder={taskInput.inputPlaceholder}
            onChange={handleChange}
          />
        </FormControl>
      ))}
      <Button
        fullWidth
        disabled={!isFormValid || isPending}
        variant={isFormValid && !isPending ? 'primary' : 'transparent'}
        type="submit"
      >
        {taskCTAText}
      </Button>
    </MissionInstructionFormContainer>
  );
};
