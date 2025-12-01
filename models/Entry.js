const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Entry = sequelize.define('Entry', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    category: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    note: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, allowNull: false },
    typeId: { type: DataTypes.INTEGER, allowNull: false },
    locked: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  Entry.associate = (models) => {
    Entry.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Entry.belongsTo(models.Type, { foreignKey: 'typeId', onDelete: 'CASCADE' });
  };
  return Entry;
};