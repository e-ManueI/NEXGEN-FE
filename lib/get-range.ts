export const getDateRange = (range: string | null) => {
  const now = new Date();
  let startDate: Date;

  switch (range) {
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(
        now.setFullYear(now.getFullYear(), now.getMonth() - 1),
      );
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(0); // All time
  }

  return { startDate, endDate: new Date() };
};
