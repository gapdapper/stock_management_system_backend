import * as transactionRepository from "@/repositories/transactionRepository";

export const getDashboardStats = async (month: string) => {
  const splittedMonth = month.split("-")
  const start = new Date(`${splittedMonth[0]}-${splittedMonth[1]}-1`)
  const end = Number(splittedMonth[1]) != 12 ? new Date(`${splittedMonth[0]}-${Number(splittedMonth[1])+1}-1`) : new Date(`${Number(splittedMonth[0])+1}-1-1`); 
  try {
    const [orders, units, topItems, byPlatform, byStatus] = await Promise.all([
      transactionRepository.countOrders(start, end),
      transactionRepository.sumUnitsSold(start, end),
      transactionRepository.topSoldProducts(start, end),
      transactionRepository.salesByPlatform(start, end),
      transactionRepository.getOrderStatusBreakdown(start, end),
    ]);

    const totalOrders = Number(orders[0]?.count ?? 0);
    const totalUnits = Number(units[0]?.total ?? 0);

    if (totalOrders === 0) {
      return {
        totalOrders: 0,
        unitsSold: 0,
        avgItemsPerOrder: 0,
        topItems: [],
        salesByPlatform: [],
        salesByStatus: [],
      };
    }

    return {
      totalOrders,
      unitsSold: totalUnits,
      avgItemsPerOrder: +(totalUnits / totalOrders).toFixed(2),

      topItems: topItems.map((item) => ({
        ...item,
        totalSold: Number(item.totalSold),
      })),

      salesByPlatform: byPlatform.map((p) => ({
        platform: p.platform,
        total: Number(p.total),
      })),

      salesByStatus: byStatus.map((s) => ({
        status: s.status,
        count: Number(s.count),
      })),
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    throw error;
  }
};

export const getAvailableMonths = async (): Promise<string[]> => {
  const allTransactions = await transactionRepository.findAllTransactions();
  const monthsExtracted = [
    ...new Set(
      allTransactions
        .filter((t) => t.createdAt)
        .map((t) => {
          const date = new Date(t.createdAt!);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1);
          return `${year}-${month}`;
        }),
    ),
  ];
  return monthsExtracted.sort();
};
