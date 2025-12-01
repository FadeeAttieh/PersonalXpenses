const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    pin: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    email_verification_code: { type: DataTypes.STRING(10) }
  });
  User.associate = (models) => {
    User.hasMany(models.Entry, { foreignKey: 'userId' });
    User.hasMany(models.Type, { foreignKey: 'userId' });
    User.hasMany(models.Savings, { foreignKey: 'userId' });
    User.hasMany(models.Transfer, { foreignKey: 'userId' });
    User.hasMany(models.Balance, { foreignKey: 'userId' });
    User.hasMany(models.ClosedMonth, { foreignKey: 'userId' });
  };
  return User;
};