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
    return res
      .status(500)
      .json({ message: "Thêm sản phẩm vào giỏ hàng thất bại" });
  }
};
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const myCart = await cartEntity
        .findOne({ userId })
        .populate("items.productId");
      return res.status(200).json({ result: myCart });
    }
  } catch (error) {}
};
