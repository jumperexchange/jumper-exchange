export const getMonthInfo = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get the last day of the current month to determine the max days
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const maxDays = lastDayOfMonth.getDate();

  // Today's day in the month
  const todayDay = today.getDate();

  // Calculate remaining days in the month
  const remainingDays = maxDays - todayDay;

  return {
    remainingDays,
    today: todayDay,
    maxDays,
  };
};
