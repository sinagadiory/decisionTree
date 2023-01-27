
const { download } = require("../../helper")
const { Earthquake } = require("../../models")

class earthquekeController {

  static async show(req, res) {
    let Earthquekes = await Earthquake.findAll()
    res.send(Earthquekes)
  }

  static async unduh(req, res) {
    let Earthquekes = await Earthquake.findAll({ attributes: ["id", "lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'] })
    const fields = [
      {
        label: "No",
        value: "id"
      },
      {
        label: "Lokasi",
        value: "lokasi"
      },
      {
        label: "Kekuatan Gempa",
        value: "kekuatanGempa"
      },
      {
        label: "Kedalaman Gempa",
        value: "kedalamanGempa"
      },
      {
        label: "Jarak Pusat Gempa",
        value: "jarakGempa"
      },
      {
        label: "Dampak Gempa",
        value: "dampakGempa"
      }
    ]
    return download(res, 'dataGempaIndonesia.csv', fields, Earthquekes);
  }

}

module.exports = earthquekeController