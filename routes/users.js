const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CRUD//
//ユーザー情報の更新
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("アカウント情報が更新されました");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("あなたは自分アカウントの時だけ情報を更新できます")
    }
});

//ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("アカウント情報が削除されました");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("あなたは自分アカウントの時だけ情報を削除できます")
    }
});

//ユーザー情報の取得
// router.get("/:id", async(req, res) => {
//     try{
//         const user = await User.findById(req.params.id);
//         const {password, updatedAt, ...other} =  user._doc;
//         return res.status(200).json(other);
//     }catch(err){
//         return res.status(500).json(err);
//     }
// });

//クエリでユーザー情報の取得
router.get("/", async(req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId 
        ? await User.findById(userId) 
        : await User.findOne({username: username});
        const {password, updatedAt, ...other} =  user._doc;
        return res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    }
});

//ユーザーのフォロー
router.put("/:id/follow", async (req, res)=> {
    if(req.body.userId != req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォロワーに自分が居なかったらフォローできる
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォローしました");
            }else{
                return res.status(403).json("あなたはすでにフォローしています");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }else{
        return res.status(500).json("自分自身をフォローできません");
    }
})


//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res)=> {
    if(req.body.userId != req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォロワーに存在したらフォローを外せる
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォロー解除しました");
            }else{
                return res.status(403).json("このユーザーはフォロー解除出来ません");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }else{
        return res.status(500).json("自分自身をフォロー解除出来ません");
    }
})

// router.get("/",(req, res) => {
//     res.send("user router")
// });

router.get("/:id/followings", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("ユーザーが見つかりません");

        const followings = await User.find({ _id: { $in: user.followings } }).select("username profilePicture");
        return res.status(200).json(followings);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// ユーザー情報と投稿数を取得する
router.get("/:id/stats", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json("ユーザーが見つかりません");
        }
        const postCount = await Post.countDocuments({ userId: req.params.id });

        const userStats = {
            username: user.username,
            followers: user.followers.length,
            followings: user.followings.length,
            postCount: postCount,
        };

        return res.status(200).json(userStats);
    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports= router;