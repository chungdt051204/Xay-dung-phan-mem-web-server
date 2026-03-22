const express = require("express");
const router = express.Router();
const { askAI } = require("../../service/ai.service");
const Product = require("../../model/product.model");

const brandMap = {
  apple: "698ac9ec24833950a25c9e9a",
  samsung: "698ac9ec24833950a25c9e9b",
  xiaomi: "698ac9ec24833950a25c9e9c",
  oppo: "698ac9ec24833950a25c9e9d",
  vivo: "698ac9ec24833950a25c9e9e",
  realme: "698ac9ec24833950a25c9e9f",
  huawei: "698ac9ec24833950a25c9ea0",
  honor: "698ac9ec24833950a25c9ea1",
  sony: "698ac9ec24833950a25c9ea4",
  lenovo: "698ac9ec24833950a25c9ea5",
  nokia: "698ac9ec24833950a25c9ea6",
  dell: "698ac9ec24833950a25c9ea8",
};

const categoryMap = {
  "điện thoại": "697d67b3cf9253e925e06d6d",
  iphone: "697d67b3cf9253e925e06d6d",
  samsung: "697d67b3cf9253e925e06d6d",

  laptop: "697d67c9cf9253e925e06d6e",
  "máy tính": "697d67c9cf9253e925e06d6e",

  headphone: "698aca6724833950a25c9ead",
  "tai nghe": "698aca6724833950a25c9ead",

  tv: "698aca6724833950a25c9eae",
  tivi: "698aca6724833950a25c9eae",

  "máy tính bảng": "69998e9b44045a7ff3058012",
  tablet: "69998e9b44045a7ff3058012",
  ipad: "69998e9b44045a7ff3058012",
};

router.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Tin nhắn trống!" });

  try {
    const text = message.toLowerCase();

    // 1. Tìm BrandId và CategoryId dựa trên từ khóa trong tin nhắn
    const brandKey = Object.keys(brandMap).find((key) => text.includes(key));
    const categoryKey = Object.keys(categoryMap).find((key) =>
      text.includes(key)
    );

    const query = {};
    if (brandKey) query.brandId = brandMap[brandKey];
    if (categoryKey) query.categoryId = categoryMap[categoryKey];

    // 2. Tìm kiếm sản phẩm nếu có query, song song với việc gọi AI để tiết kiệm thời gian
    const [products, aiReply] = await Promise.all([
      Object.keys(query).length > 0
        ? Product.find(query).limit(5).sort({ createdAt: -1 })
        : [],
      askAI(message),
    ]);

    // 3. Quyết định câu trả lời cuối cùng
    let finalReply = aiReply;
    if (!finalReply) {
      finalReply =
        products.length > 0
          ? "Tôi tìm thấy một số sản phẩm phù hợp cho bạn:"
          : "Bạn có thể hỏi về điện thoại, laptop, tai nghe hoặc TV.";
    }

    res.json({ reply: finalReply, products });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.json({ reply: "Xin lỗi, hệ thống đang gặp lỗi ⚠️", products: [] });
  }
});

module.exports = router;
