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
