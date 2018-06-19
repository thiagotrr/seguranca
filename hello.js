var express = require('express');
var session = require('express-session');
var app = express();
var multer  = require('multer');
var upload = multer();

var mongo = require('mongodb');
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/seguranca', function(err){
	if (err) throw err;
	console.log('Conectou!');
});  

var usuarioSchema = new Schema({  
 _id: mongoose.Schema.Types.Objectid,  
 login: String,  
 senha: String  
});  

var Usuario = mongoose.model('usuario', usuarioSchema);  

app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/', function (req, res) {
  if(req.session.auth==true) {
	  if (req.session.count) {
		req.session.count++
		res.setHeader('Content-Type', 'text/html')
		res.write('<p>Contador: ' + req.session.count + '</p>')
		res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
		res.end()
	  } else {
		req.session.count = 1
		res.end('welcome to the session demo. refresh!')
	  }
  } else {
	    res.send('you must login first');
  }
});

app.post('/login', upload.array(), function (req, res, next) {
  console.log(req.body);
  
  if (req.session.auth==true) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><meta charset="utf-8"></head><body><p>Você já está logado</p></body></html>');
    res.end();
  } 
  
  //Usuario.findOne({ "login": req.body.nome, "senha": req.body.senha }, 
  Usuario.findById(1, function(err, obj){
				console.log(obj);
				if (err) { 
					console.error('erro no findByOne');
					res.end('Erro no login!');
				}
				if (obj.id == ""){
					console.log('usuário não encontrado');
					res.end('Usuário/senha não encontrados!');
				}
				console.log('Sucesso!');
					req.session.auth = true;
					res.end('welcome to the session demo. refresh!');
			}
	);
  
  /* Código default 
  else if(validaLogin(req)==true) {
	  
		
		req.session.auth = true;
    	res.end('welcome to the session demo. refresh!');
		
  } else {
		res.end('try again');
  }*/
});

app.get('/count', function (req, res) {
  if (req.session.count) {
    req.session.count++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>Contador: ' + req.session.count + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    res.end('no session demo, go to root!')
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//req.session.destroy();
