const Sequelize = require('sequelize');

class RefreshToken extends Sequelize.Model {
  static initiate(sequelize) {
    RefreshToken.init({
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { // User의 기본 키 id와 연결
        type: Sequelize.INTEGER, // User.id의 데이터 타입과 일치시킴
        allowNull: false,
        unique: true, // 한 User는 하나의 RefreshToken만 가질 수 있음
      },
      refreshToken: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.RefreshToken.belongsTo(db.User, {
      foreignKey: 'userId', // RefreshToken.userId -> User.id
      targetKey: 'id',      // User의 기본 키(id)에 연결
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

module.exports = RefreshToken;
