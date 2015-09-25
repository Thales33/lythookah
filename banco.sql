DROP TABLE Venda;

DROP TABLE Estoque;

DROP TABLE Produtos;

DROP TABLE Marca;

DROP TABLE Tipo;

CREATE TABLE Tipo(idTipo SERIAL   NOT NULL ,  descricao VARCHAR(45) NOT NULL,PRIMARY KEY(idTipo));


CREATE TABLE Marca (idMarca SERIAL   NOT NULL , nome VARCHAR(45) NOT NULL ,PRIMARY KEY(idMarca));

CREATE TABLE Produtos ( idProdutos SERIAL   NOT NULL , idMarca INTEGER   NOT NULL ,idTipo INTEGER   NOT NULL , descricao VARCHAR(45)   NOT NULL , precoCusto MONEY   NOT NULL ,precoVenda MONEY   NOT NULL ,PRIMARY KEY(idProdutos) , FOREIGN KEY(idTipo) REFERENCES Tipo(idTipo), FOREIGN KEY(idMarca) REFERENCES Marca(idMarca));


CREATE INDEX Secondary ON Produtos (idTipo);CREATE INDEX Secondary1 ON Produtos (idMarca);


CREATE INDEX IFK_produto_tem ON Produtos (idTipo);CREATE INDEX IFK_produto_tem2 ON Produtos (idMarca);


CREATE TABLE Estoque (idEstoque SERIAL   NOT NULL ,idProdutos INTEGER   NOT NULL , quantidade INTEGER   NOT NULL  , PRIMARY KEY(idEstoque) ,FOREIGN KEY(idProdutos) REFERENCES Produtos(idProdutos));


CREATE INDEX Secondary ON Estoque (idProdutos);


CREATE INDEX IFK_Estoque_TEM ON Estoque (idProdutos);


CREATE TABLE Venda (  idVenda SERIAL   NOT NULL ,  idProdutos INTEGER   NOT NULL ,  quantidade INTEGER   NOT NULL , precoVenda MONEY    NOT NULL , precoTotal MONEY    NOT NULL , PRIMARY KEY(idVenda) , FOREIGN KEY(idProdutos) REFERENCES Produtos(idProdutos));


CREATE INDEX Secondary4 ON Venda (idProdutos);CREATE INDEX IFK_Venda_tem  ON Venda (idProdutos);



