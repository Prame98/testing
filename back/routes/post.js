const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {afterUploadImage,uploadPost,shopList,myShopList,deletePost,updatePost} = require("../controllers/post");
const { isLoggedIn, isOwner } = require("../middlewares");
const { checkAuthMiddleware } = require("../util/auth");
const router = express.Router();
const { getPosts, getPostById } = require("../controllers/post");
const { getMyBoards } = require("../controllers/board.js");

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }, // 이미지.png -> 이미지12312315.png
  }),
  // limits: { fileSize: 5 * 1024 * 1024 },
});


//프론트요청
router.post("/write",checkAuthMiddleware,isOwner,upload.single("image"),uploadPost);
router.get("/", getPosts);

router.get("/detail/:id", checkAuthMiddleware, getPostById);

router.put("/modify/:boardId", checkAuthMiddleware, isOwner,upload.single("image"), updatePost);


router.delete("/:boardId", checkAuthMiddleware, deletePost);

router.get("/shop", shopList);

//내가 등록한 상점 목록
router.get("/myShopList", checkAuthMiddleware, myShopList);

// POST /post/img
router.post("/img",checkAuthMiddleware,upload.single("img"),afterUploadImage);

// POST /post
const upload2 = multer();

router.post("/", checkAuthMiddleware, upload2.none(), uploadPost);

module.exports = router;
