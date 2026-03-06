const orderEntity = require("../../model/order.model");
const productEntity = require("../../model/product.model");
const cartEntity = require("../../model/cart.model");

// Get all orders with pagination
exports.getOrder = async (req, res) => {
  try {
    const arrayOrders = await orderEntity.find();
    const {
      _page = 1,
      _limit = arrayOrders?.length,
      orderId,
      userId,
      status,
      paymentStatus,
    } = req.query;

    let query = {};
    const options = {
      page: _page,
      limit: _limit,
      sort: { createdAt: -1 },
    };
    if (orderId) {
      const order = await orderEntity
        .findOne({ _id: orderId })
        .populate("items.productId");
      return res.status(200).json({ result: order });
    }
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await orderEntity.paginate(query, options);
    return res.status(200).json({ result: orders });
  } catch (error) {
    console.log("Error in getOrder:", error.message);
    return res.status(500).json({ message: "Lấy danh sách đơn hàng thất bại" });
  }
};

// Get order by ID with items
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderEntity
      .findById(id)
      .populate("userId")
      .populate("couponId");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const orderItems = await orderItemsEntity
      .find({ orderId: id })
      .populate("productId");

    return res
      .status(200)
      .json({ result: { ...order.toObject(), items: orderItems } });
  } catch (error) {
    console.log("Error in getOrderById:", error.message);
    return res.status(500).json({ message: "Lấy thông tin đơn hàng thất bại" });
  }
};

// Create new order
exports.postOrder = async (req, res) => {
  try {
    const { userId, fullname, address, phone, paymentMethod, items, total } =
      req.body;
    let arrayItems = [];
    if (items?.length > 0) {
      items.forEach((value) => {
        arrayItems.push({
          productId: value.productId._id,
          quantity: value.quantity,
          price: value.productId.price,
          amount: value.productId.price * value.quantity,
        });
      });
    }
    // Create order
    await orderEntity.create({
      userId,
      fullname,
      address,
      phone,
      paymentMethod,
      totalAmount: total,
      items: arrayItems,
    });
    //Xóa item đã đặt ra khỏi giỏ hàng
    const itemIds = items?.map((value) => value._id);
    await cartEntity.updateOne(
      { userId },
      { $pull: { items: { _id: { $in: itemIds } } } }
    );
    return res.status(200).json({ message: "Đặt hàng thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postOrder", error.message);
    return res.status(500).json({ message: "Tạo đơn hàng thất bại" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { status, paymentStatus, note } = req.body;

    if (!status && !paymentStatus && !note) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp thông tin cần cập nhật" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (note) updateData.note = note;

    const updatedOrder = await orderEntity
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("userId")
      .populate("couponId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    return res.status(200).json({ result: updatedOrder });
  } catch (error) {
    console.log("Error in updateOrderStatus:", error.message);
    return res.status(500).json({ message: "Cập nhật đơn hàng thất bại" });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderEntity.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.status === "Đã giao" || order.status === "Đã hủy") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng này" });
    }

    // Restore product stock
    const orderItems = await orderItemsEntity.find({ orderId: id });
    for (const item of orderItems) {
      await productEntity.findByIdAndUpdate(item.productId, {
        $inc: { quantityStock: item.quantity },
      });
    }

    const cancelledOrder = await orderEntity
      .findByIdAndUpdate(id, { status: "Đã hủy" }, { new: true })
      .populate("userId")
      .populate("couponId");

    return res.status(200).json({ result: cancelledOrder });
  } catch (error) {
    console.log("Error in cancelOrder:", error.message);
    return res.status(500).json({ message: "Hủy đơn hàng thất bại" });
  }
};

// Get orders by user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Vui lòng cung cấp userId" });
    }

    const orders = await orderEntity
      .find({ userId })
      .populate("userId")
      .populate("couponId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ result: orders });
  } catch (error) {
    console.log("Error in getUserOrders:", error.message);
    return res
      .status(500)
      .json({ message: "Lấy đơn hàng của người dùng thất bại" });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderEntity.countDocuments();
    const completedOrders = await orderEntity.countDocuments({
      status: "Đã giao",
    });
    const cancelledOrders = await orderEntity.countDocuments({
      status: "Đã hủy",
    });
    const pendingOrders = await orderEntity.countDocuments({
      status: "Chờ xác nhận",
    });

    const totalRevenue = await orderEntity.aggregate([
      { $match: { status: "Đã giao" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    return res.status(200).json({
      result: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.log("Error in getOrderStats:", error.message);
    return res.status(500).json({ message: "Lấy thống kê đơn hàng thất bại" });
  }
};

// Delete order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderEntity.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Delete order items
    await orderItemsEntity.deleteMany({ orderId: id });

    // Delete order
    await orderEntity.findByIdAndDelete(id);

    return res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.log("Error in deleteOrder:", error.message);
    return res.status(500).json({ message: "Xóa đơn hàng thất bại" });
  }
};
