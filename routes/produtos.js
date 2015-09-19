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


router.post('/addProduto', function(req, res){
  var retorno = {id: req.body.id,
                 descricao: req.body.descricao,
                 precoCusto: req.body.precoCusto,
                 precoVenda: req.body.precoVenda,
                 tipo: req.body.tipo,
                 marca: req.body.marca }
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO PRODUTOS (id, descricao,precoCusto,precoVenda,tipo,marca) VALUES ($1,$2,$3,$4,$5)', [retorno.descricao, retorno.precoCusto, retorno.precoVenda, retorno.tipo, retorno.marca], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/produtos/listprodutos');

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
     var retorno = {descricao: req.body.descricao,
                 precoCusto: req.body.precoCusto,
                 precoVenda: req.body.precoVenda,
                 tipo: req.body.tipo,
                 marca: req.body.marca}

pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('UPDATE PRODUTOS SET $1 WHERE id = $2', [retorno, idproduto], function(err, result) {
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