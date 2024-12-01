const { sign, verify, decode } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const RefreshToken = require('../models/refreshTokens'); // Sequelize 모델 임포트
const User = require('../models/user'); // User 모델 임포트 (User 모델이 있다고 가정)
const { NotAuthError } = require('./errors');

// 암호화 키를 설정합니다.
const KEY = process.env.JWT_SECRET_KEY;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRATION = '1h'; // 1시간
const REFRESH_TOKEN_EXPIRATION = 14 * 24 * 60 * 60; // 14일 (초 단위)

// 1. 입력받은 비밀번호와 저장된 비밀번호를 비교하는 함수
function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
}

// 2. 접근 토큰 생성
function createAccessToken(userId, userType) {
  console.log("2. 접근 토큰 생성 :", userId,userType, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION);

  const accessToken = sign({ userId,userType }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
  const decodedToken = decode(accessToken);

  return {
    accessToken,
    accessTokenExpires: decodedToken.exp,
  };
}

// 3. 갱신 토큰 생성
function createRefreshToken(userId,userType) {
  const refreshToken = sign({ userId ,userType}, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  const decodedToken = decode(refreshToken);

  return {
    refreshToken,
    refreshTokenExpires: decodedToken.exp,
  };
}

// 4. 접근 토큰 유효성 검사
function validateAccessToken(token) {
  return verify(token, ACCESS_TOKEN_SECRET);
}

// 5. 갱신 토큰 유효성 검사
function validateRefreshToken(token) {
  return verify(token, REFRESH_TOKEN_SECRET);
}

// 6. 갱신 토큰을 MySQL에 저장하는 함수
async function storeRefreshToken(refreshToken, userId) {
  try {
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION * 1000); // 만료 시간 계산
    const existingToken = await RefreshToken.findOne({ where: { userId } });

    if (existingToken) {
      // 기존 토큰 업데이트
      existingToken.refreshToken = refreshToken;
      existingToken.expiresAt = expiresAt;
      await existingToken.save();
    } else {
      // 새 토큰 생성
      const newToken = await RefreshToken.create({
        userId: userId,
        refreshToken,
        expiresAt,
      });
    }

    console.log("6. 갱신 토큰을 MySQL에 저장하는 함수 :", userId, refreshToken, expiresAt);
  } catch (error) {
    console.error('Failed to store refresh token:', error);
    throw new Error('Failed to store refresh token');
  }
}

// 7. 저장된 MySQL에서 갱신 토큰 가져오는 함수
async function getStoredRefreshToken(userId) {
  try {
    const tokenData = await RefreshToken.findOne({ where: { userId } });
    return tokenData ? tokenData.refreshToken : null;
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error);
    throw new Error('Failed to retrieve refresh token');
  }
}

// 8. 인증 미들웨어 함수
async function checkAuthMiddleware(req, res, next) {
  console.log("미들웨어 인증 처리 :");

  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log("접근 권한이 없습니다.-1 :");
    return next(new NotAuthError('접근 권한이 없습니다.'));
  }

  const authFragments = req.headers.authorization.split(' ');

  if (authFragments.length !== 2) {
    console.log("not-authenticated-2 :");
    return next(new NotAuthError('접근 권한이 없습니다.'));
  }

  const authToken = authFragments[1];
  try {
    const validatedToken = validateAccessToken(authToken);
    req.token = validatedToken;
    req.userId = validatedToken.userId;
    req.user = {};  // req.user 객체 초기화
    req.user.userType = validatedToken.userType;
    req.userType = validatedToken.userType;
  } catch (error) {
    console.log("not-authenticated-3:", error.message);
    if (error.message === 'jwt expired') {
      console.log("접근 토큰 인증 만료");
      return res.status(403).json({ message: 'ACCESS_TOKEN_EXPIRED' });
    }
    return next(new NotAuthError('접근 권한이 없습니다.'));
  }
  next();
}

// 9. 로그아웃 시 갱신 토큰 삭제
async function deleteRefreshToken(userId) {
  try {
    await RefreshToken.destroy({ where: { userId } });
    console.log(`갱신 토큰 삭제 완료: ${userId}`);
  } catch (error) {
    console.error('Failed to delete refresh token:', error);
    throw new Error('Failed to delete refresh token');
  }
}

// 10. 사용자 등록 시 (회원가입)
async function registerUser(userData) {
  try {
    const { userId, password, nick } = userData;
    const userExists = await User.findOne({ where: { userId } });

    if (userExists) {
      throw new Error('이미 존재하는 아이디입니다.');
    }

    // 비밀번호 암호화 후 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userId,
      password: hashedPassword,
      nick, // 추가된 닉네임
    });

    return newUser;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
  validateRefreshToken,
  isValidPassword,
  storeRefreshToken,
  getStoredRefreshToken,
  checkAuthMiddleware,
  deleteRefreshToken,
  registerUser, // 회원가입 처리 함수 추가
};
