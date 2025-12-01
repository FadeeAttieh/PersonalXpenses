const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Currency = sequelize.define('Currency', {
    code: { type: DataTypes.STRING(10), primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false }
  });
  Currency.associate = (models) => {
    Currency.hasMany(models.UserCurrency, { foreignKey: 'currencyCode', sourceKey: 'code' });
  };
  return Currency;
};