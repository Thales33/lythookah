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
    client.query('SELECT produtos.Descricao as pdescricao, marca.Nome as mnome, Sum(Estoque.quantidade) AS Quantidade FROM (Marca INNER JOIN Produtos ON Marca.idmarca = Produtos.idMarca) INNER JOIN Estoque ON Produtos.idprodutos = Estoque.idprodutos GROUP BY Estoque.idprodutos, Produtos.Descricao, Marca.Nome;', function(err, result) { 
      done();
    if (err){
      console.log(err);
    }
    res.render('estoque/listestoque', {
      estoques: result,
        title: 'estoque - LYT Hookah'});
    });
  });
});
  


router.get('/atualiza', function(req,res){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT p.descricao, p.idprodutos, distinct m.nome FROM produtos p inner join marca m on (p.idmarca = m.idmarca) GROUP by p.descricao, p.idprodutos, m.nome order by p.idprodutos ASC', function(err, retorno) { 
     if (err){
      console.log(err);
     }
  res.render('estoque/atuEstoque', {
    title: 'Atualiza Estoque',
    produtos : retorno
    });
   });
  });
 });

router.post('/atuestoque', function(req, res){
  codproduto = req.body.produto,
  quantidade = req.body.quantidade

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('INSERT INTO estoque (idprodutos,quantidade) VALUES ($1,$2)', [codproduto, quantidade], function(err, result) {
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