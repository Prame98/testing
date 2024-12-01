const express = require('express');
const { isNotLoggedIn } = require('../middlewares');
const {renderProfile, renderJoin, renderMain, renderHashtag,} = require('../controllers/page');
const { checkAuthMiddleware } = require('../util/auth');
const router = express.Router();


router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});

router.get('/profile', checkAuthMiddleware, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

router.get('/hashtag', renderHashtag);

module.exports = router;