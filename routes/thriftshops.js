const router = require("express").Router();
const ThriftShop = require("../models/ThriftShop");

// 古着屋を新規登録する
router.post("/", async (req, res) => {
  try {
    const newShop = new ThriftShop(req.body);
    const savedShop = await newShop.save();
    res.status(200).json(savedShop);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 古着屋一覧を取得
router.get("/", async (req, res) => {
  try {
    const shops = await ThriftShop.find().populate("postedBy", "username");
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 特定ユーザーが投稿した古着屋一覧
router.get("/user/:userId", async (req, res) => {
  try {
    const shops = await ThriftShop.find({ postedBy: req.params.userId });
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 古着屋の詳細取得
router.get("/:id", async (req, res) => {
    try {
      const shop = await ThriftShop.findById(req.params.id);
      res.status(200).json(shop);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
