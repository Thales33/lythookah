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
    client.query('SELECT p.idprodutos, p.descricao, p.precocusto, p.precovenda, m.nome, t.descricao  FROM PRODUTOS as p inner join marca as m on (p.idmarca = m.idmarca) inner join tipo as t on (p.idtipo = t.idtipo)', function(err, result) { 
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
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM marca', function(err, retorno) { 
     if (err){
      console.log(err);
     }
    client.query('SELECT * FROM tipo', function(err, resultados) { 
      done();
    if (err){
      console.log(err);
    }

    res.render('produtos/addProduto', {
    	title: 'Cadastrar Novo Produto',
        marcas: retorno,
        tipos : resultados});
   });
  });
 });
});


router.post('/add', function(req, res){
  var descricao = req.body.descricao;
  var precocusto = req.body.precocusto;
  var precovenda = req.body.precovenda;
  var tipo = req.body.tipo;
  var marca = req.body.marca;
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO PRODUTOS (descricao,precocusto,precovenda,idtipo,idmarca) VALUES ($1,$2,$3,$4,$5)', [descricao, precocusto, precovenda, tipo, marca], function(err, result) {
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
  	client.query('SELECT * FROM marca', function(err, retorno) { 
     if (err){
      console.log(err);
     }
    client.query('SELECT * FROM tipo', function(err, resultados) { 
     if (err){
      console.log(err);
     }
    client.query('SELECT * FROM PRODUTOS WHERE id = $1',[id], function(err, result) {
      done();
      if (err){
      console.log(err);
      console.log("ERRO" +err);

      }

      res.render('produtos/editarProdutos',{
      produtos : result,
      title: 'Editar Produto',
      marcas: retorno,
      tipos : resultados
    });
   });
  });
 });
});

router.post('/editarProdutos', function(req,res){
    var idproduto = req.body.idproduto;
  var descricao = req.body.descricao;
  var precocusto = req.body.precoCusto;
  var precovenda = req.body.precoVenda;
  var tipo = req.body.tipo;
  var marca = req.body.marca;

pg.connect(process.env.DATABASE_URL, function(err, client, done){
   client.query('UPDATE PRODUTOS SET descricao = ($1), precocusto = ($2),precovenda = ($3),idtipo = ($4), idmarca = ($5) WHERE id = $6', [descricao, precocusto, precovenda, tipo, marca, idproduto], function(err, result) {
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