const dayjs = require("dayjs");
const revenueEntity = require("../../model/revenue.model");
exports.getRevenueTrend = async (req, res) => {
  try {
    const startOf7DayAgo = dayjs().subtract(7, "day").toDate();
    const endOfToday = dayjs().endOf("week").toDate();
    const revenue = await revenueEntity.aggregate([
      {
        $match: { createdAt: { $gt: startOf7DayAgo, $lt: endOfToday } },
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
    console.log({ error: error });
  }
};
exports.getDailyCategoryStats = async (req, res) => {
  try {
    const start = dayjs().startOf("day").toDate();
    const end = dayjs().endOf("day").toDate();
    const revenue = await revenueEntity.aggregate([
      {
        $match: { createdAt: { $gt: start, $lt: end } },
      },
      {
        $lookup: {
          from: "product", // Tên collection
          localField: "productId", // Khóa ngoại ở bảng revenue
          foreignField: "_id", // Khóa chính ở bảng product
          as: "productInfo", // Tên biến tạm chứa thông tin sp
        },
      },
      { $unwind: "$productInfo" }, // Trải phẳng mảng productInfo
      {
        $group: {
          _id: "$productInfo.categoryId",
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
  } catch (error) {}
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
    console.log({ error: error });
  }
};
