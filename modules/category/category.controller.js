const categoryEntity = require("../../model/category.model");
exports.getCategory = async (req, res) => {
  try {
    const category = await categoryEntity.find();
    return res.status(200).json(category);
  } catch (error) {}
};
