'use strict';

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
    await queryInterface.bulkInsert(
      'products',
      [
        {
          name: 'Whooper',
          price: 60909,
          img: 'tos5lltwwqnvtvuap8anhm_product_list.png',
          userId: 2,
        },
        {
          name: 'King Meal Whooper Jr',
          price: 49545,
          img: 'i3dv6y8bjgsysjs2mcwxwd_product_list.png',
          userId: 2,
        },
        {
          name: 'Classic Crispy Chicken',
          price: 48182,
          img: 'bdhilkbxftuvitsvqwq45g_product_list.png',
          userId: 2,
        },
        {
          name: 'Sakura Beef Burger',
          price: 45000,
          img: 'ygsnpwyv3sk6vqjbkreg6a_product_list.png',
          userId: 2,
        },
        {
          name: 'Sakura Chicken Burger',
          price: 45000,
          img: 'kvkgf3fftk9px6vd6dxtgb_product_list.png',
          userId: 2,
        },
        {
          name: 'Sakura Super Float',
          price: 15000,
          img: 'n7vefwyhejadkamy8y3gim_product_list.png',
          userId: 2,
        },
        {
          name: 'Espresso',
          price: 49999,
          img: '10%20-%20Hot%20Espresso%20Macchiato_tcm33-46290_w1024_n.jpg',
          userId: 3,
        },
        {
          name: 'Frappucino',
          price: 49999,
          img: '42%20-%20Dark%20Mocha%20Frap_tcm33-46313_w1024_n.jpg',
          userId: 3,
        },
        {
          name: 'Chocolate Croissant',
          price: 49999,
          img: 'chocolate-croissant-reserve_tcm33-66591_w1024_n.jpg',
          userId: 2,
        },
        {
          name: 'Tuna Sandwich',
          price: 49999,
          img:
            '37%20-%20Tuna%20Cheese%20Whole%20Wheat%20Panini%201_tcm33-46438_w1024_n.jpg',
          userId: 3,
        },
        {
          name: 'Chocomilk',
          price: 49999,
          img: '66%20-%20Hot%20Signature%20Chocolate_tcm33-46322_w1024_n.jpg',
          userId: 3,
        },
        {
          name: 'Green Tea Latte',
          price: 49999,
          img: '69%20-%20Hot%20Green%20Tea%20Latte_tcm33-46323_w1024_n.jpg',
          userId: 3,
        },
        {
          name: 'Wing Bucket',
          price: 49999,
          img: 'kfc-web_wingsbucket_l.png',
          userId: 4,
        },
        {
          name: 'Crispy Box',
          price: 49999,
          img: 'kfc-web_crispy-box_l.png',
          userId: 4,
        },
        {
          name: 'BBQ Bento',
          price: 49999,
          img: 'kfc-web_barbequebento_l.png',
          userId: 4,
        },
        {
          name: 'Choconut Sundae',
          price: 49999,
          img: 'kfc-web_choconutsundae_l.png',
          userId: 4,
        },
        {
          name: 'Moccha Float',
          price: 49999,
          img: 'kfc-web_mocha-float_l_1.png',
          userId: 4,
        },
        {
          name: 'Alpacone',
          price: 49999,
          img: '4be290c0-6623-4407-afd9-773f88a0bdd3.jpg',
          userId: 5,
        },
        {
          name: 'Black Jack',
          price: 49999,
          img: '8777fff0-1018-4495-b025-33bd4c2fefcd.jpg',
          userId: 5,
        },
        {
          name: 'Caviar Chocolate',
          price: 49999,
          img: 'a97bafad-2f9b-4148-9fc0-114ec47264c0.jpg',
          userId: 5,
        },
        {
          name: 'Green Tease',
          price: 49999,
          img: '9eaf79e5-7442-4729-a2f1-6803df540a83.jpg',
          userId: 5,
        },
        {
          name: 'Paket Geprek',
          price: 15000,
          img: 'food-1.jpg',
          userId: 6,
        },
        {
          name: 'Paket Geprek Keju',
          price: 20000,
          img: 'food-5.jpg',
          userId: 6,
        },
        {
          name: 'Paket Geprek Leleh',
          price: 25000,
          img: 'food-6.jpg',
          userId: 6,
        },
        {
          name: 'Paket Sambal Matah',
          price: 15000,
          img: 'food-7.jpg',
          userId: 6,
        },
        {
          name: 'Mie Ayam Geprek',
          price: 17000,
          img: 'food-8.jpg',
          userId: 6,
        },
        {
          name: 'Mie Ayam Geprek Keju',
          price: 22000,
          img: 'food-9.jpg',
          userId: 6,
        },
        {
          name: 'Mie Ayam Leleh',
          price: 27000,
          img: 'food-10.jpg',
          userId: 6,
        },
        {
          name: 'Mie Ayam Sambel Telur',
          price: 22000,
          img: 'food-7.jpg',
          userId: 6,
        },
        {
          name: 'Nasi Goreng Bakso',
          price: 20000,
          img:
            '09930559-8040-4a78-ac5a-c507bd0a3f3c_1a2d7134-a4c2-4b52-8b68-d452cabfbf27_Go-Biz_20191025_231220.jpeg',
          userId: 7,
        },
        {
          name: 'Nasi Goreng Sosis',
          price: 20000,
          img:
            'a2e7a946-0d20-480b-a0d3-9dc54635ca97_d34d4656-ca17-4618-84c0-b7555d98aa53_Go-Biz_20191025_230956.jpeg',
          userId: 7,
        },
        {
          name: 'Paket Lele Kremes',
          price: 14000,
          img:
            'c2ae70c1-cefa-4eb2-97de-6a572f1fe643_1e19bcef-8b65-4eac-9275-3d4e37e85b12_Go-Biz_20190707_173413.jpeg',
          userId: 8,
        },
        {
          name: 'Paket Ayam Goreng',
          price: 16000,
          img:
            '92b2184a-aa5d-4b40-8524-dc57064ff37b_1a592751-6775-4929-b6a0-59c16f8a8e8e_Go-Biz_20190707_181714.jpeg',
          userId: 8,
        },
        {
          name: 'Kopi Kenangan Mantan',
          price: 18000,
          img: '4b2e9e97-a47e-49d3-8e20-26074032b26f_11.jpeg',
          userId: 9,
        },
        {
          name: 'Cokelat Pelarian',
          price: 24000,
          img: '4b2e9e97-a47e-49d3-8e20-26074032b26f_11.jpeg',
          userId: 9,
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
