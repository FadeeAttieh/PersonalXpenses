const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Type = sequelize.define('Type', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    description: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });

  Type.associate = (models) => {
    Type.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Type.hasMany(models.Entry, { foreignKey: 'typeId', onDelete: 'CASCADE' });
  };

  return Type;
};