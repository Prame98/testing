const express = require('express');
const { Post, Hashtag } = require('../models');
const { User, Like , Reservation} = require('../models');
const { Op, Sequelize } = require('sequelize'); // Sequelize 연산자 가져오기
const router = express.Router();


// 예약하기  상태 가져오기
exports.getReservationStatus = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; 
    const reservation = await Reservation.findOne({ where: { postId, userId } });
    res.status(200).json({ reservationStatus: !!reservation }); // true or false 반환
  } catch (error) {
    console.error(error);
    res.status(500).send('예약하기 상태를 가져오는 데 실패했습니다.');
  }
};



// 예약하기 상태 토글
exports.reservationToggle = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; 
    const existingReservation = await Reservation.findOne({ where: { postId, userId } });

    if (existingReservation) {
      await Reservation.destroy({ where: { postId, userId } });
      res.status(200).send('예약하기 상태를 해제했습니다.');
    } else {
      await Reservation.create({ postId, userId });
      res.status(200).send('예약하기 상태로 설정했습니다.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('예약하기 상태를 변경하는 데 실패했습니다.');
  }
};



// 내가 예약한 목록 가져오기
exports.getMyReservations = async (req, res, next) => {
  console.log(" 내가 예약한 목록 가져오기  :");
  try {
    const userId = req.userId; // 로그인한 사용자의 ID

    // 예약한 게시물 조회
    const reservations = await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Post, // 게시물 정보
          attributes: ['id', 'title', 'content', 'image', 'category', 'original_price', 'discount_rate', 'sale_end_date'],
          include: [
            {
              model: User, // 게시물 작성자 정보
              attributes: ['id', 'nick', 'address'],
            },
            {
              model: Reservation,
              attributes: ['id'], // 예약 여부 확인용
              as: 'Reservations',
            },
    
          ],
        },
      ],
    });

    if (!reservations.length) {
      return res.status(404).json({ responseMessage: '예약한 게시물이 없습니다.' });
    }

    // 데이터 가공
    const responseDtos = reservations.map(reservation => {
      const post = reservation.Post;
      const address = post.User.address;
      const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
      // 예약중 상태 추가 논리적으로 구현
      const isReserved = post.Reservations && post.Reservations.length > 0;
      const isSaleComplete = post.sale_end_date && new Date(post.sale_end_date) < new Date();
      let status = '판매중';

      if (isSaleComplete) {
        status = '거래완료';
      } else if (isReserved) {
        status = '예약중';
      }

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        image: post.image,
        category: post.category,
        original_price: post.original_price,
        discount_rate: post.discount_rate,
        price: post.original_price * (1 - post.discount_rate / 100),

        production_date: post.production_date,
        sale_end_date: post.sale_end_date,
        status: status,
        nickname: post.User.nick,
        address: {
          fullAddress: parsedAddress?.fullAddress || '', // fullAddress만 추출
          x: parsedAddress?.x || '',
          y: parsedAddress?.y || '',
          detailAddress: parsedAddress?.detailAddress || '',
          postcode: parsedAddress?.postcode || '',
        },
      };
    });

    return res.status(200).json({
      data: responseDtos,
    });
  } catch (error) {
    console.error('내 예약 목록 가져오기 중 에러:', error);
    return next(error);
  }
};







// 사장님 제품 예약한 목록 전체 가져오기
exports.ownerProductReservationList = async (req, res, next) => {
  console.log("사장님 제품 예약한 목록 가져오기:");

  try {
    const userId = req.userId; // 현재 로그인한 사장님의 ID

    // 사장님이 작성한 게시글을 기준으로 예약된 정보를 조회
    const postsWithReservations = await Post.findAll({
      where: { userId }, // 사장님이 작성한 게시글
      include: [
        {
          model: Reservation, // 게시글에 대한 예약 정보
          as: 'Reservations', // Post 모델에서 설정한 별칭
          include: [
            {
              model: User, // 예약한 유저 정보
              attributes: ['id', 'nick', 'address'], // 필요한 유저 정보만 선택
            },
          
          ],
        },
        {
          model: Reservation,
          attributes: ['id'], // 예약 여부 확인용
          as: 'Reservations',
        },
      ],
    });

    if (!postsWithReservations.length) {
      return res.status(404).json({ responseMessage: '예약된 게시글이 없습니다.' });
    }

    // 데이터 가공
    const responseDtos = postsWithReservations.map((post) => {
      // 유저 정보가 없는 예약은 필터링
      const reservations = post.Reservations
        .filter((reservation) => reservation.User) // 유저가 존재하는 예약만 남김
        .map((reservation) => {
          const user = reservation.User;
          const address = typeof user.address === 'string' ? JSON.parse(user.address) : user.address;

          return {
            userId: user.id,
            userNick: user.nick,
            userAddress: {
              fullAddress: address?.fullAddress || '',
              x: address?.x || '',
              y: address?.y || '',
              detailAddress: address?.detailAddress || '',
              postcode: address?.postcode || '',
            },
          };
        });

        
      // 예약중 상태 추가 논리적으로 구현
      const isReserved = post.Reservations && post.Reservations.length > 0;
      const isSaleComplete = post.sale_end_date && new Date(post.sale_end_date) < new Date();
      let status = '판매중';

      if (isSaleComplete) {
        status = '거래완료';
      } else if (isReserved) {
        status = '예약중';
      }

      return {
        postId: post.id,
        title: post.title,
        content: post.content,
        image: post.image,
        category: post.category,
        original_price: post.original_price,
        discount_rate: post.discount_rate,
        price: post.original_price * (1 - post.discount_rate / 100),
        production_date: post.production_date,
        sale_end_date: post.sale_end_date,
        status: status,
        reservations, // 필터링된 예약 리스트 포함
      };
    });

    return res.status(200).json({
      data: responseDtos.filter((dto) => dto.reservations.length > 0), // 예약이 없는 게시글 제외
    });
  } catch (error) {
    console.error('사장님 제품 예약 목록 가져오기 중 에러:', error);
    return next(error);
  }
};
