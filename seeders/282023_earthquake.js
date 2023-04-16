'use strict';
const csv = require('async-csv');
const fs = require('fs').promises;

async function ReadData() {
  const csvString = await fs.readFile('./data/DataGempaTest1.csv', 'utf-8');

  const rows = await csv.parse(csvString);
  const DataGempa = rows.slice(1)
  DataGempa.map((d) => {
    d[2] = +d[2]
    d[3] = +d[3]
    d[4] = +d[4]
  })
  return DataGempa
}


module.exports = {
  async up(queryInterface, Sequelize) {
    const timeNow = new Date();
    const data = await ReadData()
    for (let d of data) {
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
