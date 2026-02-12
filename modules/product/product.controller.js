const productEntity = require("../../model/product.model");
const categoryEntity = require("../../model/category.model");
const brandEntity = require("../../model/brand.model");
const colorEntity = require("../../model/color.model");

exports.getProduct = async (req, res) => {
  try {
    const arrayProducts = await productEntity.find();
    const { _page = 1, _limit = arrayProducts?.length } = req.query;
    let query = {};
    const options = {
      page: _page,
      limit: _limit,
      populate: ["categoryId", "brandId", "colorId"],
    };
    const products = await productEntity.paginate(query, options);
    return res.status(200).json({ result: products });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm getProduct",
      error: error.message,
    });
    return res.status(500).json({ message: "Lấy dữ liệu sản phẩm thất bại" });
  }
};
