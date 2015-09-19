var express = require('express');
var router = express.Router();
var pg = require('pg');
//process.env.DATABASE_URL


router.get('/', function(req, res, next) {
  res.render('estoque/homeestoque', {
    title: 'Estoque - LYT Hookah',
    subtitle: 'Estoque'
  })
});

router.get('/listestoque', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM estoque', function(err, result) { 
      done();
    if (err){
      console.log(err);
    }
    res.render('estoque/listestoque', {
      estoque: result,
        title: 'estoque - LYT Hookah'});
    });
  });
});
  


router.get('/atualiza', function(req,res){
  res.render('estoque/atuEstoque', {title: 'Atualiza Estoque'});
});


router.post('/atualiza', function(req, res){
  var retorno = {tipo: req.body.tipo,
                 codproduto: req.body.codproduto,
                 quantidade: req.body.quantidade}

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO estoque (tipo,codproduto,quantidade) VALUES ($1,$2,$3)', [retorno.tipo, retorno.codproduto, retorno.quantidade], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/estoque/listestoque');

  });
 });
});

router.get('/editar/:id', function(req, res) {
  var id = req.params.id;

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
   client.query('SELECT * FROM estoque WHERE id = $1',[id], function(err, result) {

      done();
      if (err){
      console.log(err);
      }

    res.render('estoque/editarestoque',{
      estoque : result,
      title: 'Editar Produto'
    });
   });
  });
});


router.post('/editarestoque', function(req,res){
    var idestoque = req.body.idestoque;
     var retorno = {tipo: req.body.tipo,
                 codproduto: req.body.codproduto,
                 quantidade: req.body.quantidade}

pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('UPDATE estoque SET $1 WHERE id = $2', [retorno, codproduto], function(err, result) {
    done();
    if (err){
      console.log(err);
    }
    res.redirect('/estoque/listestoque');
  });
 });
});
router.get('/delete/:id',function(req,res){
    
    var id = req.params.id;    
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query("DELETE FROM estoque WHERE id = $1",[id],function(err){
      done();
        if(err){
            console.log(err);
        }           
        res.redirect('/estoque/listestoque');
        console.log('Deletado com sucesso!');
        
      }); 
    });
  });
 module.exports = router;