const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout, refresh } = require("../controllers/auth");
const { checkAuthMiddleware } = require("../util/auth");

const router = express.Router();

// POST /auth/join
//router.post('/join', isNotLoggedIn, join);
//회원가입 요청 -> 로그인아닌 상태에만 가능 -> join은 controllers/auth.js
//             -> await User.create 수행 -> 여기서 User는 models/user.js
router.post("/signup", isNotLoggedIn, join);
router.post("/login", isNotLoggedIn, login);

router.get("/checkId", async (req, res) => {
  const { id } = req.query;

  try {
    console.log("가입한 아이디 체크 : ", id);
    const user = await User.findOne({ where: { userId: id } });
    console.log("가입한 아이디 체크 결과 : ", user);
    if (user) {
      return res.status(409).json({ responseMessage: "이미 가입한 아이디 입니다." });
    }
    return res.status(200).json({ responseMessage: "사용할 수 있는 아이디입니다." });
    
  } catch (error) {
    console.error("아이디 중복 확인 에러:", error);
    return res.status(500).json({ responseMessage: "서버 에러가 발생했습니다." });
  }
});

// POST /auth/login
router.post("/login", isNotLoggedIn, login);

//갱신 토큰 발급
router.post("/refresh", refresh);

// GET /auth/logout
router.get("/logout", logout);

// GET /auth/kakao
router.get("/kakao", passport.authenticate("kakao"));

// GET /auth/kakao/callback
router.get("/kakao/callback",passport.authenticate("kakao", {failureRedirect: "/?error=카카오로그인 실패",}),
  (req, res) => {
    res.redirect("/"); // 성공 시에는 /로 이동
  }
);


module.exports = router;
