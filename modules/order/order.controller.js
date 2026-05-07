const orderEntity = require("../../model/order.model");
const productEntity = require("../../model/product.model");
const cartEntity = require("../../model/cart.model");
const revenueEntity = require("../../model/revenue.model");
const dayjs = require("dayjs");

const start = dayjs().startOf("day").toDate();
const end = dayjs().endOf("day").toDate();

// 1. Lấy danh sách đơn hàng
exports.getOrder = async (req, res) => {
  try {
    const { _page = 1, _limit = 10, status, paymentStatus } = req.query;

    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const options = {
      page: parseInt(_page),
      limit: parseInt(_limit),
      sort: { createdAt: -1 },
    };

    const orders = await orderEntity.paginate(query, options);

    return res.status(200).json({ result: orders });
  } catch (error) {
    return res.status(500).json({
      message: "Lấy danh sách đơn hàng thất bại",
    });
  }
};

// 2. Lấy chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderEntity.findById(id).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng này",
      });
    }

    return res.status(200).json({
      result: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lấy thông tin đơn hàng thất bại",
    });
  }
};

// 3. Lấy đơn hàng của user
exports.getUserOrder = async (req, res) => {
  try {
    const payload = req.payload;

    if (!payload) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    const userId = payload.sub;

    const { _page = 1, _limit = 10 } = req.query;

    const option = {
      page: parseInt(_page),
      limit: parseInt(_limit),
      sort: { createdAt: -1 },
    };

    const orders = await orderEntity.paginate({ userId }, option);

    return res.status(200).json({
      result: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lấy danh sách đơn hàng thất bại",
    });
  }
};

// 4. Tạo đơn hàng (CHỈ COD)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.payload.sub;

    const { fullname, address, phone, items, total } = req.body;

    // Kiểm tra tồn kho
    for (const item of items) {
      const product = await productEntity.findById(item.productId._id);

      if (!product) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại",
        });
      }

      if (product.quantityStock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.productName}" chỉ còn ${product.quantityStock} cái`,
        });
      }
    }

    // Chuẩn bị items
    const arrayItems = items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      amount: item.productId.price * item.quantity,
    }));

    // Tạo đơn hàng
    await orderEntity.create({
      userId,
      fullname,
      address,
      phone,
      paymentMethod: "cod",
      paymentStatus: "Chưa thanh toán",
      totalAmount: total,
      items: arrayItems,
    });

    // Xóa khỏi giỏ hàng
    const itemIds = items.map((val) => val._id);

    await cartEntity.updateOne(
      { userId },
      {
        $pull: {
          items: {
            _id: { $in: itemIds },
          },
        },
      }
    );

    return res.status(200).json({
      message: "Đặt hàng thành công",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Tạo đơn hàng thất bại",
    });
  }
};

// 5. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, paymentStatus, note } = req.body;

    const order = await orderEntity.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    let updateData = {
      status,
      paymentStatus,
      note,
    };

    // Nếu COD và đã giao -> tự động thanh toán
    if (status === "Đã giao" && order.paymentMethod === "cod") {
      updateData.paymentStatus = "Đã thanh toán";

      await Promise.all(
        order.items.map(async (value) => {
          const item = await revenueEntity.findOne({
            productId: value.productId,
            createdAt: {
              $gt: start,
              $lt: end,
            },
          });

          if (item === null) {
            await revenueEntity.create({
              productId: value.productId,
              totalQuantity: value.quantity,
              totalAmount: value.amount,
            });
          } else {
            await revenueEntity.updateOne(
              {
                productId: value.productId,
                createdAt: {
                  $gt: start,
                  $lt: end,
                },
              },
              {
                $inc: {
                  totalQuantity: value.quantity,
                  totalAmount: value.amount,
                },
              }
            );
          }
        })
      );
    }

    const updatedOrder = await orderEntity.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      result: updatedOrder,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cập nhật thất bại",
    });
  }
};

// 6. Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderEntity.findById(id);

    if (!order || order.status === "Đã giao" || order.status === "Đang giao") {
      return res.status(400).json({
        message: "Không thể hủy đơn hàng ở trạng thái này",
      });
    }

    await orderEntity.findByIdAndUpdate(id, {
      status: "Đã hủy",
    });

    return res.status(200).json({
      message: "Đã hủy đơn hàng thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hủy đơn hàng thất bại",
    });
  }
};
