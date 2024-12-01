const { Post, Hashtag } = require('../models');
const { User, Like , Reservation} = require('../models');
const { Op, Sequelize } = require('sequelize'); // Sequelize 연산자 가져오기

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

// 게시물작성!
exports.uploadPost = async (req, res, next) => {
  console.log("게시물작성 입력 데이터: ", req.body);
  const { title, content, category, image, original_price, discount_rate, sale_end_date,production_date } = req.body;

  if (!category || !['bread', 'rice_cake', 'side_dish', 'grocery', 'etc']
    .includes(category)) {
    return res.status(400).json({ responseMessage: '카테고리를 선택해주세요.' });
  }

  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      original_price: req.body.original_price,
      discount_rate: req.body.discount_rate,
      sale_end_date: req.body.sale_end_date,
      production_date: req.body.production_date,

      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : null,  // 프론트로의 이미지 건네주는 경로
      UserId: req.userId ,
    });
   
    return res.status(201).json({ 
      id: post.id,
      responseMessage: '게시물이 성공적으로 작성되었습니다.', post });
  } 
  catch (error) {
    console.error(error);
    return next(error);
  }
};



// 게시물 목록을 가져와 JSON 형식으로 응답하는 컨트롤러
exports.getPosts = async (req, res, next) => {
  console.log("게시물 목록을 가져와 JSON 형식으로 응답하는 컨트롤러");
  ///api/board?page=0&size=100&sort=createdAt,DESC&categoryId=2
  try {
    const page = parseInt(req.query.page, 10) || 0;
    const size = parseInt(req.query.size, 10) || 10;
    const sort = req.query.sort ? req.query.sort.split(',') : ['createdAt', 'DESC'];
    let categoryId=null;
    if(req.query.categoryId){
      categoryId= req.query.categoryId;
      if(parseInt(categoryId)===1){
        categoryId="bread";
      }else if(parseInt(categoryId)===2){
        categoryId="rice_cake";
      }else if(parseInt(categoryId)===3){
        categoryId="side_dish";
      }else if(parseInt(categoryId)===4){
        categoryId="grocery";
      }else if(parseInt(categoryId)===5){
        categoryId="etc";
      }else{
        categoryId=null;
      }
    }
   


    // 허용된 컬럼과 방향만 사용
    const validColumns = ['createdAt', 'updatedAt', 'title'];
    const validDirections = ['ASC', 'DESC'];

    const sortColumn = validColumns.includes(sort[0]) ? sort[0] : 'createdAt';
    const sortDirection = validDirections.includes(sort[1]?.toUpperCase()) ? sort[1]?.toUpperCase() : 'DESC';

    const order = [[sortColumn, sortDirection]];

     // categoryId 조건 추가
    const where = categoryId ? { category: categoryId } : {};
    
 
    const posts = await Post.findAll({
      where, // categoryId 필터링 추가
      offset: page * size,
      limit: size,
      order: order,
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'address'],
          required: true,  // User가 없는 게시물은 제외
        },
        {
          model: Reservation,
          attributes: ['id'], // 예약 여부 확인용
          as: 'Reservations',
        },

      ],
    });

    //console.log("게시물 목록을 검색: ",posts);


    //console.log("post.User ===", post.User);

    const responseDtos = posts.map(post => {
      const address = post.User.address; // User의 address 필드 가져오기
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
        address:{
          fullAddress: parsedAddress?.fullAddress || '', // fullAddress만 추출
          x: parsedAddress?.x || '',
          y: parsedAddress?.y || '', 
          detailAddress: parsedAddress?.detailAddress || '',
          postcode: parsedAddress?.postcode || '',      
        }
        
      };
    });

    return res.status(200).json({
      data: {
        responseDtos,
        page,
        size,
      },
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};



 
// 게시물 상세보기 컨트롤러
exports.getPostById = async (req, res, next) => {
  const { id } = req.params; // URL에서 게시물 ID를 가져옴
  const userId = req.userId; // 로그인한 사용자 ID
  console.log(" 게시물 상세보기 컨트롤러 userId :", userId);
  
  try {
    // 게시물 조회
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'address'], // 작성자 정보
          required: true,
        },
        {
          model: Hashtag, // 관련된 해시태그 정보 (선택)
          attributes: ['title'],
        },
        {
          model: Like, // 찜 상태 확인을 위한 모델
          as: 'Likes', // 모델 관계 정의 시 사용된 alias
          attributes: ['postId', 'userId'], // 필요한 필드만 선택
          where: { postId: id, userId }, // postId와 userId가 모두 일치하는 조건 추가
          required: false, // 로그인하지 않은 경우에도 조회 가능하도록 설정
        },
        {
          model: Reservation, // 예약 상태 확인을 위한 모델
          as: 'Reservations', // 모델 관계 정의 시 사용된 alias
          attributes: ['postId', 'userId'], // 필요한 필드만 선택
          required: false, // 로그인하지 않은 경우에도 조회 가능하도록 설정
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ responseMessage: '해당 게시물을 찾을 수 없습니다.' });
    }

    const address = post.User.address; 
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    // 예약 상태 추가 논리 구현
    const isReserved = post.Reservations && post.Reservations.length > 0;
    const isSaleComplete = post.sale_end_date && new Date(post.sale_end_date) < new Date();
    let status = '판매중';

    // 예약자 ID 및 로그인 사용자의 예약 여부 확인
    const reservationUserId = isReserved ? post.Reservations[0].userId : null; 
    const userReserved = post.Reservations.some(reservation => reservation.userId === userId);

    console.log("1. isReserved 크기 :", isReserved);
    console.log("2. 예약자 아이디 가져오기 :", reservationUserId);
    console.log("3. 로그인 사용자 예약 여부 :", userReserved);

    if (isSaleComplete) {
      status = '거래완료';
    } else if (isReserved) {
      status = '예약중';
    }

    // 응답 데이터 형식 구성
    const responseDto = {
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
      hashtags: post.Hashtags?.map(tag => tag.title) || [], // 해시태그 목록
      address: {
        fullAddress: parsedAddress?.fullAddress || '', // fullAddress만 추출
        x: parsedAddress?.x || '',
        y: parsedAddress?.y || '', 
        detailAddress: parsedAddress?.detailAddress || '',
        postcode: parsedAddress?.postcode || '',          
      },
      likeStatus: post.Likes?.length > 0, // 찜 상태
      reservationStatus: isReserved, // 예약 상태
      reservationUserId: reservationUserId,
      userReserved: userReserved, // 로그인 사용자의 예약 여부
    };

    return res.status(200).json({
      data: responseDto,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};






//상점 리스트 가져오기
exports.shopList = async (req, res, next) => {
  try {
    const { searchTerm, page = 0, size = 10, sort = 'createdAt,DESC' } = req.query;

    console.log("상점 리스트 가져오기 :", searchTerm);

    const parsedPage = parseInt(page, 10) || 0;
    const parsedSize = parseInt(size, 10) || 10;

    const [sortColumn, sortDirection] = sort.split(',');
    const validColumns = ['createdAt', 'name', 'updatedAt'];
    const validDirections = ['ASC', 'DESC'];
    const order = [
      [
        validColumns.includes(sortColumn) ? sortColumn : 'createdAt',
        validDirections.includes(sortDirection?.toUpperCase()) ? sortDirection.toUpperCase() : 'DESC',
      ],
    ];

    const where = {};
    const userWhere = {};

    if (searchTerm) {
      userWhere.nick = { [Sequelize.Op.like]: `${searchTerm}` };
    }

    const posts = await Post.findAll({
      where,
      offset: parsedPage * parsedSize,
      limit: parsedSize,
      order: order,
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'address'],
          required: true,
          where: userWhere,
        },
        {
          model: Reservation,
          attributes: ['id'], // 예약 여부 확인용
          as: 'Reservations',
        },
      ],
    });

    const getUser = await User.findOne({ where: { nick: searchTerm } });
    const address = getUser?.address || '{}';
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    const responseDtos = posts.map(post => {
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
        status,
        nickname: post.User.nick,
        hashtags: post.Hashtags?.map(tag => tag.title) || [],
        address: {
          fullAddress: parsedAddress?.fullAddress || '',
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
    console.error('상점 목록 검색 중 에러:', error);
    return next(error);
  }
};




//사장님이 등록한 상점 리스트 가져오기
exports.myShopList = async (req, res, next) => {
  
  console.log("사장님이 등록한 상점 리스트 가져오기");

  try {
    const { searchTerm, page = 0, size = 10, sort = 'createdAt,DESC', id } = req.query;

    const parsedPage = parseInt(page, 10) || 0;
    const parsedSize = parseInt(size, 10) || 10;

    const [sortColumn, sortDirection] = sort.split(',');
    const validColumns = ['createdAt', 'title', 'updatedAt'];
    const validDirections = ['ASC', 'DESC'];
    const order = [
      [
        validColumns.includes(sortColumn) ? sortColumn : 'createdAt',
        validDirections.includes(sortDirection?.toUpperCase()) ? sortDirection.toUpperCase() : 'DESC',
      ],
    ];

    const where = {};
    const userWhere = {};

    if (id) {
      userWhere.id = id;
    }
    if (searchTerm) {
      userWhere.nick = { [Sequelize.Op.like]: `%${searchTerm}%` };
    }

    const posts = await Post.findAll({
      where,
      offset: parsedPage * parsedSize,
      limit: parsedSize,
      order: order,
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'address'],
          required: true,
          where: userWhere,
        },
        {
          model: Reservation,
          attributes: ['id'], // 예약 여부 확인용
          as: 'Reservations',
        },
      ],
    });

    const responseDtos = posts.map(post => {
      let parsedAddress = {};
      try {
        parsedAddress = typeof post.User.address === 'string' ? JSON.parse(post.User.address) : post.User.address;
      } catch (e) {
        console.error('주소 파싱 오류:', e);
      }

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
          fullAddress: parsedAddress?.fullAddress || '',
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
    console.error('나의 상점 리스트 조회 중 오류:', error);
    return next(error);
  }
};




