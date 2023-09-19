const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = process.env.port || 3000;
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
const cookieparser = require('cookie-parser'); //session data store in cookie
const session = require('express-session');
app.use(cookieparser());
const oneday = 1000 * 60 * 60 * 24;
app.use(session({
    saveUninitialized: true, //session data(clint request) came then save
    resave: false, //one server =>many tab open {multipal request handel}
    secret: 'sujay2k0@3kd9or78', //security no hackabale
    cookie: { maxAge: oneday }
}));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/login.html'));
})
app.get('/login',(req,res)=>{ //login endpoint means submit 
    if(req.session.username){
        res.redirect('/dashboard');
    }
    else{
    res.sendFile(path.join(__dirname,'./public/login.html'));
    }
})
app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, './public/dashboard.html'));
    }
    else {
        res.redirect('/login');
    }
})
app.post('/login', (req, res) => {
    fs.readFile('./database.txt', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(data);
            const alldata = JSON.parse(data);
            const viewdata = alldata.filter((item) => {
                if (item.username === req.body.uname && item.password === req.body.upass) {
                    return true;
                }
            })
            if (viewdata.length == 0) {
                res.send('/invalid password');
            }
            else {
                //res.send('welcome');
                req.session.username=req.body.uname;
                res.redirect('/dashboard');
            }
        }
    })
})
app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})
app.listen(port, () => {
    console.log(`Running the port no ${port}`);
})