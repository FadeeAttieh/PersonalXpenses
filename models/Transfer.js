const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Transfer = sequelize.define('Transfer', {
    from_account: { type: DataTypes.STRING, allowNull: false },
    to_account: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    note: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, allowNull: false },
    locked: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  Transfer.associate = (models) => {
    Transfer.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return Transfer;
};