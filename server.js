const express = require('express'),
    mysql = require('mysql'),   
    BodyParser = require("body-parser"),
    path = require('path'),
    multer = require('multer'),
    app = express()

const db = mysql.createConnection({
    host: "localhost",
    database: "toko_online",
    user: "root",
    password: ""
})

app.set("view engine", "ejs")
app.set("views", "views")
app.use(BodyParser.urlencoded({extended: true}))
app.use(express.static('public')) // static file is in "public" directory

const upload = multer({ storage: multer.memoryStorage() })

db.connect((err) => {
    if (err) throw err
    console.log("DB connected.")

})

app.get("/", (req, res) => {
    const q = "SELECT * FROM `produk`"  
    db.query(q, (err, result) => {
        const produks = JSON.parse(JSON.stringify(result))
        res.render("index", {title: "Home", produks: produks, active: "home"}) 
})
})

app.get("/admin", (req, res) => {
    const q = "SELECT * FROM `produk`"  
    db.query(q, (err, result) => {
        const produks = JSON.parse(JSON.stringify(result))
        res.render("admode", {title: "ADMIN EDITING MODE", produks: produks, active: "shop"}) 
    })
})

// READ ?
app.get("/shop", (req, res) => {
    const q = "SELECT * FROM `produk`"  
    db.query(q, (err, result) => {
        const produks = JSON.parse(JSON.stringify(result))
        res.render("shopv2", {title: "Shop V2", produks: produks, active: "shop"}) 
    })
})

//
app.get("/product", (req, res) => {
    q = `SELECT * FROM \`produk\` WHERE id = '${req.query.id}'`  
    db.query(q, (err, result) => {
        const produk = JSON.parse(JSON.stringify(result))
        res.render("product", {title: "Summary", produk: produk, active: "shop"}) 
        // console.log("hasil ->", produk[0].id)
    })
})

// CREATE
app.post("/upload", upload.single("ProductImage"), (req, res) => {
    q = "INSERT INTO `produk` VALUES(NULL, ?, ?, ?, ?, ?, ?)"
    const image = req.file.buffer.toString("base64"),
        name = req.body.product,
        price = req.body.price,
        category = req.body.category,
        rating = req.body.rating,
        brand = req.body.brand
    
    db.query(q, [name, price, image, category, rating, brand], (err, rows, fields) => {
        if (err) throw err
        res.redirect("/shop")
    })
})

// DELETE
app.get("/remove/(:id)", (req, res) => {
    q = `DELETE FROM produk WHERE id = ${req.params.id}`
    db.query(q, (err, result) => {
        if (err) throw err
        res.redirect("/shop")
    })
})

// SEARCH
app.get("/search", (req, res) => {
    q = `SELECT * FROM \`produk\` WHERE 
        'nama_produk' LIKE %${req.query.category}%
        'category' LIKE %${req.query.category}%
        'brand' LIKE %${req.query.category}%`
    db.query(q, (err, result) => {
        const produks = JSON.parse(JSON.stringify(result))
        res.render("search", {title: "Search Results ", produks: produks}) 
    })
})

//blog
app.get("/blog", (req, res) =>{
    res.render("blog", {title: "Blog", active: "blog"})
})

app.get("/contact", (req, res) =>{
    res.render("contact", {title: "Contact-us", active: "contact"})
})

const port = 8000

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})