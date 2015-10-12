var express = require('express');
var router = express.Router();
var pg = require('pg');
//process.env.DATABASE_URL


router.get('/', function(req, res, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT p.descricao, e.idprodutos, p.precovenda FROM produtos p inner join estoque e on (p.idprodutos = e.idprodutos)', function(err, retorno) { 
     if (err){
      console.log(err);
     }
  res.render('vendas/homevendas', {
    title: 'Vendas - LYT Hookah',
    subtitle: 'Vendas',
    estoque: retorno
   });
  });
 });
});

router.get('/listvendas', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM vendas', function(err, result) { 
      done();
    if (err){
      console.log(err);
    }
    res.render('vendas/listvendas', {
      venda: result,
        title: 'Vendas - LYT Hookah'});
    });
  });
});
  


router.get('/novaVenda', function(req,res){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT e.idprodutos as idprodutos, p.descricao as descricao, p.precovenda as precovenda FROM produtos p inner join estoque e on (p.idprodutos = e.idprodutos) group by e.idprodutos, p.descricao, p.precovenda;', function(err, result) { 
      done();
    if (err){
      console.log(err);
    }
    res.render('vendas/novavenda', {
    title: 'Nova Venda',
    estoques: result});
  });
 });
});



router.post('/add', function(req, res){
  var codproduto = req.body.codproduto;
  var quantidade = req.body.quantidade;
  var precovenda = req.body.precovenda;
  var precototal = quantidade * precovenda;

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO venda (idprodutos,quantidade,precovenda,precototal) VALUES ($1,$2,$3,$4)', [codproduto,quantidade,precovenda,precototal], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/vendas/listvenda');

  });
 });
});

router.get('/editar/:id', function(req, res) {
  var id = req.params.id;

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
   client.query('SELECT * FROM venda WHERE id = $1',[id], function(err, result) {

      done();
      if (err){
      console.log(err);
      }

    res.render('vendas/editarvenda',{
      venda : result,
      title: 'Editar Produto'
    });
   });
  });
});


router.post('/editarvenda', function(req,res){
    var idvenda = req.body.idvenda;
     var retorno = {tipo: req.body.tipo,
                 codproduto: req.body.codproduto,
                 quantidade: req.body.quantidade}

pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('UPDATE venda SET $1 WHERE id = $2', [retorno, codproduto], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/vendas/listvenda');
  });
 });
});
router.get('/delete/:id',function(req,res){
    
    var id = req.params.id;    
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query("DELETE FROM venda WHERE id = $1",[id],function(err){
      done();
        if(err){
            console.log(err);
        }           
        res.redirect('/vendas/listvenda');
        console.log('Deletado com sucesso!');
        
      }); 
    });
  });
 module.exports = router;