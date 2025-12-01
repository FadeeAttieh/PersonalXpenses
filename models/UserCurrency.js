const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const UserCurrency = sequelize.define('UserCurrency', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    currencyCode: { type: DataTypes.STRING(10), allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  UserCurrency.associate = (models) => {
    UserCurrency.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    UserCurrency.belongsTo(models.Currency, { foreignKey: 'currencyCode', targetKey: 'code', onDelete: 'CASCADE' });
  };
  return UserCurrency;
};