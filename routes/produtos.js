var express = require('express');
var router = express.Router();
var {Pool} = require('pg');
var pool = new Pool({connectionString: process.env.DATABASE_URL,
ssl: true
});





router.get('/', function(req, res, next) {
  res.render('produtos/homeprodutos', {
    title: 'Produtos - LYT Hookah',
    subtitle: 'Produtos'
  });
});

router.get('/listprodutos', function(req, res) {
  pool.connect(function(err, client, done){
    client.query('SELECT p.idprodutos, p.descricao, p.precocusto, p.precovenda, m.nome as mnome, t.descricao as tdescricao  FROM PRODUTOS as p inner join marca as m on (p.idmarca = m.idmarca) inner join tipo as t on (p.idtipo = t.idtipo) order by idprodutos ASC', function(err, result) { 
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
  pool.connect(function(err, client, done){
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
  pool.connect(function(err, client, done){
    client.query('INSERT INTO PRODUTOS (idmarca,idtipo,descricao,precocusto,precovenda) VALUES ($1,$2,$3,$4,$5)', [marca,tipo,descricao,precocusto, precovenda], function(err, result) {
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
  pool.connect(function(err, client, done){
  	client.query('SELECT * FROM marca', function(err, retorno) { 
     if (err){
      console.log(err);
     }
    client.query('SELECT * FROM tipo', function(err, resultados) { 
     if (err){
      console.log(err);
     }
    client.query('SELECT * FROM PRODUTOS WHERE idprodutos = $1',[id], function(err, result) {
      done();
      if (err){
      console.log(err);
      console.log("ERRO" +err);

      }

      res.render('produtos/editarProdutos',{
      produtos : result,
      title: 'Editar Produto',
      marcas: retorno,
      tipos : resultados });
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

pool.connect(function(err, client, done){
   client.query('UPDATE PRODUTOS SET descricao = ($1), precocusto = ($2),precovenda = ($3),idtipo = ($4), idmarca = ($5) WHERE idprodutos = $6', [descricao, precocusto, precovenda, tipo, marca, idproduto], function(err, result) {
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
  pool.connect(function(err, client, done){
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
