const categoryEntity = require("../../model/category.model");
const productEntity = require("../../model/product.model");
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const category = await categoryEntity.findOne({ _id: id });
      return res.status(200).json({ result: category });
    }
    const categories = await categoryEntity.find();
    return res.status(200).json({ result: categories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    await categoryEntity.create({ categoryName });
    return res.status(201).json({ message: "Tạo danh mục thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id, categoryName } = req.body;
    await categoryEntity.findByIdAndUpdate(id, {
      categoryName,
    });
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productEntity.findOne({ category: id });
    if (product) {
      return res
        .status(400)
        .json({ message: "Không thể xóa danh mục vì có sản phẩm liên quan." });
    }
    await categoryEntity.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
