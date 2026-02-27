const brandEntity = require("../../model/brand.model");
const productEntity = require("../../model/product.model");

exports.getBrands = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const brand = await brandEntity.findOne({ _id: id });
      return res.status(200).json({ result: brand });
    }
    const brands = await brandEntity.find();
    res.status(200).json({ result: brands });
  } catch (error) {
    console.log("Lỗi ở hàm getProduct:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productEntity.findOne({ brand: id });
    if (product) {
      return res.status(400).json({
        message: "Không thể xóa thương hiệu vì có sản phẩm liên quan.",
      });
    }
    await brandEntity.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa thương hiệu thành công" });
  } catch (error) {
    console.log("Lỗi ở hàm deleteBrand:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    await brandEntity.create({ brandName });
    res.status(201).json({ message: "Tạo thương hiệu thành công" });
  } catch (error) {
    console.log("Lỗi ở hàm createBrand:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id, brandName } = req.body;
    await brandEntity.findByIdAndUpdate(id, { brandName });
    res.status(200).json({
      message: "Cập nhật thương hiệu thành công",
    });
  } catch (error) {
    console.log("Lỗi ở hàm updateBrand:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
