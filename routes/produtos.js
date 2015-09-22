var express = require('express');
var router = express.Router();
var pg = require('pg');
//process.env.DATABASE_URL





router.get('/', function(req, res, next) {
  res.render('produtos/homeprodutos', {
    title: 'Produtos - LYT Hookah',
    subtitle: 'Produtos'
  })
});

router.get('/listprodutos', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM PRODUTOS', function(err, result) { 
      done();
    if (err){
      console.log(err);
    }
    res.render('produtos/listprodutos', {
      produtos: result,
        title: 'Produtos - LYT Hookah'});
    });
  });
});
  
  

router.get('/addProduto', function(req,res){
  res.render('produtos/addProduto', {title: 'Cadastrar Novo Produto'});
});


router.post('/add', function(req, res){
  var id = req.body.id;
  var descricao = req.body.descricao;
  var precocusto = req.body.precocusto;
  var precovenda = req.body.precovenda;
  var tipo = req.body.tipo;
  var marca = req.body.marca;
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO PRODUTOS (id, descricao,precocusto,precovenda,tipo,marca) VALUES ($1,$2,$3,$4,$5,$6)', [id, descricao, precocusto, precovenda, tipo, marca], function(err, result) {
    done();
    if (err){
      console.log(err);
      res.send('Erro ao adicionar Produto ao Banco de Dados');
    }else{
     res.redirect('/produtos/listprodutos');
     }
  });
 });  
});

router.get('/editar/:id', function(req, res) {

  var id = req.params.id;
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
   client.query('SELECT * FROM PRODUTOS WHERE id = $1',[id], function(err, result) {
      done();
      if (err){
      console.log(err);
      console.log("ERRO" +err);

      }

      res.render('produtos/editarProdutos',{
      produtos : result,
      title: 'Editar Produto'
    });
   });
  });
});


router.post('/editarProdutos', function(req,res){
    var idproduto = req.body.idproduto;
  var descricao = req.body.descricao;
  var precocusto = req.body.precocusto;
  var precovenda = req.body.precovenda;
  var tipo = req.body.tipo;
  var marca = req.body.marca;

pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('UPDATE PRODUTOS SET (descricao = $1, precocusto = $2,precovenda = $3,tipo = $4, marca = $5) WHERE id = $6', [descricao, precocusto, precovenda, tipo, marca, idproduto], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/produtos/listprodutos');
  });
 });
});

router.get('/delete/:id',function(req,res){
    
    var id = req.params.id;    
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query("DELETE FROM PRODUTOS WHERE id = $1",[id],function(err){
      done();
        if(err){
            console.log(err);
        }           
        res.redirect('/produtos/listprodutos');
        console.log('Deletado com sucesso!');
        
      }); 
    });
  });
 module.exports = router;