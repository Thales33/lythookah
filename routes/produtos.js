var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = process.env.DATABASE_URL;
// var conString = "postgres://postgres:ankit1234@localhost:5432/nodedb_development";
var connection = new pg.Client(conString);
// Connect PostgreSQL
connection.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});


router.get('/', function(req, res, next) {
	res.render('produtos/homeprodutos', {
		title: 'Produtos - LYT Hookah',
		subtitle: 'Produtos'
	})
 });

router.get('/listprodutos', function(req, res) {
	connection.query('SELECT * FROM PRODUTOS', function(err, result) { 
    if (err){
      console.log(err);
    }
    res.render('produtos/listprodutos', {
    	produtos: result,
        title: 'Produtos - LYT Hookah'});
  });
});
	/*var results = [];
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      var query = client.query("SELECT * FROM LYTHOOKAH.PRODUTOS ORDER BY ASC;");
      query.on('row', function  (row) {
      	results.push(row);
      });
      query.on('end', function () {
      	client.end();
      	return res.json(results);
      });
      if(err) {
      	console.log(err);
      }
 });
});*/

router.get('/add', function(req,res){
	res.render('produto/addProduto', {title: 'Cadastrar Novo Produto'});
});


/*app.post("/users", function (req, res) {
  var name=req.body.name;
  var email=req.body.email;
  var des=req.body.des;
  
  connection.query('INSERT INTO users (name,email,des) VALUES ($1,$2,$3) RETURNING id', [name, email, des], function(err, docs) {
    res.redirect('/');
  });
});*/


router.post('/add', function(req, res){
  var retorno = {descricao: req.body.descricao,
                 precoCusto: req.body.precoCusto,
                 precoVenda: req.body.precoVenda,
                 tipo: req.body.tipo,
                 marca: req.body.marca }

 connection.query('INSERT INTO PRODUTOS (descricao,precoCusto,precoVenda,tipo,marca) VALUES ($1,$2,$3,$4,$5)', [retorno.descricao, retorno.precoCusto, retorno.precoVenda, retorno.tipo, retorno.marca], function(err, result) {
    if (err){
      console.log(err);
    }
    res.redirect('/produtos/listprodutos');

  });
});

router.get('/editar/:id', function(req, res) {
  var id = req.params.id;

  connection.query('SELECT * FROM PRODUTOS WHERE id = $1',[id] function(err, result) {
    if (err){
      console.log(err);
    }

    res.render('produtos/editarProdutos',{
      produtos : result,
      title: 'Editar Produto'
    })
        });

router.post('/editarProdutos', isLoggedIn,function(req,res){
    var idproduto = req.body.idproduto;
     var retorno = {descricao: req.body.descricao,
                 precoCusto: req.body.precoCusto,
                 precoVenda: req.body.precoVenda,
                 tipo: req.body.tipo,
                 marca: req.body.marca}

 connection.query('UPDATE PRODUTOS SET $1 WHERE id = $2', [retorno, idproduto], function(err, result) {
    if (err){
      console.log(err);
    }
    res.redirect('/produtos/listprodutos');
  });
});

router.get('/delete/:id',function(req,res){
    
    var id = req.params.id;
    
  connection.query("DELETE FROM PRODUTOS WHERE id = $1",[id],function(err){
        if(err){
            console.log(err);
            res.send('Erro ao Deletar Usuario do Banco de Dados')
        } else{
            
            res.redirect('/produtos/listprodutos');
            console.log('Deletado com sucesso!');
        }
    });
});
