const express = require("express");
const cors = require("cors");
const app = express();
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const uploadRoute = require("./routes/upload")

const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// CORS設定: フロントエンドからのリクエストを許可
app.use(cors({
    origin: "https://sns-frontend-green.vercel.app", // フロントエンドのVercelのURL
    methods: ["GET", "POST", "PUT", "DELETE"],  // 許可するメソッド
    credentials: true  // 認証情報を含むリクエストを許可
}));

//database connect
mongoose.connect(process.env.MONGOURL)
.then(() => {
    console.log("DBと接続中。。。");
})
.catch((err) => {
    console.log(err);
});

//midleware

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);

app.get("/",(req, res) => {
    res.send("hello express")
})

// app.get("/users",(req, res) => {
//     res.send("users express")
// })


app.listen(PORT, () => console.log("サーバーが起動しました"))