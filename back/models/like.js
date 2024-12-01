const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Like',
        tableName: 'likes',
        indexes: [
          {
            unique: true,
            fields: ['userId', 'postId'], // 복합 유니크 설정
          },
        ],
      }
    );
  }

  static associate(db) {
    db.Like.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    db.Like.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
}

module.exports = Like;
