import * as transactionRepository from '@/repositories/transactionRepository'

export const getDashboardStats = async () => {
  try {
    const [orders, units, topItems, byPlatform, byStatus] = await Promise.all([
      transactionRepository.countOrders(),
      transactionRepository.sumUnitsSold(),
      transactionRepository.topSoldProducts(),
      transactionRepository.salesByPlatform(),
      transactionRepository.getOrderStatusBreakdown(),
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

      topItems: topItems.map(item => ({
        ...item,
        totalSold: Number(item.totalSold),
      })),

      salesByPlatform: byPlatform.map(p => ({
        platform: p.platform,
        total: Number(p.total),
      })),

      salesByStatus: byStatus.map(s => ({
        status: s.status,
        count: Number(s.count),
      })),
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    throw error;
  }
};
