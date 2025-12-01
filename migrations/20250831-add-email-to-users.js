module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true, // <-- allowNull: true for now
      unique: true
    });
    await queryInterface.addColumn('Users', 'email_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Users', 'email_verification_code', {
      type: Sequelize.STRING(10)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'email_verified');
    await queryInterface.removeColumn('Users', 'email_verification_code');
  }
};