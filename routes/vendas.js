var express = require('express');
var router = express.Router();
var pg = require('pg');
//process.env.DATABASE_URL


router.get('/', function(req, res, next) {
  res.render('vendas/homevendas', {
    title: 'Vendas - LYT Hookah',
    subtitle: 'Vendas'
  })
});

router.get('/listvendas', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM vendas', function(err, result) { 
      done();
    if (err){
      console.log(err);
    }
    res.render('venda/listvendas', {
      venda: result,
        title: 'Vendas - LYT Hookah'});
    });
  });
});
  


router.get('/novaVenda', function(req,res){
  res.render('venda/novaVenda', {title: 'Nova Venda'});
});


router.post('/novaVenda', function(req, res){
  var retorno = {codproduto: req.body.codproduto,
                 quantidade: req.body.quantidade,
                 valorTotal: req.body.valorTotal}

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO venda (tipo,codproduto,quantidade) VALUES ($1,$2,$3)', [retorno.tipo, retorno.codproduto, retorno.quantidade], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/venda/listvenda');

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

    res.render('venda/editarvenda',{
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
    res.redirect('/venda/listvenda');
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
        res.redirect('/venda/listvenda');
        console.log('Deletado com sucesso!');
        
      }); 
    });
  });
 module.exports = router;