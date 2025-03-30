const router = require("express").Router();
const Comment = require("../models/Comment");

// コメント作成
router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 特定の投稿のコメント一覧取得
// router.get("/:postId", async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .sort({ createdAt: -1 })
//       .populate("userId", "username profilePicture"); // ← 追加
//     res.status(200).json(comments);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
