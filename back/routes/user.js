const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow ,aroundMap, userInfo, updateMemberInfo } = require('../controllers/user');
const { checkAuthMiddleware } = require('../util/auth');


const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', checkAuthMiddleware, follow);


//나의 동네 주변 상점 가져오기
router.get('/all', checkAuthMiddleware, aroundMap);


// GET  /api/users/userInfo
router.get('/userInfo', checkAuthMiddleware, userInfo);


//회원 정보 수정
router.post('/updateMemberInfo', checkAuthMiddleware, updateMemberInfo);



module.exports = router;