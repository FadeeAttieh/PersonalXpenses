const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Savings = sequelize.define('Savings', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(18,2), allowNull: false },
    note: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    locked: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  Savings.associate = (models) => {
    Savings.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return Savings;
};