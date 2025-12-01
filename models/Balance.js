const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Balance = sequelize.define('Balance', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(18,2), allowNull: false },
    initial_amount: { type: DataTypes.DECIMAL(18,2), allowNull: true }, // <-- Add this line
    month: { type: DataTypes.STRING, allowNull: false }
  });
  Balance.associate = (models) => {
    Balance.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return Balance;
};