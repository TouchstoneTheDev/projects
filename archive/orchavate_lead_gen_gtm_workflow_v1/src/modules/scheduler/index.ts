export interface ScheduleOptions {
  cronExpression: string;
}

export const scheduleScan = async (_options: ScheduleOptions): Promise<void> => {
  return;
};