// 게시글 수정 API
exports.updatePost = async (req, res, next) => {
  
  try {
    const { boardId } = req.params; // URL 경로에서 boardId 추출
    const userId = req.userId; // 현재 로그인한 사용자의 ID (인증 미들웨어로 설정됨)
    const { title, content, category, image, original_price, discount_rate, sale_end_date, production_date } = req.body;

    console.log("게시글 수정 API 실행 :이미지 = >",  req.file);

    // 게시글 존재 여부 확인
    const post = await Post.findOne({
      where: { id: boardId },
      include: [
        {
          model: User, // User 모델을 포함
          attributes: ['id'], // 필요한 속성만 가져오기
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: '해당 게시글이 존재하지 않습니다.',
      });
    }

    // 게시글 작성자와 요청 사용자가 일치하는지 확인
    console.log(" 토큰 유저 아이디: ", userId);
    console.log(" 게시글 작성자 아이디: ", post.User.id);
    if (post.User.id !== userId) {
      console.log(" 게시글 작성자와 요청 사용자가 일치하지 않습니다.");
      return res.status(403).json({
        message: '게시글 수정 권한이 없습니다.',
      });
    }

    // 카테고리 유효성 검사
    if (category && !['bread', 'rice_cake', 'side_dish', 'grocery', 'etc'].includes(category)) {
      return res.status(400).json({ message: '유효하지 않은 카테고리입니다.' });
    }

    // 게시글 업데이트
    await post.update({
      title: title || post.title,
      content: content || post.content,
      category: category || post.category,
      image: req.file ? `/uploads/${req.file.filename}` : post.image, // 새 이미지가 없으면 기존 이미지 유지
      original_price: original_price || post.original_price,
      discount_rate: discount_rate || post.discount_rate,
      sale_end_date: sale_end_date || post.sale_end_date,
      production_date: production_date || post.production_date,
    });

    return res.status(200).json({
      message: '게시글이 성공적으로 수정되었습니다.',
      data: post,
    });
  } catch (error) {
    console.error('게시글 수정 중 오류:', error);
    return next(error); // 오류 처리 미들웨어로 전달
  }
};



// 게시글 삭제 API
exports.deletePost = async (req, res, next) => {
  console.log("게시글 삭제 API 실행");
  try {
    const { boardId } = req.params; // URL 경로에서 boardId 추출
    const userId = req.userId; // 현재 로그인한 사용자의 ID (인증 미들웨어로 설정됨)
    
    // 게시글 존재 여부 확인
    const post = await Post.findOne({
      where: { id: boardId },
      include: [
        {
          model: User, // User 모델을 포함
          attributes: ['id'], // 필요한 속성만 가져오기
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: '해당 게시글이 존재하지 않습니다.',
      });
    }

    // 게시글 작성자와 요청 사용자가 일치하는지 확인
    console.log(" 토큰 유저 아이디: " , userId);
    console.log(" 게시글 작성자 아이디: " , post.User.id);
    if (post.User.id !== userId) {
      
      console.log(" 게시글 작성자와 요청 사용자가 일치하지 않습니다.");

      return res.status(403).json({
        message: '게시글 삭제 권한이 없습니다.',
      });
    }

    // 게시글 삭제
    await Post.destroy({
      where: { id: boardId },
    });

    return res.status(200).json({
      message: '게시글이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('게시글 삭제 중 오류:', error);
    return next(error); // 오류 처리 미들웨어로 전달
  }
};
