'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let password = await bcrypt.hash(
      '123456789',
      parseInt(process.env.HASH_STRENGTH)
    );
    await queryInterface.bulkInsert(
      'users',
      [
        {
          email: 'admin@example.com',
          name: 'Admin',
          password,
          phone: '081122334455',
          gender: 'male',
          role: 'admin',
        },
        {
          email: 'burgerking@example.com',
          name: 'Burger King',
          password,
          img: 'logo_burgerking.png',
          phone: '081168394870',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'starbucks@example.com',
          name: 'Starbucks',
          password,
          img: 'logo_starbucks.png',
          phone: '081123526743',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'kfc@example.com',
          name: 'KFC',
          password,
          img: 'logo_kfc.png',
          phone: '081142124634',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'jco@example.com',
          name: 'Jco',
          password,
          img: 'logo_jco.png',
          phone: '08114574356',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'geprekbensu@example.com',
          name: 'Geprek Bensu',
          password,
          img: 'logo_kfc.png',
          phone: '08114574356',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'masrony@example.com',
          name: 'Nasi Goreng Mas Rony',
          password,
          img: 'logo_kfc.png',
          phone: '08114574356',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'prambanan@example.com',
          name: 'Pecel Ayam Prambanan',
          password,
          img: 'logo_kfc.png',
          phone: '08114574356',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'kopikenangan@example.com',
          name: 'Kopi Kenangan',
          password,
          img: 'logo_kfc.png',
          phone: '08114574356',
          gender: 'male',
          role: 'partner',
        },
        {
          email: 'me@example.com',
          name: 'Mr Meme',
          password,
          phone: '08114574356',
          gender: 'male',
          role: 'user',
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
