const http = require('http');
const fs = require('fs');
const { render, compileFile } = require('pug');
const express = require('express');
const app = express()
const path = require('path');
const mongoose = require('mongoose');

//connect db
mongoose.connect("mongodb://localhost:27017/ead");

//import path of products
const Product = require('./models/Product')

// apply css 
app.use('/style', express.static('public/css/'))

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
    res.render('index',{name:"kd", products})
});

app.get('/create', function(req, res){
    res.render('create');
});

app.get('/products', async function(req, res){
    const products = await Product.find();
    res.render('Products', {products});
});

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
    // console.log(fun({name:'kd'}))
    res.render('blog',{name:"ditho", products})
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