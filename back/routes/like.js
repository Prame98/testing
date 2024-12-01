const express = require("express");
const { checkAuthMiddleware } = require("../util/auth");
const {getLikeStatus,likeToggle,getMyLikes,ownerProductLikeList} = require("../controllers/like");
const router = express.Router();

// 찜 목록 가져오기 -  /api/likes/mine
router.get("/mine", checkAuthMiddleware, getMyLikes);

//사장짐 찜된 목록 가져오기
router.get("/owner/posts", checkAuthMiddleware, ownerProductLikeList);

// 찜 상태 가져오기  -  /api/likes/:postId
router.get("/:postId", checkAuthMiddleware, getLikeStatus);

// 찜 상태 토글 -  /api/likes/:postId
router.post("/:postId", checkAuthMiddleware, likeToggle);

module.exports = router;
