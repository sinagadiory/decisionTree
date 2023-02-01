const fs = require("fs")
const path = require("path")
const { marked } = require("marked")
let MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

class contentController {

  static knnMethod(req, res) {
    const filePath = path.join(__dirname, "../../public/content/knnMethod.MD")
    const file = fs.readFileSync(filePath, "utf-8")
    res.send(md.render(file.toString()))
  }
}


module.exports = contentController