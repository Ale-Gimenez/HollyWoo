-- ============================================================
--  HollyWoo — DDL + DML  (filmes infantis)
--  Banco de dados: filminis
--  Gerado em: 2026
-- ============================================================

DROP DATABASE IF EXISTS filminis;
CREATE DATABASE filminis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE filminis;

-- ── Tabelas auxiliares ────────────────────────────────────────────────────────

CREATE TABLE pais (
    id_pais   INT PRIMARY KEY AUTO_INCREMENT,
    nome      VARCHAR(255) NOT NULL UNIQUE,
    img VARCHAR(500) NOT NULL
);

CREATE TABLE linguagem (
    id_linguagem INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(255) NOT NULL UNIQUE,
    img VARCHAR(500) NOT NULL
);

CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE produtora (
    id_produtora INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(255) NOT NULL UNIQUE,
    img VARCHAR(500) NOT NULL
);

-- ── Saga (franquia / série de filmes) ─────────────────────────────────────────

CREATE TABLE saga (
    id_saga    INT PRIMARY KEY AUTO_INCREMENT,
    nome       VARCHAR(255) NOT NULL UNIQUE,
    descricao  TEXT
);

-- ── Pessoas ───────────────────────────────────────────────────────────────────

CREATE TABLE ator (
    id_ator          INT PRIMARY KEY AUTO_INCREMENT,
    nome             VARCHAR(255) NOT NULL,
    sobrenome        VARCHAR(255) NOT NULL,
    nome_personagem  VARCHAR(255) NOT NULL,
    img              VARCHAR(500) NOT NULL
);

CREATE TABLE diretor (
    id_diretor INT PRIMARY KEY AUTO_INCREMENT,
    nome       VARCHAR(255) NOT NULL,
    sobrenome  VARCHAR(255) NOT NULL,
    img VARCHAR(500) NOT NULL
);

-- ── Relacionamentos N:N auxiliares ───────────────────────────────────────────

CREATE TABLE ator_pais (
    id_ator_pais INT PRIMARY KEY AUTO_INCREMENT,
    id_ator      INT NOT NULL,
    id_pais      INT NOT NULL,
    FOREIGN KEY (id_ator) REFERENCES ator(id_ator),
    FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
);

CREATE TABLE diretor_pais (
    id_diretor_pais INT PRIMARY KEY AUTO_INCREMENT,
    id_pais         INT NOT NULL,
    id_diretor      INT NOT NULL,
    FOREIGN KEY (id_pais)    REFERENCES pais(id_pais),
    FOREIGN KEY (id_diretor) REFERENCES diretor(id_diretor)
);

CREATE TABLE produtora_pais (
    id_produtora_pais INT PRIMARY KEY AUTO_INCREMENT,
    id_produtora      INT NOT NULL,
    id_pais           INT NOT NULL,
    FOREIGN KEY (id_produtora) REFERENCES produtora(id_produtora),
    FOREIGN KEY (id_pais)      REFERENCES pais(id_pais)
);

-- ── Filme ─────────────────────────────────────────────────────────────────────

CREATE TABLE filme (
    id_filme               INT PRIMARY KEY AUTO_INCREMENT,
    titulo                 VARCHAR(255) NOT NULL UNIQUE,
    id_produtora_principal INT,
    id_pais_origem         INT,
    orcamento              DECIMAL(15,2),
    duracao                TIME,
    sinopse                LONGTEXT,
    ano                    INT,
    poster                 VARCHAR(255),
    banner                 VARCHAR(255),
    trailer                VARCHAR(255),
    classificacao          VARCHAR(10),        -- "L","6","10","12","14","16","18"
    estilo_visual          VARCHAR(50),        -- "3D","2D","Stop Motion","Anime"
    flag                   BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_produtora_principal) REFERENCES produtora(id_produtora),
    FOREIGN KEY (id_pais_origem)         REFERENCES pais(id_pais)
);

CREATE TABLE filme_produtora (
    id_filme_produtora INT PRIMARY KEY AUTO_INCREMENT,
    id_filme           INT NOT NULL,
    id_produtora       INT NOT NULL,
    FOREIGN KEY (id_filme)      REFERENCES filme(id_filme),
    FOREIGN KEY (id_produtora)  REFERENCES produtora(id_produtora)
);

CREATE TABLE filme_pais (
    id_filme_pais INT PRIMARY KEY AUTO_INCREMENT,
    id_filme      INT NOT NULL,
    id_pais       INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme),
    FOREIGN KEY (id_pais)  REFERENCES pais(id_pais)
);

CREATE TABLE filme_categoria (
    id_filme_categoria INT PRIMARY KEY AUTO_INCREMENT,
    id_filme           INT NOT NULL,
    id_categoria       INT NOT NULL,
    FOREIGN KEY (id_filme)     REFERENCES filme(id_filme),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE filme_ator (
    id_filme_ator INT PRIMARY KEY AUTO_INCREMENT,
    id_filme      INT NOT NULL,
    id_ator       INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme),
    FOREIGN KEY (id_ator)  REFERENCES ator(id_ator)
);

CREATE TABLE filme_diretor (
    id_filme_diretor INT PRIMARY KEY AUTO_INCREMENT,
    id_filme         INT NOT NULL,
    id_diretor       INT NOT NULL,
    FOREIGN KEY (id_filme)   REFERENCES filme(id_filme),
    FOREIGN KEY (id_diretor) REFERENCES diretor(id_diretor)
);

CREATE TABLE filme_linguagem (
    id_filme_linguagem INT PRIMARY KEY AUTO_INCREMENT,
    id_filme           INT NOT NULL,
    id_linguagem       INT NOT NULL,
    FOREIGN KEY (id_filme)     REFERENCES filme(id_filme),
    FOREIGN KEY (id_linguagem) REFERENCES linguagem(id_linguagem)
);

-- ── Saga x Filme (N:N — um filme pode pertencer a mais de uma saga) ───────────

CREATE TABLE filme_saga (
    id_filme_saga INT PRIMARY KEY AUTO_INCREMENT,
    id_filme      INT NOT NULL,
    id_saga       INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme),
    FOREIGN KEY (id_saga)  REFERENCES saga(id_saga)
);

-- ── Usuário ───────────────────────────────────────────────────────────────────

CREATE TABLE usuario (
    id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL,
    sobrenome       VARCHAR(255),
    apelido         VARCHAR(100) UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    senha           VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    imagem          VARCHAR(500),
    role            ENUM('admin','user') NOT NULL DEFAULT 'user',
    data_criacao    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Favoritos ─────────────────────────────────────────────────────────────────

CREATE TABLE favorito (
    id_favorito  INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario   INT NOT NULL,
    id_filme     INT NOT NULL,
    criado_em    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuario_filme (id_usuario, id_filme),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_filme)   REFERENCES filme(id_filme)
);

-- ── Destaques da Home ─────────────────────────────────────────────────────────

CREATE TABLE destaque_home (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL UNIQUE,
    ordem    INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme)
);

-- ── Blacklist de refresh tokens ───────────────────────────────────────────────

