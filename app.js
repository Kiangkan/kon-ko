const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        if (file.mimetype !== 'image/jpeg') {
            cb("your file sould be an jpeg image")
        } else {
            cb(null, file.originalname)
        }
    }
});

const upload = multer({ storage })

app.use(express.static("assets"));
app.use(express.static("uploads"));

app.get("**", function(req, res) {
    const host = "https://" + req.get("host");
    const ogImageSource = host + "/" + req.query.user + ".jpg" ||  + host + "/developer.jpg";
    const html = fs.readFileSync("view/index.html").toString();
    var view = html.replace("<!--SEO-->", `
<meta property="og:title" content="Kon Ko - Play" />
<meta property="og:description" content="Free Play" />
<meta property="og:image" content="${ogImageSource}" />`)
    res.send(" " + view + " ")
});

app.post("/upload", upload.single('image'), function(req, res) {
    res.json(req.file)
});

module.exports = app;