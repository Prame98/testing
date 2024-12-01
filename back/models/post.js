const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init({
      id: { // 기본 키로 설정
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      title:{
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      original_price:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      discount_rate:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      production_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sale_end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      category:{
        type: DataTypes.ENUM('bread','rice_cake','side_dish','grocery','etc'),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
  static associate(db) {
    db.Post.belongsTo(db.User); // 1:1 관계 - 작성자 정보
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // N:M 관계 - 해시태그
    db.Post.hasMany(db.Like, { foreignKey: 'postId', as: 'Likes' }); // 1:N 관계 - 찜(Like)

    db.Post.hasMany(db.Reservation, { foreignKey: 'postId', as: 'Reservations' }); // 1:N 관계 - 예약하기Reservation)
  }
}

module.exports = Post;