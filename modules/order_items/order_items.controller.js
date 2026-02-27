const orderItemsEntity = require("../../model/order_items.model");
const productEntity = require("../../model/product.model");

// Get all order items
exports.getOrderItems = async (req, res) => {
    try {
        const { orderId } = req.query;
        let query = {};
        if (orderId) query.orderId = orderId;

        const orderItems = await orderItemsEntity.find(query).populate("productId");
        return res.status(200).json({ result: orderItems });
    } catch (error) {
        console.log("Error in getOrderItems:", error.message);
        return res.status(500).json({ message: "Lấy dữ liệu chi tiết đơn hàng thất bại" });
    }
};

// Get order item by ID
exports.getOrderItemById = async (req, res) => {
    try {
        const { id } = req.query;
        const orderItem = await orderItemsEntity.findById(id).populate("productId");
        if (!orderItem) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
        }
        return res.status(200).json({ result: orderItem });
    } catch (error) {
        console.log("Error in getOrderItemById:", error.message);
        return res.status(500).json({ message: "Lấy chi tiết đơn hàng thất bại" });
    }
};

// Create order item
exports.createOrderItem = async (req, res) => {
    try {
        const { orderId, productId, quantity, price } = req.body;

        if (!orderId || !productId || !quantity || !price) {
            return res.status(400).json({ message: "Vui lòng cung cấp đủ thông tin" });
        }

        const product = await productEntity.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const newOrderItem = await orderItemsEntity.create({
            orderId,
            productId,
            quantity,
            price,
        });

        return res.status(201).json({ result: newOrderItem });
    } catch (error) {
        console.log("Error in createOrderItem:", error.message);
        return res.status(500).json({ message: "Tạo chi tiết đơn hàng thất bại" });
    }
};

// Update order item
exports.updateOrderItem = async (req, res) => {
    try {
        const { id } = req.query;
        const { quantity, price } = req.body;

        const updatedOrderItem = await orderItemsEntity.findByIdAndUpdate(
            id,
            { quantity, price },
            { new: true }
        );

        if (!updatedOrderItem) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
        }

        return res.status(200).json({ result: updatedOrderItem });
    } catch (error) {
        console.log("Error in updateOrderItem:", error.message);
        return res.status(500).json({ message: "Cập nhật chi tiết đơn hàng thất bại" });
    }
};

// Delete order item
exports.deleteOrderItem = async (req, res) => {
    try {
        const { id } = req.query;

        const deletedOrderItem = await orderItemsEntity.findByIdAndDelete(id);

        if (!deletedOrderItem) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
        }

        return res.status(200).json({ message: "Xóa chi tiết đơn hàng thành công" });
    } catch (error) {
        console.log("Error in deleteOrderItem:", error.message);
        return res.status(500).json({ message: "Xóa chi tiết đơn hàng thất bại" });
    }
};
