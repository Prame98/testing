const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const { createJSONToken, isValidPassword, createAccessToken, createRefreshToken, storeRefreshToken, deleteRefreshToken, validateRefreshToken } = require("../util/auth"); 


// 회원가입!
exports.join = async (req, res, next) => {
  //console.log("회원가입 요청 데이터: ", req.body);
  const { userId, nickname, password, userType, address } = req.body;

  if (!userId || !nickname || !password || !address || !userType) {
    return res.status(400).send('모든 필드를 입력해주세요.');
  }

  try {
    console.log(req.body);
    const exUser = await User.findOne({ where: { userId } });
    // 로그인 - 일단 이 아이디로 가입한 유저가 있는지 찾기
    if (exUser) {
      return res.status(400).json({ responseMessage: '이미 존재하는 사용자입니다.' });
    }

    let time=req.body.time;
    if(!time) {
      time=null;
    }


    const hash = await bcrypt.hash(password, 12); // bcrypt 비밀번호 암호화
    await User.create({
      userId,
      nick: nickname,
      password: hash,
      userType,
      address: JSON.stringify(address),
      time: time 
    });
    //return res.redirect('/');
    return res.status(201).json({ responseMessage: '회원가입 성공' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

// 로그인! 
exports.login =async (req, res, next) => {
  passport.authenticate('local',async (authError, user, info) => {

    if (authError) return res.status(500).json({ responseMessage: '서버 에러가 발생했습니다.' });
    if (!user) return res.status(400).json({ responseMessage: info.message });

    try {
      const userId = user.userId;
      const { accessToken: newAccessToken } = createAccessToken(user.id,  user.userType);
      const { refreshToken: newRefreshToken } = createRefreshToken(user.id, user.userType);
      await storeRefreshToken(newRefreshToken, user.id);

      let parsedAddress = {};
      if (user.address) parsedAddress = JSON.parse(user.address);

      return res.status(200).json({
        id: user.id,
        userId,
        nickname: user.nick,
        address: parsedAddress,
        userType: user.userType,
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      });
    } catch (error) {
      console.error("로그인 처리 에러:", error);
      return res.status(500).json({ responseMessage: '서버 에러가 발생했습니다.' });
    }
  })(req, res, next);
};






//갱신 토큰 발급처리
exports.refresh = async (req, res, next) => {
  const { refreshToken } = req.body;
  //console.log("refresh token: " + refreshToken);

  if (!refreshToken) {
    return res.status(400).json({
      responseMessage: 'refresh token 값이 존재하지 않습니다.',
    });
  }

  // Refresh Token 유효성 검사
  const refreshTokenValid = validateRefreshToken(refreshToken);
  if (!refreshTokenValid) {
    return res.status(400).json({
      responseMessage: '갱신 토큰값이 유효하지 않습니다.',
    });
  }

  try {
    console.log("갱신 토큰 유효합니다.", refreshTokenValid);

    // `validateRefreshToken`이 반환한 데이터 구조 확인
    const { userId, userType } = refreshTokenValid;

    // Access Token 생성
    const { accessToken: newAccessToken } = createAccessToken(userId, userType);

    // Refresh Token 생성
    const { refreshToken: newRefreshToken } = createRefreshToken(userId, userType);

    // 기존 Refresh Token 삭제
    await deleteRefreshToken(userId);

    // 새로운 Refresh Token 저장
    await storeRefreshToken(newRefreshToken, userId);

    // 성공 응답
    return res.status(200).json({
      id: userId,
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    console.error("갱신 토큰 처리 중 에러:", error);

    // 서버 에러 응답
    return res.status(500).json({
      responseMessage: '서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
};






exports.logout = async(req, res) => {
  req.logout(async () => {  
    const userId = req.query.userId;
    const exUser = await User.findOne({ where: { userId } });
    //console.log("로그아웃 시 갱신 토큰 삭제",exUser);    
    await deleteRefreshToken(exUser.id);

    return res.status(200).json({responseMessage: 'success'});

  });
};
