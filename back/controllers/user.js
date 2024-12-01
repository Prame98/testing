const User = require('../models/user');
const bcrypt = require('bcrypt');
const { Op,Sequelize } = require('sequelize');


exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) { // req.user.id가 followerId, req.params.id가 followingId
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};



// 회원 정보
exports.userInfo =async (req, res, next) => {

  const userId = req.userId;
  const exUser = await User.findOne({ where: { id:userId } });
  
  let parsedAddress = {};
  if (exUser.address) parsedAddress = JSON.parse(exUser.address);

  return res.status(200).json({
    id: exUser.id,
    userId:exUser.userId,
    nickname: exUser.nick,
    address: parsedAddress,
    userType: exUser.userType,
    time: exUser.time
  });
};



//회원정보 수정
exports.updateMemberInfo = async (req, res, next) => {
  try {
    const userId = req.userId; // 로그인한 사용자의 userId
    const { password, address, time } = req.body; // 요청 데이터에서 수정할 데이터 추출

    console.log(" 업데이트할 주소 :",address);

    // 해당 유저 찾기
    const exUser = await User.findOne({ where: { id: userId } });
    if (!exUser) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 비밀번호, 주소, 영업시간 업데이트
    if (password) {
      const hash = await bcrypt.hash(password, 12); // bcrypt 비밀번호 암호화
      exUser.password = hash; // 비밀번호 암호화 로직 추가 가능
    }

    if (address) {
      exUser.address = JSON.stringify(address); // 주소를 JSON 문자열로 저장
    }

    if (time) {
      exUser.time = time; // 영업시간 업데이트
    }

    // 변경 사항 저장
    await exUser.save();

    // 성공 응답 반환
    return res.status(200).json({
      message: "회원정보가 성공적으로 업데이트되었습니다.",
      user: {
        id: exUser.id,
        userId: exUser.userId,
        nickname: exUser.nick,
        address: address || JSON.parse(exUser.address), // 업데이트된 주소 반환
        time: exUser.time,
        userType: exUser.userType,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "회원정보 업데이트 중 오류가 발생했습니다." });
  }
};





// 상점 가져오기
exports.aroundMap = async (req, res, next) => {
  try {
    const { keyword } = req.query; // 클라이언트 요청에서 keyword를 가져옴

    let whereCondition = { userType: 'owner' }; // 기본 조건: 'owner'

    // keyword가 있을 경우 추가 조건 설정
    if (keyword) {
      console.log('1. 동네 상점 검색 : aroundMap :', keyword);
      whereCondition = {
        ...whereCondition,
        [Op.and]: Sequelize.literal(
          `JSON_EXTRACT(address, '$.fullAddress') LIKE '%${keyword}%'`
        ),
      };
    } else {
      console.log('1. 동네 상점 전체 조회 : aroundMap');
    }

    // 조건에 맞는 데이터 조회
    const users = await User.findAll({ where: whereCondition });

   // console.log('2. 조회 결과 : aroundMap :', users);

    // 검색 결과 반환
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
