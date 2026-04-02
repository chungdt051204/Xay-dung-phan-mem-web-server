const orderEntity = require("../../model/order.model");
const productEntity = require("../../model/product.model");
const cartEntity = require("../../model/cart.model");
const revenueEntity = require("../../model/revenue.model");
const crypto = require("crypto");
const axios = require("axios");
const dayjs = require("dayjs");
const start = dayjs().startOf("day").toDate();
const end = dayjs().endOf("day").toDate();
// 1. Lấy danh sách đơn hàng (Phân trang + Lọc)
exports.getOrder = async (req, res) => {
  try {
    const {
      _page = 1,
      _limit = 10,
      orderId,
      userId,
      status,
      paymentStatus,
    } = req.query;

    if (orderId) {
      const order = await orderEntity
        .findById(orderId)
        .populate("items.productId");
      return res.status(200).json({ result: order });
    }

    let query = {};
    if (userId) query.userId = userId;
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
    return res.status(500).json({ message: "Lấy danh sách đơn hàng thất bại" });
  }
};

// 2. Tạo đơn hàng mới
exports.postOrder = async (req, res) => {
  try {
    if (!req.payload)
      return res.status(401).json({ message: "Vui lòng đăng nhập" });

    const userId = req.payload.sub;
    const { fullname, address, phone, paymentMethod, items, total } = req.body;

    // Kiểm tra số lượng sản phẩm có sẵn
    for (const item of items) {
      const product = await productEntity.findById(item.productId._id);
      if (!product) {
        return res.status(404).json({
          message: `Sản phẩm không tồn tại`,
        });
      }
      if (product.quantityStock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.productName}" chỉ còn ${product.quantityStock} cái. Bạn không thể đặt ${item.quantity} cái`,
        });
      }
    }

    // Chuẩn bị mảng items
    let arrayItems = [];
    for (const item of items) {
      arrayItems.push({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        amount: item.productId.price * item.quantity,
      });
    }
    console.log(arrayItems);

    const newOrder = await orderEntity.create({
      userId,
      fullname,
      address,
      phone,
      paymentMethod,
      totalAmount: total,
      items: arrayItems,
    });

    // Xóa item khỏi giỏ hàng
    const itemIds = items.map((val) => val._id);
    await cartEntity.updateOne(
      { userId },
      { $pull: { items: { _id: { $in: itemIds } } } }
    );

    // Xử lý theo phương thức thanh toán
    if (paymentMethod === "cod") {
      return res.status(200).json({ message: "Đặt hàng thành công" });
    }

    if (paymentMethod === "online") {
      // Logic MOMO (Giữ nguyên cấu hình của bạn)
      const partnerCode = "MOMO",
        accessKey = "F8BBA842ECF85",
        secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const requestId = partnerCode + new Date().getTime();
      const orderInfo = `Thanh toán đơn hàng ${newOrder._id}`;
      const redirectUrl = `${process.env.URL_BACKEND}/momo-callback`,
        ipnUrl = "https://callback.url/notify";

      const rawSignature = `accessKey=${accessKey}&amount=${total}&extraData=&ipnUrl=${ipnUrl}&orderId=${newOrder._id}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;
      const signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");

      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        {
          partnerCode,
          accessKey,
          requestId,
          amount: total,
          orderId: newOrder._id,
          orderInfo,
          redirectUrl,
          ipnUrl,
          extraData: "",
          requestType: "payWithMethod",
          signature,
          lang: "en",
        }
      );
      return res.status(200).json({ url: response.data.payUrl });
    }
  } catch (error) {
    console.log({ error: error.message });
    return res
      .status(500)
      .json({ message: "Tạo đơn hàng thất bại", error: error.message });
  }
};

// 3. Momo Callback
exports.getMomoCallback = async (req, res) => {
  try {
    const { orderId, resultCode, message } = req.query;
    if (resultCode == 0) {
      const order = await orderEntity.findOne({ _id: orderId });
      if (!order)
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      await orderEntity.findByIdAndUpdate(orderId, {
        paymentStatus: "Đã thanh toán",
      });
      await Promise.all(
        order?.items?.map(async (value) => {
          const item = await revenueEntity.findOne({
            productId: value.productId,
            createdAt: { $gt: start, $lt: end },
          });
          if (item === null)
            await revenueEntity.create({
              productId: value.productId,
              // productName: value.productName,
              totalQuantity: value.quantity,
              totalAmount: value.amount,
            });
          else {
            await revenueEntity.updateOne(
              {
                productId: value.productId,
                createdAt: { $gt: start, $lt: end },
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

      return res.redirect(
        `${process.env.URL_FRONTEND}/cart?message=${message}`
      );
    }
    return res
      .status(400)
      .json("Thanh toán thất bại", { error: error.message });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi callback Momo", error: error.message });
  }
};

// 4. Cập nhật trạng thái đơn hàng (Tối ưu logic tự động)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { status, paymentStatus, note } = req.body;

    const order = await orderEntity.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    let updateData = { status, paymentStatus, note };

    // Tự động cập nhật thanh toán cho COD khi hoàn thành
    if (status === "Đã giao" && order.paymentMethod === "cod") {
      updateData.paymentStatus = "Đã thanh toán";
      await Promise.all(
        order?.items?.map(async (value) => {
          const item = await revenueEntity.findOne({
            productId: value.productId,
            createdAt: { $gt: start, $lt: end },
          });
          if (item === null)
            await revenueEntity.create({
              productId: value.productId,
              // productName: value.productName,
              totalQuantity: value.quantity,
              totalAmount: value.amount,
            });
          else {
            await revenueEntity.updateOne(
              {
                productId: value.productId,
                createdAt: { $gt: start, $lt: end },
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
      { $set: updateData },
      { new: true }
    );
    return res
      .status(200)
      .json({ result: updatedOrder, message: "Cập nhật thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Cập nhật thất bại" });
  }
};

// 5. Hủy đơn hàng (Chỉ dành cho User)
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const order = await orderEntity.findById(id);

    if (!order || order.status === "Đã giao" || order.status === "Đang giao") {
      return res
        .status(400)
        .json({ message: "Không thể hủy đơn hàng ở trạng thái này" });
    }

    await orderEntity.findByIdAndUpdate(id, { status: "Đã hủy" });
    return res.status(200).json({ message: "Đã hủy đơn hàng thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Hủy đơn hàng thất bại" });
  }
};

// 6. Lấy đơn hàng theo User
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await orderEntity.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ result: orders });
  } catch (error) {
    return res.status(500).json({ message: "Lấy đơn hàng thất bại" });
  }
};

// 7. Xóa đơn hàng (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.query;
    await orderEntity.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Xóa đơn hàng thất bại" });
  }
};
