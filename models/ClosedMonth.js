const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const ClosedMonth = sequelize.define('ClosedMonth', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    month: { type: DataTypes.STRING, allowNull: false }, // 'YYYY-MM'
    closedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  ClosedMonth.associate = (models) => {
    ClosedMonth.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return ClosedMonth;
};