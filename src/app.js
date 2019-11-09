const express = require('express');
const http = require('http');
const path = require('path');
const User = require('./model/User');
const Publication = require('./model/Publication');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});
const {check} = require('express-validator');

const session = require('express-session');
let flag = 0, login = 1;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
    secret: 'super secret session key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
   

app.get('/', (req, res) => {

    (async function() {
        const result = await Publication.find();
        res.render('index', {login,btnPost: !login, post:result});           
    })();   
});

app.get('/sair', (req, res) => {

    req.session.email="";
    flag = 0;
    login = 1;
    res.redirect('/');
});

app.get('/login', (req, res) => {
    flag ? res.render('login', {alert:'Usuário ainda não logado'}) : res.render('login');
    flag = 0;
});

app.get('/post', (req, res) => {
    if(req.session && req.session.email){
        res.render('post', {
            cache: req.session.email
        })
    }else{
        flag = 1;
        return res.redirect('/login');
    }
});

app.get('/register', (req, res) => {

    flag ? res.render('register', {alert:'Usuário ainda não cadastrado'}) : res.render('register');
    flag = 0;
});

app.post('/register', urlencodedParser,
[
    check('nome', 'Nome Invalido').isLength({min:3, max:45}),
    check('email', 'Email Invalido').isEmail(),
    check('senha', 'Senha Invalida').isLength({min:5, max:45}),
    check('cep', 'CEP Invalido').isLength({min:8, max:8}),
    check('rua', 'Rua Invalida').isLength({min:3, max:45}),
    check('bairro', 'Bairro Invalido').isLength({min:3, max:45}),
    check('numero', 'Numero Invalido').isLength({min:1, max:10})
],
(req, res) =>{

    let user = new User({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        cep: req.body.cep,
        rua: req.body.rua,
        bairro: req.body.bairro,
        numero: req.body.numero,
        complemento: req.body.complemento,
    });
    
    (async function() {
        const result = await User.find(user.email); 

        if(result.length > 0){
            
            return res.render('register', {alert:'Usuário já cadastrado'});
        } else{
            await User.save(user);
            res.redirect('/login');
        }                
    })();            
});

app.post('/login',[
    check('email', 'Email Invalido').isEmail(),
    check('senha', 'Senha Invalida').isLength({min:5, max:45})
],
(req,res)=>{
    

    (async function() {
        const result = await User.find(req.body.email); 

        if(result.length > 0){
            if(result[0].senha === req.body.senha){
                req.session.email = req.body.email;
                login = 0;
                return res.redirect('/post');
            }
            else{
                return res.render('login', {alert:'Senha incorreta'});
            }

        } else{
            flag = 1;
            return res.redirect('/register');
        }                
    })();    
})

app.post('/post', urlencodedParser,
[
    check('text', 'Insira um texto').isLength({min:1})
],
(req, res) =>{

    if(req.session && req.session.email){
        let publication = new Publication({
            email: req.session.email,
            text: req.body.text
        });
        
        (async function() {
            await Publication.save(publication);
            res.redirect('/');    
        })();
    }else{
        flag = 1;
        return res.redirect('/login');
    }            
});

//http.createServer(app).listen(process.env.PORT || 8001);

http.createServer(app).listen(3000);