// migrations/20250814-create-enums.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Entries_category') THEN
          CREATE TYPE "enum_Entries_category" AS ENUM ('income', 'expense');
        END IF;
      END$$;
    `);
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Types_category') THEN
          CREATE TYPE "enum_Types_category" AS ENUM ('income', 'expense');
        END IF;
      END$$;
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Entries_category";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Types_category";');
  }
};