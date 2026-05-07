const dayjs = require("dayjs");
const revenueEntity = require("../../model/revenue.model");
exports.getRevenueTrend = async (req, res) => {
  try {
    const startOf7DayAgo = dayjs().subtract(7, "day").toDate();
    const endOfToday = dayjs().endOf("day").toDate();
    const revenue = await revenueEntity.aggregate([
      {
        $match: { createdAt: { $gte: startOf7DayAgo, $lte: endOfToday } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).json({ result: revenue });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};
exports.getDailyCategoryStats = async (req, res) => {
  try {
    const startOfToday = dayjs().startOf("day").toDate();
    const endOfToday = dayjs().endOf("day").toDate();
    const categoryStats = await revenueEntity.aggregate([
      {
        $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } },
      },
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $group: {
          _id: "$productInfo.categoryId",
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);
    return res.status(200).json({ result: categoryStats });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};
exports.getBestSeller = async (req, res) => {
  try {
    const bestSeller = await revenueEntity.aggregate([
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $group: {
          _id: "$productInfo.productName",
          totalQuantity: { $sum: "$totalQuantity" },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    return res.status(200).json({ result: bestSeller });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};
