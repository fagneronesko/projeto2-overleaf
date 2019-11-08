let express = require('express'),
    http = require('http'),
    path = require('path'),
    User = require('./model/User'),
    app = express(),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended:false});
    const { check, validationResult} = require('express-validator');

var session = require('express-session');

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
        res.render('index', {login:1});
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/post', (req, res) => {
        res.render('post');
    });

    app.get('/register', (req, res) => {
        res.render('register');
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

        const errors = validationResult(req);
        console.log(errors.mapped());
      
        if(!errors.isEmpty()){
            return res.render('register',{title: "Register", error: errors.mapped()});
        }
        else{
            (async function() {
                const result = await User.find(user.email); 

                if(result.length > 0){
                    console.log('ja existe');
                    return res.render('register',{title: "Register", error: errors.mapped()});
                } else{
                    User.save(user);
                    console.log('sucesso ao cadastrar...');
                    res.redirect('/login');
                }                
            })();            
        }
    });

    http.createServer(app).listen(6969);