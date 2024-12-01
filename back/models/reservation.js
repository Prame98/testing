const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

class Reservation extends Sequelize.Model {
  static initiate(sequelize) {
    Reservation.init(
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
        modelName: 'Reservation',
        tableName: 'reservations',
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
    db.Reservation.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    db.Reservation.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
}


module.exports = Reservation;
