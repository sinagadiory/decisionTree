const fs = require("fs")
const path = require("path")
const { marked } = require("marked")
const markdownIt = require("markdown-it");
class contentController {

  static knnMethod(req, res) {
    const filePath = path.join(__dirname, "../../public/content/knnMethod.MD")
    const file = fs.readFileSync(filePath, "utf-8")
    const html = markdownIt().render(file);
    const content = `<!DOCTYPE html>
    <html>
      <head>
        <title>README</title>
      </head>
      <body>
        <iframe srcdoc="${html}" width="100%" height="100%"></iframe>
      </body>
    </html>`
    res.send(content)
  }
}


module.exports = contentController