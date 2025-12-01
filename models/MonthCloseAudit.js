module.exports = (sequelize, DataTypes) => {
  const MonthCloseAudit = sequelize.define('MonthCloseAudit', {
    userId: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    month: DataTypes.STRING,
    calculated_money_on_hand: DataTypes.DECIMAL(18,2),
    entered_money_on_hand: DataTypes.DECIMAL(18,2),
    calculated_savings: DataTypes.DECIMAL(18,2),
    entered_savings: DataTypes.DECIMAL(18,2),
    difference_money_on_hand: DataTypes.DECIMAL(18,2),
    difference_savings: DataTypes.DECIMAL(18,2),
    closed_at: DataTypes.DATE,
    note: DataTypes.STRING
  }, {
    tableName: 'MonthCloseAudits',
    timestamps: false
  });
  return MonthCloseAudit;
};