create database real_bingo;

use real_bingo;
delete from cupons;
drop table if exists cupons;
create table if not exists cupons (
	codigo int not null primary key auto_increment,
    pedido int not null check (pedido > 0) unique,
    data date not null,
    valor numeric(8,2) not null check(valor > 0),
    metodoPagamento varchar(255) not null,
    quantidade int not null check(quantidade > 0),
    cliente int not null,
    nome varchar(255) not null,
    cpf varchar(255) not null,
    telefone_fisco varchar(255),
    telefone_celular varchar(255),
    bairro varchar(255) not null,
    cidade varchar(255) not null,
    cep varchar(255) not null,
    estado varchar(255) not null,
    usuario int not null);



select * from cupons;

drop table usuarios;
create table if not exists usuarios(
	codigo int not null primary key auto_increment,
    nome varchar(255) not null,
    snome varchar(255) not null,
    email varchar(255) not null unique,
    senha varchar(255) not null,
    tipo tinyint not null default 0
);


alter table usuarios modify column tipo enum("ADMIN", "ADMIN_VEND","NORMAL") not null;

ALTER TABLE usuarios MODIFY COLUMN tipo ENUM('ADMIN', 'ADMIN_VEND', 'NORMAL', 'CAIXA') NOT NULL;

insert into usuarios(nome, snome, email, senha, tipo) values("mateus de miranda pereirea", "mateus", "mateus.pereira@shoppingreal.net", "123", 1);
insert into usuarios(nome, snome, email, senha, tipo) values("rian henrique", "ria", "rian.henrique@shoppingreal.net", "123", 1);

select * from cuponsClientes;
delete from cuponsClientes;
create table if not exists cuponsClientes(
codigo int not null primary key auto_increment,
codigoCupom int not null,
cliente int not null,
pedido int not null,
valor numeric(8,2) not null,
data date not null,
foreign key (codigoCupom) references cupons (codigo)
);


create table if not exists produto_imagens (
    id int not null primary key auto_increment,
    codigo_produto int not null,
    imagem_nome varchar(255),
    imagem_url varchar(255),
    codigo_usuario int not null,
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp
);

create table if not exists vendedorClientes(
	id int primary key auto_increment,
    codigoUsuario int not null,
    codigoVendedor int not null,
    codigoCliente int not null unique,
    codigoPedido int unique,
    data datetime not null default now()
);

/*Adicionar constraint de exclusão em cascata na tabela cuponsClientes*/
ALTER TABLE cuponsClientes DROP FOREIGN KEY cuponsClientes_ibfk_1;

ALTER TABLE cuponsClientes 
ADD CONSTRAINT cuponsClientes_ibfk_1 
FOREIGN KEY (codigoCupom) 
REFERENCES cupons (codigo) 
ON DELETE CASCADE;

ALTER TABLE cupons ADD COLUMN horario TIME;


  CREATE TABLE IF NOT EXISTS veiculos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    modelo VARCHAR(80) NOT NULL,
    cor VARCHAR(40) NOT NULL,
    placa VARCHAR(8) NOT NULL UNIQUE,
    chassi VARCHAR(17) NOT NULL UNIQUE
);
desc veiculos;
CREATE TABLE IF NOT EXISTS rotas (
	codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome varchar(60) NOT NULL UNIQUE
    
 );

CREATE TABLE IF NOT EXISTS visitas (
    codigo            INT          AUTO_INCREMENT PRIMARY KEY,
    codigoRota        INT          NOT NULL,
    codigoCliente     INT          NOT NULL,
    endereco          VARCHAR(200) NOT NULL,
    encontrado        TINYINT      NOT NULL DEFAULT 0,
    coordenadas       VARCHAR(50),
    fotoResidencia    TINYINT      DEFAULT 0,
    fotoResidenciaUrl VARCHAR(255),
    fotoDoc           TINYINT      DEFAULT 0,
    fotoDocUrl        VARCHAR(255),
    renegociado       TINYINT      NOT NULL DEFAULT 0,
    agendamento       TINYINT      NOT NULL DEFAULT 0,
    data_agendamento  DATE,
    novoTelefone          VARCHAR(20),
    codigoVeiculo INT,
    codigoCobrador INT,
    data date not null,
    saida time not null,
    chegada time not null,
    kmComeco DECIMAL(10,1) DEFAULT 0,
    kmFinal DECIMAL(10,1) DEFAULT 0,
    observacoes       VARCHAR(500),
    CONSTRAINT fk_cobrador
    FOREIGN KEY (codigoCobrador) REFERENCES usuarios(codigo),
    CONSTRAINT fk_veiculos
    FOREIGN KEY (codigoVeiculo) REFERENCES veiculos(codigo),
    CONSTRAINT fk_visita_rota FOREIGN KEY (codigoRota) REFERENCES rotas(codigo) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS pagamentos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    codigoVisita INT NOT NULL UNIQUE,
    contrato VARCHAR(50) NOT NULL,
    parcelas INT NOT NULL,
    valor int NOT NULL,
    CONSTRAINT fk_pagamento_visita
        FOREIGN KEY (codigoVisita) REFERENCES visitas(codigo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS renegociacoes (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    codigoVisita INT NOT NULL,
    contrato VARCHAR(50) NOT NULL,
    parcelas INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_renegociacao_visita 
        FOREIGN KEY (codigoVisita) REFERENCES visitas(codigo) ON DELETE CASCADE
);



create table if not exists protesto (
    numero_pedido integer not null,
    comarca_cartorio varchar(255) not null,
    data_solicitacao date not null,
    comarca_devedor varchar(255) not null,
    devedor varchar(255) not null,
    doc_devedor varchar(255) not null,
    numero_titulo integer not null,
    valor_titulo decimal(15,6) not null,
    valor_protestado decimal(15,6) not null,
    protocolo integer,
    data_protocolo date,
    especie varchar(255) not null,
    status_pedido varchar(255) not null,
    irregularidade varchar(255),
    ocorrencia_titulo varchar(255),
    data_ocorrencia date null
);



  create table if not exists serasa(
                status varchar(255) not null,
                id int not null,
                nomeDevedorPrincipal varchar(255) not null,
                tipoPessoa varchar(255) not null,
                documento varchar(255) not null,
                natureza varchar(255) not null,
                valor decimal(15,6) not null,
                dataCadastro timestamp not null,
                dataOcorrenciaVencimento date not null,
                operacao varchar(255) not null);



















