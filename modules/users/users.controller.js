const usersEntity = require("../../model/users.model");
exports.postUser = async (req, res) => {
  try {
    const { id = "", name = "" } = req.body;
    if (!id || !name)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin" });
    const user = await usersEntity.findOne({ id });
    if (user) return res.status(409).json({ message: "ID này đã tồn tại" });
    await usersEntity.create({ id, name });
    return res.status(200).json({ message: "Thêm người dùng thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postUser", {
      error: error.message,
    });
    return res
      .status(500)
      .json({ message: "Thêm người dùng thất bại", error: error.message });
  }
};
exports.getUser = async (req, res) => {
  try {
    const users = await usersEntity.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getUser", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Lấy dữ liệu người dùng thất bại",
      error: error.message,
    });
  }
};
exports.getUserWithId = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await usersEntity.findOne({ id });
      if (!user)
        return res
          .status(404)
          .json({ message: "Không tìm thấy người dùng có id này" });
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getUserWithId", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Lấy dữ liệu người dùng theo id thất bại",
      error: error.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await usersEntity.deleteOne({ id });
    if (result.deletedCount === 0)
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để xóa" });
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm deleteUser", {
      error: error.message,
    });
    return res
      .status(500)
      .json({ message: "Xóa người dùng thất bại", error: error.message });
  }
};
exports.putUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { name = "" } = req.body;
    if (!name) return res.status(400).json("Vui lòng cung cấp đủ thông tin");
    const result = await usersEntity.updateOne({ id }, { name });
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để cập nhật thông tin" });
    return res
      .status(200)
      .json({ message: "Cập nhật thông tin người dùng thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm putUser", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Cập nhật thông tin người dùng thất bại",
      error: error.message,
    });
  }
};