CREATE TABLE refresh_token_blacklist (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(512) NOT NULL UNIQUE,
    criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  DML — dados de exemplo (filmes infantis)
-- ============================================================

-- ── Países (com bandeiras via flagcdn.com) ─────────────────────────────────────
-- id: 1=Estados Unidos, 2=Japão, 3=Reino Unido, 4=França, 5=Austrália,
--     6=Canadá, 7=Alemanha, 8=Itália, 9=Coreia do Sul, 10=Brasil

INSERT INTO pais (nome, img) VALUES
('Estados Unidos', 'https://www.bandeirasnacionais.com/data/flags/w580/us.webp'),   -- 1
('Japão',          'https://www.bandeirasnacionais.com/data/flags/w580/jp.webp'),   -- 2
('Reino Unido',    'https://www.bandeirasnacionais.com/data/flags/w580/gb.webp'),   -- 3
('França',         'https://www.bandeirasnacionais.com/data/flags/w580/fr.webp'),   -- 4
('Austrália',      'https://www.bandeirasnacionais.com/data/flags/w580/au.webp'),   -- 5
('Canadá',         'https://www.bandeirasnacionais.com/data/flags/w580/ca.webp'),   -- 6
('Alemanha',       'https://www.bandeirasnacionais.com/data/flags/w580/de.webp'),   -- 7
('Itália',         'https://www.bandeirasnacionais.com/data/flags/w580/it.webp'),   -- 8
('Coreia do Sul',  'https://www.bandeirasnacionais.com/data/flags/w580/kr.webp'),   -- 9
('Brasil',         'https://www.bandeirasnacionais.com/data/flags/w580/br.webp');   -- 10

-- ── Linguagens (com bandeiras representativas) ─────────────────────────────────
-- id: 1=Inglês, 2=Japonês, 3=Português, 4=Francês, 5=Espanhol,
--     6=Italiano, 7=Coreano, 8=Alemão

INSERT INTO linguagem (nome, img) VALUES
('Inglês',    'https://www.bandeirasnacionais.com/data/flags/w580/us.webp'),   -- 1
('Japonês',   'https://www.bandeirasnacionais.com/data/flags/w580/jp.webp'),   -- 2
('Português', 'https://www.bandeirasnacionais.com/data/flags/w580/br.webp'),   -- 3
('Francês',   'https://www.bandeirasnacionais.com/data/flags/w580/fr.webp'),   -- 4
('Espanhol',  'https://www.bandeirasnacionais.com/data/flags/w580/es.webp'),   -- 5
('Italiano',  'https://www.bandeirasnacionais.com/data/flags/w580/it.webp'),   -- 6
('Coreano',   'https://www.bandeirasnacionais.com/data/flags/w580/kr.webp'),   -- 7
('Alemão',    'https://www.bandeirasnacionais.com/data/flags/w580/de.webp');   -- 8

-- ── Categorias ────────────────────────────────────────────────────────────────
-- id: 1=Animação, 2=Aventura, 3=Comédia, 4=Fantasia, 5=Musical,
--     6=Família, 7=Ficção Científica

INSERT INTO categoria (nome) VALUES
('Animação'),          -- 1
('Aventura'),          -- 2
('Comédia'),           -- 3
('Fantasia'),          -- 4
('Musical'),           -- 5
('Família'),           -- 6
('Ficção Científica'); -- 7

-- ── Produtoras (com logos oficiais) ───────────────────────────────────────────
-- id: 1=Pixar, 2=Disney, 3=DreamWorks Animation, 4=Studio Ghibli,
--     5=Illumination, 6=Blue Sky Studios, 7=Sony Pictures Animation,
--     8=Netflix Animation, 9=Laika, 10=Warner Animation Group

INSERT INTO produtora (nome, img) VALUES
('Pixar Animation Studios',  'https://upload.wikimedia.org/wikipedia/commons/4/40/Pixar_logo.svg'),          -- 1
('Walt Disney Animation',    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Walt_Disney_Pictures_text_logo.svg/250px-Walt_Disney_Pictures_text_logo.svg.png'), -- 2
('DreamWorks Animation',     'https://upload.wikimedia.org/wikipedia/commons/c/c7/DreamWorks_Animation_SKG_logo.svg'), -- 3
('Studio Ghibli',            'https://upload.wikimedia.org/wikipedia/pt/f/f4/Studio_Ghibli_logo.png'), -- 4
('Illumination',             'https://upload.wikimedia.org/wikipedia/commons/e/e3/Illumination_Entertainment_logo.svg'), -- 5
('Blue Sky Studios',         'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Blue_Sky_Studios_2013_logo.svg/3840px-Blue_Sky_Studios_2013_logo.svg.png'), -- 6
('Sony Pictures Animation',  'https://upload.wikimedia.org/wikipedia/commons/8/8c/Sony_Pictures_Animation_2011_logo.svg'), -- 7
('Netflix Animation',        'https://upload.wikimedia.org/wikipedia/commons/6/62/Netflix_Animation_logo.svg'), -- 8
('Laika',                    'https://upload.wikimedia.org/wikipedia/commons/5/58/Laika_logo.svg'), -- 9
('Warner Animation Group',   'https://upload.wikimedia.org/wikipedia/commons/5/51/Warner_Animation_Group_logo.svg'); -- 10

-- ── Sagas ─────────────────────────────────────────────────────────────────────

INSERT INTO saga (nome, descricao) VALUES
('Shrek',           'Franquia de animação da DreamWorks sobre o ogro verde Shrek e seus amigos'),
('Ghibli Miyazaki', 'Filmes de animação dirigidos por Hayao Miyazaki no Studio Ghibli'),
('Divertida Mente', 'Franquia da Pixar que explora as emoções da mente de uma menina chamada Riley'),
('Kung Fu Panda',   'Franquia da DreamWorks sobre o panda Po e sua jornada para se tornar mestre do kung fu'),
('A Era do Gelo',   'Franquia da Blue Sky Studios com os animais pré-históricos Manny, Sid e Diego'),
('Madagascar',      'Franquia da DreamWorks sobre animais do zoológico de Nova York perdidos na natureza'),
('Zootopia',        'Franquia da Disney ambientada em uma cidade habitada por animais antropomórficos'),
('Super Mario',     'Franquia baseada nos jogos Nintendo com Mario e Luigi em mundos fantásticos');

-- ── Diretores ─────────────────────────────────────────────────────────────────
INSERT INTO diretor (nome, sobrenome, img) VALUES
('Pete',      'Docter',    'https://upload.wikimedia.org/wikipedia/commons/f/fd/Pete_Docter_cropped_2009.jpg'),       -- 1
('Andrew',    'Adamson',   'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/35/66/27/19456959.jpg'),       -- 2
('Hayao',     'Miyazaki',  'https://upload.wikimedia.org/wikipedia/commons/f/ff/HayaoMiyazakiCCJuly09.jpg'),         -- 3
('Mark',      'Osborne',   'https://upload.wikimedia.org/wikipedia/commons/f/f4/Mark_Osborne_on_Dulce_Osuna.jpg'),  -- 4
('Carlos',    'Saldanha',  'https://upload.wikimedia.org/wikipedia/commons/d/d6/Carlos_Saldanha_2017.jpg'),          -- 5
('Eric',      'Darnell',   'https://upload.wikimedia.org/wikipedia/commons/f/fe/Eric_Darnell.png'),                  -- 6
('Enrico',    'Casarosa',  'https://upload.wikimedia.org/wikipedia/commons/e/e8/Enrico_Casarosa_2014_%28cropped%29.jpg'), -- 7
('Byron',     'Howard',    'https://upload.wikimedia.org/wikipedia/commons/9/99/Byron_Howard.jpg'),                 -- 8
('Kelsey',    'Mann',      'https://upload.wikimedia.org/wikipedia/commons/2/2c/Kelsey_Mann_-_Inside_Out_2.jpg'),   -- 9
('Aaron',     'Horvath',   'https://upload.wikimedia.org/wikipedia/commons/0/09/Aaron_Horvath_by_Gage_Skidmore.jpg'), -- 10
('Michael',   'Jelenic',   'https://upload.wikimedia.org/wikipedia/commons/7/78/Michael_Jelenic_by_Gage_Skidmore.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original'), -- 11
('Vicky',     'Jenson',    'https://image.tmdb.org/t/p/w500/dDSlofPZbJxtYBO2f73XjNwcFVT.jpg'),                       -- 12
('Rich',      'Moore',     'https://upload.wikimedia.org/wikipedia/commons/1/19/Rich_Moore.jpg'),                   -- 13
('John',      'Stevenson', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/John_Stevenson_%28director%29_%28cropped%29.jpg/250px-John_Stevenson_%28director%29_%28cropped%29.jpg'), -- 14
('Tom',       'McGrath',   'https://upload.wikimedia.org/wikipedia/commons/a/ab/Tom_McGrath_by_Gage_Skidmore.jpg'), -- 15
('Jennifer',  'Lee',       'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Jennifer_Lee.JPG/960px-Jennifer_Lee.JPG'), -- 16
('Chris',     'Buck',      'https://upload.wikimedia.org/wikipedia/commons/3/33/Frozenfeverdirectors_%28cropped%29.JPG'), -- 17
('Nathan',    'Greno',     'https://br.web.img3.acsta.net/c_310_420/img/af/21/af21a887b8bbb6d6f31cd35f293aab3a.jpg'), -- 18
('Don',       'Hall',      'https://static.wikia.nocookie.net/disney/images/4/45/Don_Hall.jpg/revision/latest?cb=20180815233345'), -- 19
('Dean',      'DeBlois',   'https://upload.wikimedia.org/wikipedia/commons/d/db/Dean_DeBlois%2C_2014_WonderCon-3.jpg'); -- 20


-- ── Atores (dubladores originais) ─────────────────────────────────────────────
INSERT INTO ator (nome, sobrenome, nome_personagem, img) VALUES
('Amy',          'Poehler',    'Alegria',          'https://upload.wikimedia.org/wikipedia/commons/f/fd/Amy_Poehler_%288894155873%29_%28cropped%29.jpg'),
('Phyllis',      'Smith',      'Tristeza',         'https://upload.wikimedia.org/wikipedia/commons/2/26/Phyllis_Smith_FOX_2_St.Louis%28cropped%29.jpg'),
('Bill',         'Hader',      'Medo',             'https://upload.wikimedia.org/wikipedia/commons/2/22/Bill_Hader_%2829419489470%29_%28cropped%29.jpg'),
('Maya',         'Hawke',      'Tédio',            'https://upload.wikimedia.org/wikipedia/commons/a/ab/Maya_Hawke_2019_by_Glenn_Francis_%28cropped%29.jpg'),
('Kensington',   'Tallman',    'Riley',            'https://upload.wikimedia.org/wikipedia/commons/8/87/Kensington_Tallman_at_Inside_Out_2_Premiere.jpg'),
('Mike',         'Myers',      'Shrek',            'https://upload.wikimedia.org/wikipedia/commons/3/30/Mike_Myers_2018.jpg'),
('Eddie',        'Murphy',     'Burro',            'https://upload.wikimedia.org/wikipedia/commons/5/53/Eddie_Murphy_by_Gage_Skidmore.jpg'),
('Cameron',      'Diaz',       'Fiona',            'https://upload.wikimedia.org/wikipedia/commons/8/83/Cameron_Diaz_Cannes_2002.jpg'),
('Antonio',      'Banderas',   'Gato de Botas',    'https://upload.wikimedia.org/wikipedia/commons/4/4e/Antonio_Banderas_2019_%28cropped%29.jpg'),
('Jack',         'Black',      'Po',               'https://upload.wikimedia.org/wikipedia/commons/4/48/Jack_Black_2016.jpg'),
('Dustin',       'Hoffman',    'Mestre Shifu',     'https://upload.wikimedia.org/wikipedia/commons/d/df/Dustin_Hoffman_Cannes_2017_2.jpg'),
('Angelina',     'Jolie',      'Tigresa',          'https://upload.wikimedia.org/wikipedia/commons/4/4a/Angelina_Jolie_15_Global_Summit_Forest_Gate_%28cropped%29.jpg'),
('Ray',          'Romano',     'Manny',            'https://upload.wikimedia.org/wikipedia/commons/3/31/Ray_Romano_2015.jpg'),
('John',         'Leguizamo',  'Sid',              'https://upload.wikimedia.org/wikipedia/commons/d/df/John_Leguizamo_2019.jpg'),
('Denis',        'Leary',      'Diego',            'https://upload.wikimedia.org/wikipedia/commons/b/bd/Denis_Leary_2013.jpg'),
('Queen',        'Latifah',    'Ellie',            'https://upload.wikimedia.org/wikipedia/commons/9/91/Queen_Latifah_2018.jpg'),
('Ben',          'Stiller',    'Alex',             'https://upload.wikimedia.org/wikipedia/commons/2/26/Ben_Stiller_2019.jpg'),
('Chris',        'Rock',       'Marty',            'https://upload.wikimedia.org/wikipedia/commons/6/6c/Chris_Rock_2018.jpg'),
('Jacob',        'Tremblay',   'Luca',             'https://upload.wikimedia.org/wikipedia/commons/9/91/Jacob_Tremblay_2019.jpg'),
('Jack Dylan',   'Grazer',     'Alberto',          'https://upload.wikimedia.org/wikipedia/commons/d/d3/Jack_Dylan_Grazer_by_Gage_Skidmore.jpg'),
('Ginnifer',     'Goodwin',    'Judy Hopps',       'https://upload.wikimedia.org/wikipedia/commons/c/cc/Ginnifer_Goodwin_by_Gage_Skidmore_2015.jpg'),
('Jason',        'Bateman',    'Nick Wilde',       'https://upload.wikimedia.org/wikipedia/commons/0/07/Jason_Bateman_2019.jpg'),
('Idris',        'Elba',       'Chefe Bogo',       'https://upload.wikimedia.org/wikipedia/commons/5/53/Idris_Elba_2018.jpg'),
('Chris',        'Pratt',      'Mario',            'https://upload.wikimedia.org/wikipedia/commons/9/99/Chris_Pratt_2018_%28cropped%29.jpg'),
('Charlie',      'Day',        'Luigi',            'https://upload.wikimedia.org/wikipedia/commons/2/2c/Charlie_Day_by_Gage_Skidmore.jpg'),
('Anya Taylor-Joy', '',        'Princesa Peach',   'https://upload.wikimedia.org/wikipedia/commons/0/07/Anya_Taylor-Joy_2024.jpg'),
('Chieko',       'Baishô',     'Sophie',           'https://upload.wikimedia.org/wikipedia/commons/4/4b/Baisho_Chieko_from_%22Where_Spring_Comes_Late%22.jpg'),
('Takuya',       'Kimura',     'Howl',             'https://upload.wikimedia.org/wikipedia/commons/b/be/Takuya_Kimura_2019.jpg'),
('Tom',          'Hanks',      'Woody',            'https://upload.wikimedia.org/wikipedia/commons/a/a9/Tom_Hanks_TIFF_2019.jpg'),
('Tim',          'Allen',      'Buzz Lightyear',   'https://upload.wikimedia.org/wikipedia/commons/b/b8/Tim_Allen_2019.jpg'),
('Annie',        'Potts',      'Bo Peep',          'https://upload.wikimedia.org/wikipedia/commons/b/ba/Annie_Potts_2019.jpg'),
('Joan',         'Cusack',     'Jessie',           'https://upload.wikimedia.org/wikipedia/commons/4/45/Joan_Cusack_2011.jpg'),
('Auliʻi',       'Cravalho',   'Moana',            'https://upload.wikimedia.org/wikipedia/commons/8/87/Auli%CA%BBi_Cravalho_2019.jpg'),
('Dwayne',       'Johnson',    'Maui',             'https://upload.wikimedia.org/wikipedia/commons/1/11/Dwayne_Johnson_2021.jpg'),
('Rachel',       'House',      'Avó Tala',         'https://upload.wikimedia.org/wikipedia/commons/d/d3/Rachel_House_2020.jpg'),
('Mandy',        'Moore',      'Rapunzel',         'https://upload.wikimedia.org/wikipedia/commons/7/75/Mandy_Moore_2019.jpg'),
('Zachary',      'Levi',       'Flynn Rider',      'https://upload.wikimedia.org/wikipedia/commons/d/db/Zachary_Levi_by_Gage_Skidmore_2019.jpg'),
('Kristen',      'Bell',       'Anna',             'https://upload.wikimedia.org/wikipedia/commons/b/b5/Kristen_Bell_2019.jpg'),
('Idina',        'Menzel',     'Elsa',             'https://upload.wikimedia.org/wikipedia/commons/6/62/Idina_Menzel_2019.jpg'),
('Ming-Na',      'Wen',        'Mulan',            'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ming-Na_Wen_by_Gage_Skidmore_2019.jpg'),
('Jackie',       'Chan',       'Mestre Tigre',     'https://upload.wikimedia.org/wikipedia/commons/8/8b/Jackie_Chan_July_2016_cropped.jpg'),
('Luisa',        'Moreno',     'Lupe',             'https://upload.wikimedia.org/wikipedia/commons/1/1c/Scannedpostcardmoreno_%28cropped%29.jpg');


-- ── Filmes (todos infantis, classificação L ou +6) ────────────────────────────

INSERT INTO filme (titulo, id_produtora_principal, id_pais_origem, orcamento, duracao, sinopse, ano, poster, banner, trailer, classificacao, estilo_visual, flag) VALUES

-- 1
('Divertida Mente',
 1, 1, 175000000, '01:35:00',
 'Quando Riley se muda para São Francisco, as emoções que vivem em sua mente — Alegria, Medo, Raiva, Nojinho e Tristeza — lutam para mantê-la feliz enquanto ela enfrenta uma grande mudança em sua vida.',
 2015,
 'https://br.web.img3.acsta.net/c_310_420/pictures/15/05/14/14/20/365361.jpg',
 'https://images4.alphacoders.com/709/thumb-1920-709841.jpg',
 'https://www.youtube.com/embed/yRUAzGQ3nSY',
 'L', '3D', TRUE),

-- 2
('Divertida Mente 2',
 1, 1, 200000000, '01:40:00',
 'Riley entra na adolescência e as emoções originais se veem às voltas com novas chegantes: Ansiedade, Inveja, Tédio e Vergonha, que chegam para complicar tudo.',
 2024,
 'https://br.web.img2.acsta.net/c_310_420/pictures/23/11/09/18/04/2076862.jpg',
 'https://images4.alphacoders.com/136/thumbbig-1368203.webp',
 'https://www.youtube.com/embed/LEjhY15eCx0',
 'L', '3D', FALSE),

-- 3
('Shrek',
 3, 1, 60000000, '01:30:00',
 'Um ogro solitário chamado Shrek embarca em uma aventura para resgatar a Princesa Fiona de uma torre guardada por um dragão, contando com a companhia de um burro falante pelo caminho.',
 2001,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/54/04/20150812.jpg',
 'https://images.alphacoders.com/500/thumbbig-500304.webp',
 'https://www.youtube.com/embed/W37DlG1i61s',
 'L', '3D', TRUE),

-- 4
('Shrek 2',
 3, 1, 150000000, '01:33:00',
 'Shrek e Fiona viajam para o reino Far Far Away para conhecer os pais de Fiona. As coisas se complicam quando o Rei tenta acabar com o relacionamento deles com a ajuda do Gato de Botas.',
 2004,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/97/04/22/20504502.jpg',
 'https://images7.alphacoders.com/127/thumbbig-1274275.webp',
 'https://www.youtube.com/embed/1k9oJMI51LU',
 'L', '3D', TRUE),

-- 5
('Kung Fu Panda',
 3, 1, 130000000, '01:32:00',
 'Po, um panda que sonha em ser um mestre do kung fu, é inesperadamente escolhido para cumprir uma antiga profecia. Com a ajuda dos lendários Furiosos Cinco e do Mestre Shifu, ele precisa defender o Vale da Paz.',
 2008,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/87/83/19/19962001.jpg',
 'https://images8.alphacoders.com/127/thumbbig-1271254.webp',
 'https://www.youtube.com/embed/1HVfHkFGnMU',
 'L', '3D', TRUE),

-- 6
('A Era do Gelo: 3',
 6, 1, 90000000, '01:34:00',
 'Manny, Sid e Diego se aventuram por um mundo subterrâneo repleto de dinossauros para resgatar os ovos que Sid acidentalmente roubou. O excêntrico caçador Buck os guia nessa missão impossível.',
 2009,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/71/90/20109889.jpg',
 'https://images2.alphacoders.com/477/thumb-440-477881.webp',
 'https://www.youtube.com/embed/anM1XfIVemg',
 'L', '3D', TRUE),

-- 7
('Madagascar',
 3, 1, 75000000, '01:26:00',
 'Quatro animais mimados do Zoológico de Nova York — um leão, uma zebra, um hipopótamo e uma girafa — se veem na selva de Madagascar, longe do conforto do zoológico, precisando aprender a sobreviver juntos.',
 2005,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/54/02/20150796.jpg',
 'https://images5.alphacoders.com/480/thumb-440-480674.webp',
 'https://www.youtube.com/embed/7I8fVb8fXD0',
 'L', '3D', TRUE),

-- 8
('Luca',
 1, 1, 65000000, '01:35:00',
 'Luca e seu amigo Alberto são criaturas marinhas que assumem forma humana ao sair da água. Os dois passam um verão incrível em uma cidade italiana ensolarada, mas seu segredo ameaça ser descoberto a qualquer momento.',
 2021,
 'https://br.web.img2.acsta.net/c_310_420/pictures/21/05/07/10/59/3500748.jpg',
 'https://images2.alphacoders.com/113/thumb-440-1132557.webp',
 'https://www.youtube.com/embed/mYfJxlgR2jw',
 'L', '3D', FALSE),

-- 9
('Zootopia',
 2, 1, 150000000, '01:48:00',
 'A detetive novata Judy Hopps e o astuto Nick Wilde se unem para resolver um misterioso caso de animais desaparecidos na moderna cidade de Zootopia, onde predadores e presas convivem em harmonia.',
 2016,
 'https://br.web.img3.acsta.net/c_310_420/pictures/15/12/10/21/01/335612.jpg',
 'https://images2.alphacoders.com/682/thumb-440-682629.webp',
 'https://www.youtube.com/embed/jWM0ct-OLsM',
 'L', '3D', FALSE),

-- 10
('O Castelo Animado',
 4, 2, 24000000, '01:59:00',
 'Sophie tem sua vida transformada quando a malvada Bruxa do Charco a transforma em uma velha de noventa anos. Ela encontra refúgio no castelo andante do misterioso mago Howl e começa uma incrível jornada mágica.',
 2004,
 'https://br.web.img3.acsta.net/c_310_420/pictures/15/03/26/16/44/393405.jpg',
 'https://images7.alphacoders.com/113/thumb-440-1137731.webp',
 'https://www.youtube.com/embed/iwROgK94zcM',
 'L', 'Anime', TRUE),

-- 11
('A Princesa Mononoke',
 4, 2, 20000000, '02:13:00',
 'Ashitaka parte em uma jornada épica para encontrar a cura de uma maldição e se vê no meio de um conflito brutal entre os deuses da floresta e os humanos que destroem a natureza.',
 1997,
 'https://cdng.europosters.eu/pod_public/750/262751.jpg',
 'https://images8.alphacoders.com/644/thumb-440-644874.webp',
 'https://www.youtube.com/embed/4OiMa4kptAE',
 '+6', 'Anime', TRUE),

-- 12
('Toy Story',
 1, 1, 30000000, '01:21:00',
 'Woody, um cowboy de brinquedo, tem sua posição de brinquedo favorito do jovem Andy ameaçada quando o novo e moderno Buzz Lightyear chega. Os dois precisam aprender a se dar bem para escapar de um vizinho perigoso.',
 1995,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/05/36/20127436.jpg',
 'https://images7.alphacoders.com/523/thumb-440-523759.webp',
 'https://www.youtube.com/embed/v-PjgYDrg70',
 'L', '3D', TRUE),

-- 13
('Super Mario: Galaxy',
 5, 1, 100000000, '01:32:00',
 'Mario e Luigi são irmãos encanadores transportados para um mundo mágico. Mario precisa atravessar o Reino dos Cogumelos para salvar seu irmão das garras do malvado Bowser e resgatar a Princesa Peach.',
 2023,
 'https://br.web.img3.acsta.net/c_310_420/img/5b/ea/5bea1aeac3323aeaaf82449a34fafbbf.jpg',
 'https://picfiles.alphacoders.com/657/thumb-800-657268.webp',
 'https://www.youtube.com/embed/quHOQPMdX74',
 'L', '3D', FALSE),

-- 14
('Moana',
 2, 1, 150000000, '01:47:00',
 'Moana, a filha do chefe de sua ilha, parte em uma aventura pelo oceano para salvar seu povo. Ao longo da jornada, ela descobre sua identidade e aprende sobre a coragem necessária para enfrentar o desconhecido.',
 2016,
 'https://br.web.img3.acsta.net/c_310_420/pictures/16/09/12/22/13/415370.jpg',
 'https://images3.alphacoders.com/722/thumb-440-722899.webp',
 'https://www.youtube.com/embed/LKFuXETZUsI',
 'L', '3D', TRUE),

-- 15
('Enrolados',
 2, 1, 260000000, '01:40:00',
 'Rapunzel, uma jovem com longos cabelos mágicos, foge da torre onde foi mantida por uma bruxa e parte em aventura pelo mundo real ao lado de Flynn Rider, um ladrão com um coração surpreendentemente bom.',
 2010,
 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/87/90/91/19962790.jpg',
 'https://images2.alphacoders.com/127/thumb-440-1271358.webp',
 'https://www.youtube.com/embed/TbQm5doF_Uc',
 'L', '3D', TRUE),

-- 16
('Frozen',
 2, 1, 150000000, '01:42:00',
 'Anna parte em busca de sua irmã Elsa, cuja magia de gelo mergulhou o reino de Arendelle em um inverno eterno. Acompanhada pelo lenhador Kristoff e pela rena Sven, ela descobre o verdadeiro significado do amor.',
 2013,
 'https://br.web.img3.acsta.net/c_310_420/pictures/210/461/21046189_20131002174340886.jpg',
 'https://images5.alphacoders.com/491/thumb-440-491291.webp',
 'https://www.youtube.com/embed/TbQm5doF_Uc',
 'L', '3D', TRUE),

-- 17
('Mulan',
 2, 1, 90000000, '01:28:00',
 'Para salvar seu velho pai da guerra, a jovem Mulan se disfarça de homem e vai para o exército em seu lugar. Com coragem e inteligência, ela se prova capaz de enfrentar qualquer desafio.',
 1998,
 'https://br.web.img2.acsta.net/r_1280_720/img/28/50/285078da24bb2229c76a76bea302e447.jpg',
 'https://images2.alphacoders.com/482/thumb-440-482354.webp',
 'https://www.youtube.com/embed/GnKZqJFJGRM',
 'L', '2D', TRUE),

-- 18
('Os Caras Malvados',
 3, 1, 90000000, '01:40:00',
 'Um grupo de vilões notórios tenta se tornar bons para evitar a prisão. Liderados pelo carismático Mr. Wolf, eles empreendem missões que testam sua capacidade de fazer o bem e surpreendem a todos ao redor.',
 2022,
 'https://br.web.img3.acsta.net/c_310_420/pictures/22/03/10/21/58/3973130.jpg',
 'https://artfiles.alphacoders.com/158/thumb-800-158206.webp',
 'https://www.youtube.com/embed/wAUM6RJwNGU',
 'L', '3D', TRUE),

-- 19
('Cara de Um, Focinho de Outro',
 3, 1, 85000000, '01:35:00',
 'Um menino e seu cachorro trocam de corpo misteriosamente e precisam descobrir como reverter a mágica antes que seja tarde demais, vivendo a vida um do outro de formas cada vez mais divertidas e reveladoras.',
 2026,
 'https://br.web.img3.acsta.net/c_310_420/img/47/92/4792740edfeef9efd6152f65743bcc8e.jpg',
 'https://images2.alphacoders.com/139/thumb-440-1398585.webp',
 'https://www.youtube.com/embed/7I8fVb8fXD0',
 'L', '3D', FALSE),

-- 20
('Como Mágica',
 8, 1, 120000000, '01:45:00',
 'Uma jovem descobre que tem poderes mágicos e precisa aprender a controlá-los enquanto enfrenta um vilão que quer roubar a magia de todas as crianças do mundo. Uma história de coragem, amizade e autoconhecimento.',
 2026,
 'https://br.web.img2.acsta.net/c_310_420/img/94/da/94da65ce953293b449c559a20578dcff.jpg',
 'https://occ-0-8407-1001.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABWd4kzkitmsXQ_TonVW2QPSoh1uAwJqJ1mCBTiwxHgfDcNCcMix08jQkTy3D8ktPa0W2GNSiarT3QWsN_2VCCe2BXOvcn-cbqkur.jpg?r=136',
 'https://www.youtube.com/embed/mYfJxlgR2jw',
 'L', '3D', FALSE);

-- ── Relações filme × produtora ─────────────────────────────────────────────────

INSERT INTO filme_produtora (id_filme, id_produtora) VALUES
(1,1),(2,1),(3,3),(4,3),(5,3),(6,6),(7,3),(8,1),(9,2),
(10,4),(11,4),(12,1),(13,5),(14,2),(15,2),(16,2),(17,2),
(18,3),(19,3),(20,8);

-- ── Relações filme × diretor ──────────────────────────────────────────────────

INSERT INTO filme_diretor (id_filme, id_diretor) VALUES
(1,1),(2,9),(3,2),(3,12),(4,2),(5,4),(5,14),(6,5),(7,6),
(7,15),(8,7),(9,8),(9,13),(10,3),(11,3),(12,1),(13,10),
(13,11),(14,19),(15,18),(16,16),(16,17),(17,19),(18,6),
(19,5),(20,16);

-- ── Relações filme × ator ─────────────────────────────────────────────────────

INSERT INTO filme_ator (id_filme, id_ator) VALUES
(1,1),(1,2),(1,3),
(2,1),(2,2),(2,4),(2,5),
(3,6),(3,7),(3,8),
(4,6),(4,7),(4,8),(4,9),
(5,10),(5,11),(5,12),(5,41),
(6,13),(6,14),(6,15),(6,16),
(7,17),(7,18),(7,16),
(8,19),(8,20),
(9,21),(9,22),(9,23),
(10,27),(10,28),
(11,27),
(12,29),(12,30),(12,31),(12,32),
(13,24),(13,25),(13,26),
(14,33),(14,34),(14,35),
(15,36),(15,37),
(16,38),(16,39),
(17,40),(17,41),
(18,10),(18,17),
(19,19),(19,42),
(20,38),(20,29);

-- ── Relações filme × linguagem ────────────────────────────────────────────────

INSERT INTO filme_linguagem (id_filme, id_linguagem) VALUES
(1,1),(1,3),(2,1),(2,3),(3,1),(3,3),(4,1),(4,3),(5,1),(5,3),
(6,1),(6,3),(7,1),(7,3),(8,1),(8,6),(9,1),(9,3),(10,2),(11,2),
(12,1),(12,3),(13,1),(13,3),(14,1),(14,3),(14,5),(15,1),(15,3),
(16,1),(16,3),(17,1),(17,3),(18,1),(18,3),(19,1),(19,3),(20,1),(20,3);

-- ── Relações filme × categoria ────────────────────────────────────────────────

INSERT INTO filme_categoria (id_filme, id_categoria) VALUES
(1,1),(1,2),(1,3),(1,6),(2,1),(2,2),(2,3),(2,6),(3,1),(3,2),(3,3),(3,4),(3,6),
(4,1),(4,2),(4,3),(4,4),(4,6),(5,1),(5,2),(5,3),(5,6),(6,1),(6,2),(6,3),(6,6),
(7,1),(7,2),(7,3),(7,6),(8,1),(8,2),(8,3),(8,4),(8,6),(9,1),(9,2),(9,3),(9,6),
(10,1),(10,4),(10,6),(11,1),(11,2),(11,4),(11,6),(12,1),(12,2),(12,3),(12,6),
(13,1),(13,2),(13,3),(13,4),(13,6),(14,1),(14,2),(14,5),(14,6),
(15,1),(15,2),(15,3),(15,4),(15,6),(16,1),(16,2),(16,4),(16,5),(16,6),
(17,1),(17,2),(17,5),(17,6),(18,1),(18,2),(18,3),(18,6),
(19,1),(19,3),(19,4),(19,6),(20,1),(20,2),(20,4),(20,6);

-- ── Relações filme × país ─────────────────────────────────────────────────────

INSERT INTO filme_pais (id_filme, id_pais) VALUES
(1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(8,8),
(9,1),(10,2),(11,2),(12,1),(13,1),(13,2),(14,1),(15,1),
(16,1),(17,1),(18,1),(19,1),(20,1);

-- ── Relações diretor × país ───────────────────────────────────────────────────

INSERT INTO diretor_pais (id_diretor, id_pais) VALUES
(1,1),(2,1),(3,2),(4,1),(5,10),(6,1),(7,8),(8,1),(9,1),
(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),
(18,1),(19,1),(20,1);

-- ── Relações ator × país ──────────────────────────────────────────────────────

INSERT INTO ator_pais (id_ator, id_pais) VALUES
(1,1),(2,1),(3,1),(4,1),(5,1),(6,3),(7,1),(8,1),(9,1),
(10,3),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),
(18,1),(19,6),(20,1),(21,1),(22,1),(23,3),(24,1),(25,1),
(26,1),(27,2),(28,2),(29,1),(30,1),(31,1),(32,1),(33,1),
(34,1),(35,3),(36,1),(37,1),(38,1),(39,1),(40,1),(41,1),(42,1);

-- ── Relações produtora × país ─────────────────────────────────────────────────

INSERT INTO produtora_pais (id_produtora, id_pais) VALUES
(1,1),(2,1),(3,1),(4,2),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1);

-- ── Sagas dos filmes ──────────────────────────────────────────────────────────

INSERT INTO filme_saga (id_filme, id_saga) VALUES
(3,1),(4,1),(10,2),(11,2),(1,3),(2,3),(5,4),(6,5),(7,6),(9,7),(13,8);

-- ── Destaques da Home ─────────────────────────────────────────────────────────

INSERT INTO destaque_home (id_filme, ordem) VALUES
(2,1),(9,2),(13,3),(3,4),(14,5);

-- ── Usuários de exemplo ───────────────────────────────────────────────────────

INSERT INTO usuario
(nome, sobrenome, apelido, email, senha, data_nascimento, role)
VALUES
(
    'Administrador',
    'HollyWoo',
    'admin',
    'admin@hollywoo.com',
    '$2b$12$bWnVlq18GNcLNumqD6UR7.09XwOpZV5K/w8QAH4s7nV.zsW8Xj1Ry',
    '2000-01-01',
    'admin'
),
(
    'Mary',
    'Maryani Morais',
    'MaryM',
    'mary@gmail.com',
    '$2b$12$coBUO4qHJhaM2nn2oKh6SORumtA3tIg2fl/oPYbQOb/RBbdzNmUMa',
    '2009-08-12',
    'user'
);

-- ============================================================
--  ADIÇÕES — tabela tema, novos filmes (21–32), diretores,
--  atores e todas as relações
--  Nenhum dado original foi alterado
-- ============================================================

-- ── Tabela de temas ───────────────────────────────────────────────────────────

CREATE TABLE tema (
    id_tema  INT PRIMARY KEY AUTO_INCREMENT,
    nome     VARCHAR(100) NOT NULL UNIQUE,
    emoji    VARCHAR(10)
);

CREATE TABLE filme_tema (
    id_filme_tema INT PRIMARY KEY AUTO_INCREMENT,
    id_filme      INT NOT NULL,
    id_tema       INT NOT NULL,
    UNIQUE KEY uq_filme_tema (id_filme, id_tema),
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme),
    FOREIGN KEY (id_tema)  REFERENCES tema(id_tema)
);

INSERT INTO tema (nome, emoji) VALUES
('Dinossauros', '🦕'),   -- 1
('Espaço',      '🚀'),   -- 2
('Super-Heróis','🦸'),   -- 3
('Robôs',       '🤖'),   -- 4
('Animais',     '🐾'),   -- 5
('Princesas',   '👸'),   -- 6
('Magia',       '✨'),   -- 7
('Piratas',     '☠️'),   -- 8
('Família',     '👨‍👩‍👧'),  -- 9
('Carros',      '🚗');   -- 10

-- ── Temas dos filmes existentes (1–20) ───────────────────────────────────────

INSERT INTO filme_tema (id_filme, id_tema) VALUES
(1,9),(2,9),
(3,7),(3,5),(4,7),(4,5),
(5,5),(6,1),(6,5),(7,5),
(8,9),(9,5),
(10,7),(10,9),(11,7),(11,5),
(12,2),(12,9),
(13,7),(13,9),
(14,6),(14,7),(15,6),(15,7),(16,6),(16,7),(17,6),
(18,5),(18,9),(19,5),(19,7),(19,9),(20,7),(20,9);

-- ── Sagas novas ───────────────────────────────────────────────────────────────
-- Sagas existentes terminam em id=8

INSERT INTO saga (nome, descricao) VALUES
('Os Incríveis',              'Franquia da Pixar sobre uma família de super-heróis que tentam viver como pessoas comuns'),          -- 9
('Carros',                    'Franquia da Pixar ambientada em um mundo habitado por carros falantes e conscientes'),               -- 10
('Como Treinar o Seu Dragão', 'Franquia da DreamWorks sobre a amizade entre o jovem viking Soluço e o dragão Banguela'),           -- 11
('Trolls',                    'Franquia da DreamWorks com os coloridos Trolls e suas aventuras musicais'),                          -- 12
('Toy Story',                 'Franquia da Pixar sobre os brinquedos de Andy que ganham vida quando os humanos não estão olhando'); -- 13

-- ── Novos diretores (IDs 21–30) ──────────────────────────────────────────────

INSERT INTO diretor (nome, sobrenome, img) VALUES
('Henry',   'Selick',    'https://upload.wikimedia.org/wikipedia/commons/7/73/Henry_Selick_2009_%28cropped%29.jpg'),                                              -- 21
('Andrew',  'Stanton',   'https://upload.wikimedia.org/wikipedia/commons/a/ae/Andrew_Stanton.jpg'),                                                             -- 22
('Brad',    'Bird',      'https://upload.wikimedia.org/wikipedia/commons/1/15/BRAD_BIRD_2012.jpg'),                                                             -- 23
('John',    'Lasseter',  'https://upload.wikimedia.org/wikipedia/commons/2/23/John_Lasseter_Sonoma_2017.jpg'),                                                  -- 24
('Peter',   'Sohn',      'https://upload.wikimedia.org/wikipedia/commons/b/be/Peter_Sohn.jpg'),                                                                 -- 25
('Ron',     'Clements',  'https://upload.wikimedia.org/wikipedia/commons/c/ce/Ron_Clements_2.jpg'),                                                             -- 26
('Tim',     'Burton',    'https://upload.wikimedia.org/wikipedia/commons/c/c5/Tim_Burton_%287587107898%29.jpg'),                                                -- 27
('Walt',    'Dohrn',     'https://upload.wikimedia.org/wikipedia/commons/2/22/Walt_Dohrn.jpg'),                                                                 -- 28
('Eric',    'Bergeron',  'https://upload.wikimedia.org/wikipedia/commons/3/36/%C3%89ric_Bergeron_dit_Bibo.jpg'),                                                -- 29
('Chris',   'Sanders',   'https://upload.wikimedia.org/wikipedia/commons/8/87/Chris_Sanders_at_the_2024_Toronto_International_Film_Festival_%28cropped%29.jpg'); -- 30


INSERT INTO diretor_pais (id_diretor, id_pais) VALUES
(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(28,1),(29,1),(30,1);

-- ── Novos atores (IDs 43–72) ─────────────────────────────────────────────────

INSERT INTO ator (nome, sobrenome, nome_personagem, img) VALUES
-- Coraline (43-45)
('Dakota',       'Fanning',        'Coraline Jones',      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Dakota_Fanning_2012.jpg/240px-Dakota_Fanning_2012.jpg'),
('Teri',         'Hatcher',        'Mãe / Outra Mãe',     'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Teri_Hatcher_2011.jpg/240px-Teri_Hatcher_2011.jpg'),
('Keith',        'David',          'Gato',                'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Keith_David_2016.jpg/240px-Keith_David_2016.jpg'),
-- WALL-E (46-48)
('Ben',          'Burtt',          'WALL-E',              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
('Elissa',       'Knight',         'EVE',                 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
('Jeff',         'Garlin',         'Capitão',             'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Jeff_Garlin_2012.jpg/240px-Jeff_Garlin_2012.jpg'),
-- Os Incríveis (49-52)
('Craig',        'T. Nelson',      'Bob Parr / Mr. Incrível', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Craig_T._Nelson_2013.jpg/240px-Craig_T._Nelson_2013.jpg'),
('Holly',        'Hunter',         'Helen Parr / Elastigirl', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Holly_Hunter_%282009%29.jpg/240px-Holly_Hunter_%282009%29.jpg'),
('Samuel L.',    'Jackson',        'Frozone',             'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Samuel_L_Jackson_2019.jpg/240px-Samuel_L_Jackson_2019.jpg'),
('Jason',        'Lee',            'Syndrome',            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Jason_Lee_2011.jpg/240px-Jason_Lee_2011.jpg'),
-- Carros (53-55)
('Owen',         'Wilson',         'Relâmpago McQueen',   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Owen_Wilson_2011.jpg/240px-Owen_Wilson_2011.jpg'),
('Paul',         'Newman',         'Doc Hudson',          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Paul_Newman_-_1963.jpg/240px-Paul_Newman_-_1963.jpg'),
('Larry',        'the Cable Guy',  'Mater',               'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
-- O Bom Dinossauro (56-58)
('Raymond',      'Ochoa',          'Arlo',                'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
('Jack',         'McGraw',         'Spot',                'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
('Jeffrey',      'Wright',         'Poppa Henry',         'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jeffrey_Wright_2015.jpg/240px-Jeffrey_Wright_2015.jpg'),
-- Planeta do Tesouro (59-61)
('Joseph',       'Gordon-Levitt',  'Jim Hawkins',         'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Joseph_Gordon-Levitt_2013.jpg/240px-Joseph_Gordon-Levitt_2013.jpg'),
('Brian',        'Murray',         'John Silver',         'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
('Emma',         'Thompson',       'Capitã Amelia',       'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Emma_Thompson_2018.jpg/240px-Emma_Thompson_2018.jpg'),
-- A Noiva Cadáver (62-64)
('Helena Bonham','Carter',         'Emily',               'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Helena_Bonham_Carter_%28Berlin_Film_Festival_2012%29.jpg/240px-Helena_Bonham_Carter_%28Berlin_Film_Festival_2012%29.jpg'),
('Johnny',       'Depp',           'Victor Van Dort',     'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Johnny_Depp_2020.jpg/240px-Johnny_Depp_2020.jpg'),
('Emily',        'Watson',         'Victoria Everglot',   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/240px-No-Image-Placeholder.svg.png'),
-- Trolls 3 (65-67)
('Anna',         'Kendrick',       'Poppy',               'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Anna_Kendrick_2019.jpg/240px-Anna_Kendrick_2019.jpg'),
('Justin',       'Timberlake',     'Branch',              'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Justin_Timberlake_-_Cannes_2013_%28cropped%29.jpg/240px-Justin_Timberlake_-_Cannes_2013_%28cropped%29.jpg'),
('Zooey',        'Deschanel',      'Bridget',             'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zooey_Deschanel_2012.jpg/240px-Zooey_Deschanel_2012.jpg'),
-- O Espanta Tubarões (68-70)
('Will',         'Smith',          'Oscar',               'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Will_Smith_2011.jpg/240px-Will_Smith_2011.jpg'),
('Robert',       'De Niro',        'Don Lino',            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Robert_De_Niro_2011.jpg/240px-Robert_De_Niro_2011.jpg'),
('Renée',        'Zellweger',      'Angie',               'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Rene_Zellweger_at_the_2019_Oscars.jpg/240px-Rene_Zellweger_at_the_2019_Oscars.jpg'),
-- Como Treinar o Seu Dragão (71-72)
('Jay',          'Baruchel',       'Soluço',              'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Jay_Baruchel_2012.jpg/240px-Jay_Baruchel_2012.jpg'),
('Gerard',       'Butler',         'Stoico',              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gerard_Butler_2011_%28cropped%29.jpg/240px-Gerard_Butler_2011_%28cropped%29.jpg');

INSERT INTO ator_pais (id_ator, id_pais) VALUES
(43,1),(44,1),(45,1),
(46,1),(47,1),(48,1),
(49,1),(50,1),(51,1),(52,1),
(53,1),(54,1),(55,1),
(56,1),(57,1),(58,1),
(59,1),(60,3),(61,3),
(62,3),(63,1),(64,3),
(65,1),(66,1),(67,1),
(68,1),(69,1),(70,1),
(71,6),(72,3);

-- ── Novos filmes (IDs 21–32) ─────────────────────────────────────────────────

INSERT INTO filme (titulo, id_produtora_principal, id_pais_origem, orcamento, duracao, sinopse, ano, poster, banner, trailer, classificacao, estilo_visual, flag) VALUES

-- 21
('Coraline e a Porta Secreta',
 9, 1, 60000000, '01:40:00',
 'Coraline descobre uma porta secreta em sua nova casa que leva a um mundo paralelo aparentemente perfeito — com uma "outra mãe" que parece ideal. Mas por trás desse mundo encantador esconde-se um perigo terrível.',
 2009,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/87/79/16/19961587.jpg',
 'https://images3.alphacoders.com/656/thumb-440-65609.webp',
 'https://www.youtube.com/embed/lSfaRmyuCYM',
 '+6', 'Stop Motion', TRUE),

-- 22
('WALL-E',
 1, 1, 180000000, '01:38:00',
 'WALL-E é um robô solitário deixado na Terra para limpar o lixo acumulado pela humanidade. Quando a robô EVE chega em missão de exploração, os dois se apaixonam e embarcam em uma aventura épica pelo espaço.',
 2008,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/31/05/20139182.jpg',
 'https://images6.alphacoders.com/495/thumb-440-495999.webp',
 'https://www.youtube.com/embed/alIq_wG9FNk',
 'L', '3D', TRUE),

-- 23
('Os Incríveis',
 1, 1, 92000000, '01:55:00',
 'Bob Parr, o ex-super-herói Mr. Incrível, vive uma vida comum forçado pela lei que proibiu os super-poderes. Quando uma missão secreta o chama de volta à ação, toda a sua família acaba envolvida no resgate do mundo.',
 2004,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/98/38/20123472.jpg',
 'https://images7.alphacoders.com/696/thumb-440-696832.webp',
 'https://www.youtube.com/embed/2zU4gFCNEqM',
 'L', '3D', TRUE),

-- 24
('Carros',
 1, 1, 120000000, '01:56:00',
 'Relâmpago McQueen é um carro de corrida arrogante que, após um acidente, acaba preso na pequena cidade de Radiator Springs. Lá ele aprende lições valiosas sobre amizade, humildade e o que realmente importa na vida.',
 2006,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/87/77/81/19961449.jpg',
 'https://images8.alphacoders.com/131/thumb-440-1310883.webp',
 'https://www.youtube.com/embed/9yjAMBAnI1E',
 'L', '3D', TRUE),

-- 25
('O Bom Dinossauro',
 1, 1, 175000000, '01:33:00',
 'Em um mundo onde os dinossauros nunca foram extintos, o jovem Arlo acidentalmente acaba longe de casa e precisa fazer uma improvável amizade com um menino humano chamado Spot para encontrar o caminho de volta.',
 2015,
 'https://br.web.img2.acsta.net/c_310_420/pictures/15/10/15/22/24/429658.jpg',
 'https://images7.alphacoders.com/113/thumb-440-1130240.webp',
 'https://www.youtube.com/embed/lMpFbAGZJxE',
 'L', '3D', TRUE),

-- 26
('Planeta do Tesouro',
 2, 1, 140000000, '01:35:00',
 'Jim Hawkins, um jovem rebelde, parte em uma aventura pelo cosmos a bordo de um navio estelar para encontrar o lendário Planeta do Tesouro. Durante a jornada, ele precisa distinguir amigos de traidores.',
 2002,
 'https://br.web.img2.acsta.net/c_310_420/pictures/14/10/10/20/36/282573.jpg',
 'https://images2.alphacoders.com/117/thumb-440-1173356.webp',
 'https://www.youtube.com/embed/HBJ2HaFJAgs',
 'L', '2D', FALSE),

-- 27
('A Noiva Cadáver',
 10, 3, 40000000, '01:17:00',
 'Victor Van Dort pratica seus votos de casamento na floresta e acidentalmente se casa com Emily, uma noiva morta que volta do além. Enquanto tenta retornar ao mundo dos vivos, ele se divide entre dois mundos completamente diferentes.',
 2005,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/33/59/20140728.jpg',
 'https://images5.alphacoders.com/800/thumb-440-800847.webp',
 'https://www.youtube.com/embed/svdaGQgFBsA',
 'L', 'Stop Motion', TRUE),

-- 28
('Trolls 3: Juntos Novamente',
 3, 1, 95000000, '01:32:00',
 'Poppy e Branch descobrem que Branch tem irmãos de banda perdidos — os BroZone — e partem em uma missão para reunir o grupo antes que um vilão poderoso destrua a música para sempre. Uma aventura recheada de música e amizade.',
 2023,
 'https://br.web.img3.acsta.net/c_310_420/pictures/23/06/14/20/35/4946834.png',
 'https://images.alphacoders.com/134/thumb-440-1340910.webp',
 'https://www.youtube.com/embed/Y7pMkHxDfaU',
 'L', '3D', TRUE),

-- 29
('O Espanta Tubarões',
 3, 1, 75000000, '01:30:00',
 'Oscar, um peixe modesto que trabalha em um posto de limpeza no recife, acidentalmente se torna famoso como o "Espanta Tubarões". Para manter a mentira, ele precisa da ajuda improvável de Lenny, um tubarão vegetariano.',
 2004,
 'https://br.web.img3.acsta.net/c_310_420/img/47/76/47762229e7e1c8c27c810b496da5b05c.png',
 'https://images4.alphacoders.com/813/thumb-440-813122.webp',
 'https://www.youtube.com/embed/mHkZ44q3nwc',
 'L', '3D', FALSE),

-- 30
('Kung Fu Panda 2',
 3, 1, 150000000, '01:30:00',
 'Po e os Furiosos Cinco enfrentam o lorde Shen, um pavão com a ambição de conquistar a China com uma arma devastadora. Ao mesmo tempo, Po busca descobrir sua verdadeira origem e encontrar a paz interior.',
 2011,
 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/87/91/51/19962850.jpg',
 'https://images2.alphacoders.com/806/thumb-440-806049.webp',
 'https://www.youtube.com/embed/cLmYyYIDXCM',
 'L', '3D', FALSE),

-- 31
('Como Treinar o Seu Dragão',
 3, 1, 165000000, '01:38:00',
 'Soluço é um jovem viking que não consegue ser o guerreiro que seu pai deseja. Quando captura acidentalmente o lendário dragão Banguela, os dois formam uma improvável amizade que desafia séculos de ódio entre vikings e dragões.',
 2010,
 'https://image.tmdb.org/t/p/original/yfj27wcg80MjSn7Il6iGQ2wkTth.jpg',
 'https://images8.alphacoders.com/138/thumb-440-1383707.webp',
 'https://www.youtube.com/embed/oKiYuIsPxYk',
 'L', '3D', TRUE),

-- 32
('ParaNorman',
 9, 1, 60000000, '01:32:00',
 'Norman é um garoto que consegue ver e falar com os mortos. Quando sua cidade é ameaçada por uma antiga maldição que ressuscita zumbis, só ele pode salvar todos — usando seu dom especial e a ajuda de amigos improváveis.',
 2012,
 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/89/33/44/20039835.jpg',
 'https://images7.alphacoders.com/113/thumb-440-1132667.webp',
 'https://www.youtube.com/embed/TLFmFSRxXCI',
 '+6', 'Stop Motion', FALSE);

-- ── Relações dos novos filmes ─────────────────────────────────────────────────

INSERT INTO filme_produtora (id_filme, id_produtora) VALUES
(21,9),(22,1),(23,1),(24,1),(25,1),(26,2),(27,10),(28,3),(29,3),(30,3),(31,3),(32,9);

INSERT INTO filme_diretor (id_filme, id_diretor) VALUES
(21,21),(22,22),(23,23),(24,24),(25,25),(26,26),(27,27),(28,28),(29,29),(30,4),(31,30),(32,21);

INSERT INTO filme_ator (id_filme, id_ator) VALUES
(21,43),(21,44),(21,45),
(22,46),(22,47),(22,48),
(23,49),(23,50),(23,51),(23,52),
(24,53),(24,54),(24,55),
(25,56),(25,57),(25,58),
(26,59),(26,60),(26,61),
(27,62),(27,63),(27,64),
(28,65),(28,66),(28,67),
(29,68),(29,69),(29,70),
(30,10),(30,11),(30,12),
(31,71),(31,72),
(32,43);

INSERT INTO filme_linguagem (id_filme, id_linguagem) VALUES
(21,1),(21,3),(22,1),(22,3),(23,1),(23,3),(24,1),(24,3),
(25,1),(25,3),(26,1),(26,3),(27,1),(27,3),(28,1),(28,3),
(29,1),(29,3),(30,1),(30,3),(31,1),(31,3),(32,1),(32,3);

-- IDs categoria: 1=Animação, 2=Aventura, 3=Comédia, 4=Fantasia, 5=Musical, 6=Família, 7=Ficção Científica
INSERT INTO filme_categoria (id_filme, id_categoria) VALUES
(21,1),(21,4),(21,6),
(22,1),(22,2),(22,6),(22,7),
(23,1),(23,2),(23,3),(23,6),
(24,1),(24,2),(24,3),(24,6),
(25,1),(25,2),(25,6),
(26,1),(26,2),(26,6),(26,7),
(27,1),(27,4),(27,5),(27,6),
(28,1),(28,3),(28,5),(28,6),
(29,1),(29,3),(29,6),
(30,1),(30,2),(30,3),(30,6),
(31,1),(31,2),(31,4),(31,6),
(32,1),(32,3),(32,4),(32,6);

INSERT INTO filme_pais (id_filme, id_pais) VALUES
(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),
(27,3),(27,1),(28,1),(29,1),(30,1),(31,1),(32,1);

INSERT INTO filme_saga (id_filme, id_saga) VALUES
(23,9),(24,10),(28,12),(30,4),(31,11);

-- Temas: 1=Dinossauros, 2=Espaço, 3=Super-Heróis, 4=Robôs, 5=Animais,
--        6=Princesas, 7=Magia, 8=Piratas, 9=Família, 10=Carros
INSERT INTO filme_tema (id_filme, id_tema) VALUES
(21,7),(21,9),
(22,2),(22,4),(22,9),
(23,3),(23,9),
(24,10),(24,9),
(25,1),(25,5),(25,9),
(26,8),(26,2),(26,9),
(27,7),(27,9),
(28,9),(28,7),
(29,5),(29,9),
(30,5),(30,9),
(31,5),(31,9),
(32,7),(32,9);