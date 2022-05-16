const fs = require('fs')
const path = require('path')
const express = require('express')
const bp = require('body-parser')
const MarkdownIt = require('markdown-it'),
   md = new MarkdownIt();
var cors = require('cors');
const app = express();
var files = fs.readdirSync("./private");

app.use(cors());
app.use(express.static('public'))
app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))
app.listen(3000, () => {
    console.log("Escuchando en: http://localhost:3000");
    console.log(files);;
})

//console.log(files);

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/recitar', (request, response) => {
    fs.readFile(path.resolve(__dirname, 'private/ejemplo.md'), 'utf8',
        (err, data) => {
            if (err) {
                console.error(err)
                response.status(500).json({
                    error: 'message'
                })
                return
            }
            response.json({
                text: data.replace(/\n/g, '<br>')
            })
        })
    //
})

app.post('/', (request, response) => {
    console.log(request.body)
    let markDownText = request.body.text
    console.log(markDownText)
    let htmlText = md.render(markDownText)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({
        text: htmlText
    }))
})