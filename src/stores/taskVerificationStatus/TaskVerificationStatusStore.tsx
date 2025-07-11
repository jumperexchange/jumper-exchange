import { createWithEqualityFn } from 'zustand/traditional';

export enum TaskVerificationStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}
interface TaskVerificationStatusState {
  statusMap: Record<string, TaskVerificationStatus>;
  setStatus: (
    missionId: string,
    taskId: string,
    status: TaskVerificationStatus,
  ) => void;
  getStatus: (missionId: string, taskId: string) => TaskVerificationStatus;
  resetStatus: (missionId: string, taskId: string) => void;
}

const getKey = (missionId: string, taskId: string) => `${missionId}:${taskId}`;

export const useTaskVerificationStatusStore =
  createWithEqualityFn<TaskVerificationStatusState>(
    (set, get) => ({
      statusMap: {},

      setStatus: (missionId, taskId, status) => {
        const key = getKey(missionId, taskId);
        set((state) => ({
          statusMap: { ...state.statusMap, [key]: status },
        }));
      },

      getStatus: (missionId, taskId) => {
        const key = getKey(missionId, taskId);
        return get().statusMap[key] || TaskVerificationStatus.Idle;
      },

      resetStatus: (missionId, taskId) => {
        const key = getKey(missionId, taskId);
        set((state) => {
          const { [key]: _, ...rest } = state.statusMap;
          return { statusMap: rest };
        });
      },
    }),
    Object.is,
  );
