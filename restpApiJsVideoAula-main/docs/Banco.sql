/*DROP SCHEMA  `aula_api_2024`;
CREATE SCHEMA IF NOT EXISTS `aula_api_2024` DEFAULT CHARACTER SET utf8 ;
USE `aula_api_2024` ;
CREATE TABLE IF NOT EXISTS `aula_api_2024`.`Cargo` (
  `idCargo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomeCargo` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`idCargo`),
  UNIQUE INDEX `idCargo_UNIQUE` (`idCargo` ASC),
  UNIQUE INDEX `nomeCargo_UNIQUE` (`nomeCargo` ASC))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `aula_api_2024`.`Funcionario` (
  `idFuncionario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomeFuncionario` VARCHAR(128) NULL,
  `email` VARCHAR(64) NULL,
  `senha` VARCHAR(64) NULL,
  `recebeValeTransporte` TINYINT(1) NULL,
  `Cargo_idCargo` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idFuncionario`),
  UNIQUE INDEX `idFuncionario_UNIQUE` (`idFuncionario` ASC),
  INDEX `fk_Funcionario_Cargo_idx` (`Cargo_idCargo` ASC),
  CONSTRAINT `fk_Funcionario_Cargo`
    FOREIGN KEY (`Cargo_idCargo`)
    REFERENCES `aula_api_2024`.`Cargo` (`idCargo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `aula_api_2024`.`Cargo` (`idCargo`, `nomeCargo`) VALUES (1, 'Administrador');
INSERT INTO `aula_api_2024`.`Cargo` (`idCargo`, `nomeCargo`) VALUES (2, 'Técnico em Informática Jr');
INSERT INTO `aula_api_2024`.`Cargo` (`idCargo`, `nomeCargo`) VALUES (3, 'Técnico em Informática Pleno');
INSERT INTO `aula_api_2024`.`Cargo` (`idCargo`, `nomeCargo`) VALUES (4, 'Analista de Sistemas Jr');

INSERT INTO `aula_api_2024`.`funcionario` (`nomeFuncionario`, `email`, `senha`, `recebeValeTransporte`, `Cargo_idCargo`) VALUES ('adm', 'adm@adm', md5(123456), 1, 1);
*/

DROP DATABASE IF EXISTS igreja_batista;
CREATE DATABASE igreja_batista;
USE igreja_batista;

CREATE TABLE usuarios(
    id_usuarios int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    senha varchar(255) not null,
    tel varchar(255) unique,
    data_nasc date,
    tipo_usuario varchar(255) not null
);

CREATE TABLE ministerios(
    id_ministerios int primary key auto_increment,
    nome varchar(255) not null,
    descricao varchar(255),
    dia_reuniao varchar(255) not null,
    id_coordenador int,
    foreign key (id_coordenador) references usuarios(id_usuarios)
);

CREATE TABLE usuarios_ministerios(
    id_usuarios_ministerios int primary key auto_increment,
    id_usuario int,
    id_ministerio int,
    data_entrada date not null,
    funcao varchar(255) not null,
    foreign key (id_usuario) references usuarios(id_usuarios),
    foreign key (id_ministerio) references ministerios(id_ministerios)
);

CREATE TABLE eventos(
    id_evento int primary key auto_increment,
    titulo varchar(255) not null,
    descricao varchar(255) not null,
    data_evento date not null,
    local_evento varchar(255) not null,
    limite_vagas int not null,
    status_evento varchar(255) not null
);



-- tabela usuarios
INSERT INTO usuarios (nome, email, senha, tel, data_nasc, tipo_usuario)
VALUES
    ("Pastor Samuel", "pastor.samuel@gmail.com", 12345, "(12)988139975", "1985-07-29", "ADM"),
    ("Pr. Daniel", "daniel@gmail.com", 87459, "(12)98759845", "1988-07-21", "PASTOR"),
    ("Irene", "irene@gmail.com", 97200, "(12)99584575", "1990-08-25", "LIDER"),
    ("Lucas", "lucas@gmail.com", 45612, "(12)991234567", "2008-03-15", "MEMBRO"),
    ("Mariana", "mariana@gmail.com", 78945, "(12)992345678", "2007-11-02", "MEMBRO"),
    ("Gabriel", "gabriel@gmail.com", 32178, "(12)993456789", "2009-01-19", "MEMBRO"),
    ("Fernanda", "fernanda@gmail.com", 65487, "(12)994567890", "1998-06-10", "LIDER"),
    ("Ricardo", "ricardo@gmail.com", 95124, "(12)995678901", "1995-09-27", "LIDER"),
    ("Patricia", "patricia@gmail.com", 75319, "(12)996789012", "1992-12-05", "LIDER"),
    ("Joao", "joao@gmail.com", 14785, "(12)997890123", "2010-04-08", "VISITANTE"),
    ("Beatriz", "beatriz@gmail.com", 25896, "(12)998901234", "2008-08-30", "VISITANTE"),
    ("Carlos", "carlos@gmail.com", 36914, "(12)999012345", "2007-05-14", "VISITANTE");

-- tabela ministerios
INSERT INTO ministerios (nome, descricao, dia_reuniao, id_coordenador)
VALUES
    ("Ministerio de Louvor", "Responsavel pelos louvores e canticos durante os cultos e encontros", "Sexta-feira", 7),
    ("Ministerio de Jovens", "Organiza encontros, estudos e atividades para os jovens da igreja", "Sabado", 8),
    ("Ministerio Infantil", "Cuida das atividades voltadas para as criancas e famlias", "Domingo", 9),
    ("Ministerio de Oração", "Grupo dedicado a momentos de oracao, intercessao e vigilia", "Quarta-feira", 7),
    ("Ministerio de Hospitalidade", "Recepciona visitantes, membros e novos convertidos", "Domingo", 8);

-- usuarios_ministerios
INSERT INTO usuarios_ministerios (id_usuario, id_ministerio, data_entrada, funcao)
VALUES
    (1, 1, "2024-01-10", "Vocalista"),
    (7, 1, "2024-02-15", "Tecladista"),
    (5, 2, "2024-03-05", "Lider Jovem"),
    (8, 2, "2024-03-20", "Participante"),
    (6, 3, "2024-04-12", "Professor"),
    (9, 3, "2024-04-18", "Auxiliar"),
    (10, 4, "2024-05-01", "Intercessor"),
    (1, 4, "2024-05-08", "Coordenador"),
    (12, 5, "2024-06-02", "Recepcionista"),
    (11, 5, "2024-06-10", "Visitante");

-- tabela eventos
INSERT INTO eventos (titulo, descricao, data_evento, local_evento, limite_vagas, status_evento)
VALUES
    ("Culto de Oração e Adoração", "Encontro de adoração, estudo bíblico e oração para a comunidade", "2026-07-15", "Sede da Igreja", 80, "ABERTO"),
    ("Noite de Adoração", "Evento com música, oração e louvor durante a noite de comunhão", "2026-06-20", "Salão da Igreja", 150, "ABERTO"),
    ("Escola Dominical Infantil", "Atividades bíblicas voltadas para crianças e famílias", "2026-06-10", "Centro Comunitário", 40, "ENCERRADO"),
    ("Campanha de Doação", "Arrecadação de alimentos, roupas e itens para a comunidade", "2026-07-01", "Igreja Batista Central", 100, "ABERTO"),
    ("Treinamento de Lideres", "Capacitação para coordenadores, diáconos e líderes de ministérios", "2026-08-05", "Auditório da Igreja", 30, "PLANEJADO");


