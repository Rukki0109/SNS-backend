const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// 投稿を検索
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        const posts = await Post.find({ desc: { $regex: query, $options: "i" } }); // 大文字小文字を区別しない検索
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//投稿を更新する
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿の編集に成功しました")
        } else {
            return res.status.apply(403).json("あなたは他の人の投稿を編集できません")
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

//投稿を削除する
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("投稿の削除に成功しました")
        } else {
            return res.status.apply(403).json("あなたは他の人の投稿を削除できません")
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});


//特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(403).json(err);
    }
});

//投稿にいいねする
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //まだいいねしていなかったらいいねできる
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json("投稿にいいねをできました");
            //もうすでにいいねしてしている場合
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                },
            });
            return res.status(403).json("投稿にいいねを外しました");
        }
    } catch (err) {
        return res.status(500).json(err);
    }

});

// タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id }).populate("userId");

        // 自分がフォローしている友達の投稿内容を全て取得する
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );

        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

// プロフィールタイムラインの投稿を取得
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });

        return res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// いいね済みの投稿を取得
router.get("/likes/:userId", async (req, res) => {
    try {
        const posts = await Post.find({ likes: req.params.userId });
        return res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 古着屋に紐づく投稿を取得
router.get("/shop/:shopId", async (req, res) => {
    try {
        const posts = await Post.find({ thriftShopId: req.params.shopId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;