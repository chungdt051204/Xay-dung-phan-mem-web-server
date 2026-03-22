const cartEntity = require("../../model/cart.model");
exports.postCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const myCart = await cartEntity.findOne({ userId });
    if (!myCart) {
      await cartEntity.create({ userId, items: [{ productId, quantity }] });
      return res
        .status(200)
        .json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
    } else {
      const cartWithProduct = await cartEntity.findOne({
        $and: [{ userId }, { "items.productId": productId }],
      });
      if (!cartWithProduct) {
        await cartEntity.updateOne(
          { userId },
          { $addToSet: { items: { productId, quantity } } }
        );
        return res
          .status(200)
          .json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
      } else {
        await cartEntity.updateOne(
          { userId, "items.productId": productId },
          { $inc: { "items.$.quantity": quantity } }
        );
        return res.status(200).json({
          message: "Thêm số lượng sản phẩm này vào giỏ hàng thành công",
        });
      }
    }
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm postCart",
      error: error.message,
    });
    return res.status(500).json({
      message: "Thêm sản phẩm vào giỏ hàng thất bại",
      error: error.message,
    });
  }
};
exports.getCart = async (req, res) => {
  try {
    const payload = req.payload;
    if (payload) {
      const myCart = await cartEntity
        .findOne({ userId: payload.sub })
        .populate("items.productId");
      return res.status(200).json({ result: myCart });
    }
    return res
      .status(404)
      .json({ message: "Không tìm thấy giỏ hàng của người dùng" });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm getCart",
      error: error.message,
    });
    return res.status(500).json({
      message: "Lấy dữ liệu giỏ hàng thất bại",
      error: error.message,
    });
  }
};
exports.putQuantity = async (req, res) => {
  try {
    const { userId, action } = req.query;
    const { itemId } = req.body;
    await cartEntity.updateOne(
      { userId, "items._id": itemId },
      { $inc: { "items.$.quantity": action === "decrease" ? -1 : 1 } }
    );
    return res.status(200).json({ message: "Cập nhật số lượng thành công" });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm putQuantity",
      error: error.message,
    });
    return res.status(500).json({
      message: "Cập nhật số lượng sản phẩm thất bại",
      error: error.message,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const payload = req.payload;
    if (!payload)
      return res
        .status(404)
        .json({ message: "Không tìm thấy giỏ hàng để xóa sản phẩm" });
    const { itemId } = req.query;
    const { itemIds } = req.body || [];
    let option = "";
    let message = "";
    if (itemId) {
      option = { items: { _id: itemId } };
      message = "Đã xóa 1 sản phẩm ra khỏi giỏ hàng thành công";
    }
    if (itemIds?.length > 0) {
      option = { items: { _id: { $in: itemIds } } };
      message = "Đã xóa các sản phẩm được chọn ra khỏi giỏ hàng thành công";
    }
    const result = await cartEntity.updateOne(
      { userId: payload.sub },
      { $pull: option }
    );
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để xóa" });
    return res.status(200).json({
      message: message,
    });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm deleteItem",
      error: error.message,
    });
    return res.status(500).json({
      message: "Xóa sản phẩm thất bại",
      error: error.message,
    });
  }
};
