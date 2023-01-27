'use strict';
let dataGempa = [
  ['1', 'Barat Laut Kab Cianjur', 2.1, 10, 5, 'Not Fealt'],
  ['2', 'Tenggara Pesisir Barat', 4.7, 46, 55, 'Not Fealt'],
  ['3', 'Barat Laut Kab Cianjur', 4.3, 10, 7, 'Fealt'],
  ['4', 'Timur Laut Alor', 4, 10, 45, 'Fealt'],
  ['5', 'Timur Laut Jayapura', 4.9, 10, 13, 'Fealt'],
  ['6', 'Barat Daya Kab Purwakarta', 3.6, 7, 22, 'Fealt'],
  ['7', 'Tenggara Meulaboh', 4.8, 1, 91, 'Not Fealt'],
  ['8', 'Barat Laut Kab Cianjur', 3.4, 4, 8, 'Fealt'],
  ['9', 'Timur Laut Kota Jayapura', 4, 10, 36, 'Not Fealt'],
  ['10', 'Timur Laut Kota Jayapura', 3.4, 10, 18, 'Not Fealt'],
  ['11', 'Barat Daya Kota Jayapura', 3.9, 21, 8, 'Not Fealt'],
  ['12', 'Barat Laut Wonosobo', 2.3, 8, 22, 'Not Fealt'],
  ['13', 'Timur Laut Pamala', 3.2, 7, 4, 'Fealt'],
  ['14', 'Timur Laut Kota Jayapura', 4, 6, 39, 'Fealt'],
  ['15', 'Timur Laut Kota Jayapura', 3.9, 10, 32, 'Fealt'],
  ['16', 'Tenggara Pacitan', 5.4, 10, 306, 'Not Fealt'],
  ['17', 'Barat Laut Jayapura', 4.4, 22, 78, 'Fealt'],
  ['18', 'Tenggara Melonguane', 7.1, 64, 141, 'Fealt'],
  ['19', 'Tenggara Bone Bolango', 6.3, 138, 69, 'Fealt'],
  ['20', 'Timur Laut Kota Jayapura', 3.4, 10, 18, 'Not Fealt'],
  ['21', 'Barat Daya Kab Cianjur', 2.4, 10, 4, 'Fealt'],
  ['22', 'Barat Laut Kab Cianjur', 2.6, 10, 6, 'Fealt'],
  ['23', 'Timur Laut Ruteng', 4.7, 30, 27, 'Fealt'],
  ['24', 'Barat Laut Kab Jayapura', 4.1, 13, 20, 'Not Fealt'],
  ['25', 'Tenggara Kab Pekalongan', 2.3, 21, 24, 'Fealt'],
  ['26', 'Tenggara Kab Pekalongan', 2.2, 17, 24, 'Fealt'],
  ['27', 'Tenggara Kab Pekalongan', 1.9, 10, 21, 'Fealt'],
  ['28', 'Timur Laut Pulau Sipora', 4.4, 10, 71, 'Not Fealt'],
  ['29', 'Barat Daya Kab Malang', 5.1, 17, 125, 'Fealt'],
  ['30', 'Timur Laut Jayapura', 3.8, 10, 14, 'Not Fealt'],
  ['31', 'Barat Laut Kab Cianjur', 5.6, 10, 9.65, 'Slight Demage'],
  ['32', 'Barat Laut Maluku', 7.6, 151.2, 131, 'Fealt'],
  ['33', 'Tenggara Pacitan', 5.4, 59, 81, 'Fealt'],
  ['34', 'Kab Karangasem', 5.2, 10, 31.69, 'Fealt'],
  ['35', 'Kota Sukabumi', 5.8, 104, 22.5, 'Fealt'],
  ['36', 'Barat Laut Kab Garut', 6.4, 118, 26.7, 'Fealt'],
  ['37', 'Selatan Kota Garut', 5.1, 70, 89, 'Fealt'],
  ['38', 'Barat Daya Kota Bengkulu', 6.8, 10, 215.8, 'Fealt'],
  ['39', 'Barat Daya Kab Garut', 5.3, 10, 122.5, 'Fealt'],
  ['40', 'Barat Laut Kab Tojo Una-una', 5.2, 10, 13, 'Fealt'],
  ['41', 'Tenggara Kota Lahat', 4.2, 1, 19.8, 'Fealt'],
  ['42', 'Barat Daya Kota Muara Enim', 4, 1, 18, 'Fealt'],
  ['43', 'Selatan Kab Lebak', 5.5, 12, 15.77, 'Fealt'],
  ['44', 'Timur Laut Kab Sumedang', 2.7, 16, 2.3, 'Fealt'],
  ['45', 'Barat Laut Kab Tapanuli Utara', 6, 10, 15, 'Fealt'],
  ['46', 'Barat Daya Kab Aceh Barat', 6.2, 22, 44.77, 'Fealt'],
  ['47', 'Barat Laut Kepulauan Mentawai', 6.1, 10, 150.7, 'Fealt'],
  ['48', 'Timur Laut Membaromo Raya', 6.2, 16, 40.1, 'Fealt'],
  ['49', 'Kab Kepulauan Mentawai', 6.4, 10, 160, 'Fealt'],
  ['50', 'Kab Kaur, Prov Bengkulu', 6.5, 12, 66.3, 'Fealt'],
  ['51', 'Tenggara Kab Aceh ', 4.3, 24, 17, 'Not Fealt'],
  ['52', 'Barat daya gunung Kidul', 2.9, 8, 14, 'Not Fealt']
]
module.exports = {
  async up(queryInterface, Sequelize) {
    const timeNow = new Date();
    for (let d of dataGempa) {
      await queryInterface.bulkInsert(
        "Earthquakes",
        [
          {
            lokasi: d[1],
            kekuatanGempa: d[2],
            kedalamanGempa: d[3],
            jarakGempa: d[4],
            dampakGempa: d[5],
            createdAt: timeNow,
            updatedAt: timeNow,
          },
        ],
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Earthquakes", null, {});
  },
};