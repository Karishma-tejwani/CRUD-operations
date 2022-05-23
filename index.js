// const http = require('http');
// const fs = require('fs');
// const { render, compileFile } = require('pug');
const express = require('express');
const app = express()
const path = require('path');
const mongoose = require('mongoose'); //import db

//connect db
mongoose.connect("mongodb://localhost:27017/ead");

//import products
const Product = require('./models/Product');

// apply css 
app.use('/style', express.static('public/css/'));

const bodyParser = require('body-parser');
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

//set view engine
app.set('view engine', 'ejs')
// app.set('view engine', 'pug')

// write file
// fs.writeFileSync('read.txt','EAD is too tough course')

// //readfile
// console.log(fs.readFileSync('read.txt').toString());

// //rename file
// fs.renameSync('read.txt','readWrite.txt');

// const server = http.createServer(function(req, res){
//     res.write('hello')
//     res.end()
// })

// const server = http.createServer(function(req, res){
//     console.log(req.url)
//     if(req.url == '/something'){
//         res.write('something')
//     }
//     else if(req.url == '/abc'){
//         res.write('abc')
//     }
//     res.end()
// })

////////////////// send response to static pages

// const server = http.createServer(function(req, res){
//     console.log(req.url)
//     if(req.url === '/'){
//         const indexPage = fs.readFileSync('index.html')
//         res.write(indexPage)
//     }
//     else if(req.url === '/about'){
//         const aboutPage = fs.readFileSync('about.html')
//         res.write(aboutPage)
//     }
//     res.end()
// })

// server.listen(3000, function(){
//     console.log('Server is listening at 3000 port')
// })

//////////////Express

// app.get('/', function(req,res){
//     res.status(200).json({result: "success"})
// })

//////////// Absolute path
// app.get('/', function(req,res){
//     console.log(__dirname)
//     res.sendFile(path.resolve(__dirname, 'index.html'))
// })

// app.get('/about', function(req,res){
//     console.log(__dirname)
//     res.sendFile(path.resolve(__dirname, 'about.html'))
// })

//---------------ejs----------------

app.get('/', function(req, res){
    const products = ['A','B','C','D']
    res.render('index',{name:"Man!", products})
});

app.get('/create', function(req, res){
    res.render('create');
});

app.get('/products', async function(req, res){
    const products = await Product.find();
    res.render('products', {products});
});

app.get('/product/getProduct/:pid', async function(req, res){
    const pid = req.params.pid;
    console.log(pid);
    const product = await Product.findById(pid);
    res.render('productDetail', {product})
});

// Update
app.post('/products/update/:pid', async function(req, res){
    const pid = req.params.pid;
    console.log("updated id: " + pid);
    console.log("updated title and price: "+req.body.title+ " " + req.body.price);
    const prod = await Product.updateMany({_id: pid}, {$set: {title: req.body.title, price: req.body.price}});
    console.log("updated product " + prod);
    res.redirect('/');
});

// Delete
app.post('/products/delete/:pid', async function(req, res){
    const pid = req.params.pid;
    console.log("delete id: " + pid);
    const product = await Product.findByIdAndDelete(pid);
    const products = await Product.find();
    // console.log("deleted id: " + product);
    res.render('products', {products});
});

// Create
app.post('/product/create', function(req, res){
    console.log(req.body);
    Product.create(req.body, function(err, product){
        console.log(product);
        res.redirect('/products');
    });
});

// ----------------pug----------

app.get('/blog', function(req, res){
    const products = ['A','B','D','S']
    // const fun = compileFile('views/heading.pug')
    // console.log(fun({name:'Karshi'}))
    res.render('blog',{name:"Karshi", products})
})

app.all('/about', function(req, res){
    res.render('about')
})

app.use("*", function(req, res){
    res.status(404).json({msg:"Not found"})
})

app.listen(3000, function(){
    console.log('Server is listening at 3000 port')
})