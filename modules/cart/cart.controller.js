const cartEntity = require("../../model/cart.model");
const productEntity = require("../../model/product.model");

//Hàm lấy giỏ hàng người dùng
exports.getCart = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const cart = await cartEntity
      .findOne({ userId })
      .populate("items.productId");

    //Sắp xếp item theo giá tăng dần
    if (cart && cart.items) {
      cart.items.sort((a, b) => {
        const priceA = a.productId ? a.productId.price : 0;
        const priceB = b.productId ? b.productId.price : 0;
        return priceA - priceB; // Tăng dần
      });
    }
    return res.status(200).json({ result: cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm thêm sản phẩm vào giỏ hàng
exports.addCart = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { productId, quantity } = req.body;
    if (!productId || !quantity)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin!!" });
    const product = await productEntity.findOne({ _id: productId });
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    if (quantity <= 0)
      return res
        .status(400)
        .json({ message: "Số lượng sản phẩm phải lớn hơn 0" });
    if (quantity > product?.quantityStock)
      return res.status(400).json({ message: "Số lượng tồn kho không đủ" });
    const cart = await cartEntity.findOne({ userId });
    if (!cart) {
      await cartEntity.create({ userId, items: [{ productId, quantity }] });
      return res
        .status(200)
        .json({ message: "Thêm sản phẩm mới vào giỏ hàng thành công" });
    } else {
      const productInCart = await cartEntity.findOne({
        userId,
        "items.productId": productId,
      });
      if (!productInCart) {
        await cartEntity.updateOne(
          { userId },
          {
            $addToSet: { items: { productId, quantity } },
          }
        );
        return res
          .status(200)
          .json({ message: "Thêm sản phẩm mới vào giỏ hàng thành công" });
      } else {
        await cartEntity.updateOne(
          { userId, "items.productId": productId },
          {
            $inc: { "items.$.quantity": quantity },
          }
        );
        return res.status(200).json({
          message: "Đã thêm số lượng sản phẩm này vào giỏ hàng thành công",
        });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm cập nhật số lượng sản phẩm
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { id } = req.params;
    const { action } = req.query;
    await cartEntity.updateOne(
      { userId, "items._id": id },
      { $inc: { "items.$.quantity": action === "increase" ? 1 : -1 } }
    );
    return res
      .status(200)
      .json({ message: "Cập nhật số lượng sản phẩm thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm xóa item ra khỏi giỏ hàng người dùng
exports.deleteCartItem = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { id } = req.params;
    const result = await cartEntity.updateOne(
      { userId, "items._id": id },
      { $pull: { items: { _id: id } } }
    );
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy item để xóa" });
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm xóa các item được chọn ra khỏi giỏ hàng người dùng
exports.deleteCartItemSelected = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { itemIds } = req.body;
    if (itemIds?.length === 0)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin" });
    const result = await cartEntity.updateOne(
      { userId },
      { $pull: { items: { _id: { $in: itemIds } } } }
    );
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy item để xóa" });
    return res.status(200).json({
      message: `Đã xóa ${itemIds?.length} sản phẩm ra khỏi giỏ hàng thành công`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};
