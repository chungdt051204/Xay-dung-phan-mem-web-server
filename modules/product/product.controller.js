const productEntity = require("../../model/product.model");
const categoryEntity = require("../../model/category.model");
const brandEntity = require("../../model/brand.model");

exports.getProduct = async (req, res) => {
  try {
    const arrayProducts = await productEntity.find();
    const { _page = 1, _limit = arrayProducts?.length } = req.query;
    let query = {};
    const options = {
      page: _page,
      limit: _limit,
      populate: ["categoryId", "brandId"],
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

exports.createProduct = async (req, res) => {
  try {
    const { productName, price, techSpecs, description, image, quantityStock, status, brandId, categoryId, colors, images } = req.body;
    const newProduct = new productEntity({ productName, price, techSpecs, description, image, quantityStock, status, brandId, categoryId, colors, images });
    await newProduct.save();
    return res.status(201).json({ message: "Tạo sản phẩm thành công", product: newProduct });
  } catch (error) {
    console.log({message: "Có lỗi xảy ra khi xử lý hàm createProduct",error: error.message,});
    return res.status(500).json({ message: "Tạo sản phẩm thất bại" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id, productName, price, techSpecs, description, image, quantityStock, status, brandId, categoryId, colors } = req.body;
    const updatedProduct = await productEntity.findByIdAndUpdate(id, { productName, price, techSpecs, description, image, quantityStock, status, brandId, categoryId, colors }, { new: true });
    return res.status(200).json({ message: "Cập nhật sản phẩm thành công", product: updatedProduct });
  } catch (error) {
    console.log({message: "Có lỗi xảy ra khi xử lý hàm updateProduct",error: error.message,});
    return res.status(500).json({ message: "Cập nhật sản phẩm thất bại" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;  
    await productEntity.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.log({message: "Có lỗi xảy ra khi xử lý hàm deleteProduct",error: error.message,});
    return res.status(500).json({ message: "Xóa sản phẩm thất bại" });
  }
};