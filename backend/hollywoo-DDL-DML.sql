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
    nome             VARCHAR(255) NOT NULL UNIQUE,
    sobrenome        VARCHAR(255) NOT NULL,
    nome_personagem  VARCHAR(255) NOT NULL,
    img              VARCHAR(500) NOT NULL
);

CREATE TABLE diretor (
    id_diretor INT PRIMARY KEY AUTO_INCREMENT,
    nome       VARCHAR(255) NOT NULL UNIQUE,
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
    sinopse                LONGTEXT UNIQUE,
    ano                    INT,
    poster                 VARCHAR(255) UNIQUE,
    banner                 VARCHAR(255) UNIQUE,
    trailer                VARCHAR(255) UNIQUE,
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
('Estados Unidos', 'https://flagcdn.com/w320/us.png'),   -- 1
('Japão',          'https://flagcdn.com/w320/jp.png'),   -- 2
('Reino Unido',    'https://flagcdn.com/w320/gb.png'),   -- 3
('França',         'https://flagcdn.com/w320/fr.png'),   -- 4
('Austrália',      'https://flagcdn.com/w320/au.png'),   -- 5
('Canadá',         'https://flagcdn.com/w320/ca.png'),   -- 6
('Alemanha',       'https://flagcdn.com/w320/de.png'),   -- 7
('Itália',         'https://flagcdn.com/w320/it.png'),   -- 8
('Coreia do Sul',  'https://flagcdn.com/w320/kr.png'),   -- 9
('Brasil',         'https://flagcdn.com/w320/br.png');   -- 10

-- ── Linguagens (com bandeiras representativas) ─────────────────────────────────
-- id: 1=Inglês, 2=Japonês, 3=Português, 4=Francês, 5=Espanhol,
--     6=Italiano, 7=Coreano, 8=Alemão

INSERT INTO linguagem (nome, img) VALUES
('Inglês',    'https://flagcdn.com/w320/gb.png'),   -- 1
('Japonês',   'https://flagcdn.com/w320/jp.png'),   -- 2
('Português', 'https://flagcdn.com/w320/br.png'),   -- 3
('Francês',   'https://flagcdn.com/w320/fr.png'),   -- 4
('Espanhol',  'https://flagcdn.com/w320/es.png'),   -- 5
('Italiano',  'https://flagcdn.com/w320/it.png'),   -- 6
('Coreano',   'https://flagcdn.com/w320/kr.png'),   -- 7
('Alemão',    'https://flagcdn.com/w320/de.png');   -- 8

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
('Pixar Animation Studios',  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Pixar_logo.svg/320px-Pixar_logo.svg.png'),          -- 1
('Walt Disney Animation',    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Disney_wordmark.svg/320px-Disney_wordmark.svg.png'), -- 2
('DreamWorks Animation',     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/DreamWorks_Animation_SKG_logo.svg/320px-DreamWorks_Animation_SKG_logo.svg.png'), -- 3
('Studio Ghibli',            'https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/Studio_Ghibli_logo.svg/320px-Studio_Ghibli_logo.svg.png'), -- 4
('Illumination',             'https://upload.wikimedia.org/wikipedia/commons/thumb/3/thirty/Illumination_logo.svg/320px-Illumination_logo.svg.png'), -- 5
('Blue Sky Studios',         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Blue_Sky_Studios_logo.svg/320px-Blue_Sky_Studios_logo.svg.png'), -- 6
('Sony Pictures Animation',  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sony_Pictures_Animation_logo.svg/320px-Sony_Pictures_Animation_logo.svg.png'), -- 7
('Netflix Animation',        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/320px-Netflix_2015_logo.svg.png'), -- 8
('Laika',                    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Laika_logo.svg/320px-Laika_logo.svg.png'), -- 9
('Warner Animation Group',   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Warner_Bros_logo.svg/320px-Warner_Bros_logo.svg.png'); -- 10

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
('Pete',      'Docter',    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Pete_Docter_%282019%29.jpg/240px-Pete_Docter_%282019%29.jpg'),       -- 1
('Andrew',    'Adamson',   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Andrew_Adamson.jpg/240px-Andrew_Adamson.jpg'),                       -- 2
('Hayao',     'Miyazaki',  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hayao_Miyazaki.jpg/240px-Hayao_Miyazaki.jpg'),                       -- 3
('Mark',      'Osborne',   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Mark_Osborne_Cannes_2015.jpg/240px-Mark_Osborne_Cannes_2015.jpg'),   -- 4
('Carlos',    'Saldanha',  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Carlos_Saldanha.jpg/240px-Carlos_Saldanha.jpg'),                     -- 5
('Eric',      'Darnell',   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Eric_Darnell.jpg/240px-Eric_Darnell.jpg'),                           -- 6
('Enrico',    'Casarosa',  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Enrico_Casarosa.jpg/240px-Enrico_Casarosa.jpg'),                     -- 7
('Byron',     'Howard',    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Byron_Howard_%282016%29.jpg/240px-Byron_Howard_%282016%29.jpg'),      -- 8
('Kelsey',    'Mann',      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Kelsey_Mann_2024.jpg/240px-Kelsey_Mann_2024.jpg'),                   -- 9
('Aaron',     'Horvath',   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Aaron_Horvath.jpg/240px-Aaron_Horvath.jpg'),                         -- 10
('Michael',   'Jelenic',   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Michael_Jelenic.jpg/240px-Michael_Jelenic.jpg'),                     -- 11
('Vicky',     'Jenson',    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Vicky_Jenson.jpg/240px-Vicky_Jenson.jpg'),                           -- 12
('Rich',      'Moore',     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rich_Moore_%282018%29.jpg/240px-Rich_Moore_%282018%29.jpg'),          -- 13
('John',      'Stevenson', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/John_Stevenson.jpg/240px-John_Stevenson.jpg'),                       -- 14
('Tom',       'McGrath',   'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Tom_McGrath.jpg/240px-Tom_McGrath.jpg'),                             -- 15
('Jennifer',  'Lee',       'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Jennifer_Lee_%282019%29.jpg/240px-Jennifer_Lee_%282019%29.jpg'),     -- 16
('Chris',     'Buck',      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Chris_Buck_%282019%29.jpg/240px-Chris_Buck_%282019%29.jpg'),         -- 17
('Nathan',    'Greno',     'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Nathan_Greno.jpg/240px-Nathan_Greno.jpg'),                           -- 18
('Don',       'Hall',      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Don_Hall_%282018%29.jpg/240px-Don_Hall_%282018%29.jpg'),             -- 19
('Dean',      'DeBlois',   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Dean_DeBlois_%282019%29.jpg/240px-Dean_DeBlois_%282019%29.jpg');     -- 20

-- ── Atores (dubladores originais) ─────────────────────────────────────────────

INSERT INTO ator (nome, sobrenome, nome_personagem, img) VALUES
('Amy',          'Poehler',    'Alegria',          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Amy_Poehler_2011.jpg/240px-Amy_Poehler_2011.jpg'),
('Phyllis',      'Smith',      'Tristeza',         'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Phyllis_Smith_2015.jpg/240px-Phyllis_Smith_2015.jpg'),
('Bill',         'Hader',      'Medo',             'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bill_Hader_2014.jpg/240px-Bill_Hader_2014.jpg'),
('Maya',         'Hawke',      'Tédio',            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Maya_Hawke_%282022%29.jpg/240px-Maya_Hawke_%282022%29.jpg'),
('Kensington',   'Tallman',    'Riley',            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kensington_Tallman.jpg/240px-Kensington_Tallman.jpg'),
('Mike',         'Myers',      'Shrek',            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Mike_Myers_%28actor%29.jpg/240px-Mike_Myers_%28actor%29.jpg'),
('Eddie',        'Murphy',     'Burro',             'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eddie_Murphy_2012.jpg/240px-Eddie_Murphy_2012.jpg'),
('Cameron',      'Diaz',       'Fiona',            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cameron_diaz_%283%29.jpg/240px-Cameron_diaz_%283%29.jpg'),
('Antonio',      'Banderas',   'Gato de Botas',    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Antonio_Banderas.jpg/240px-Antonio_Banderas.jpg'),
('Jack',         'Black',      'Po',               'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Jack_Black_2018.jpg/240px-Jack_Black_2018.jpg'),
('Dustin',       'Hoffman',    'Mestre Shifu',     'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Dustin_Hoffman_2012.jpg/240px-Dustin_Hoffman_2012.jpg'),
('Angelina',     'Jolie',      'Tigresa',          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Angelina_Jolie_2_June_2014_%28cropped%29.jpg/240px-Angelina_Jolie_2_June_2014_%28cropped%29.jpg'),
('Ray',          'Romano',     'Manny',            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Ray_Romano_2012.jpg/240px-Ray_Romano_2012.jpg'),
('John',         'Leguizamo',  'Sid',              'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/John_Leguizamo_2014.jpg/240px-John_Leguizamo_2014.jpg'),
('Denis',        'Leary',      'Diego',            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Denis_Leary_2011.jpg/240px-Denis_Leary_2011.jpg'),
('Queen',        'Latifah',    'Ellie',            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Queen_Latifah_2014.jpg/240px-Queen_Latifah_2014.jpg'),
('Ben',          'Stiller',    'Alex',             'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ben_Stiller_2011.jpg/240px-Ben_Stiller_2011.jpg'),
('Chris',        'Rock',       'Marty',            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Chris_Rock_2023.jpg/240px-Chris_Rock_2023.jpg'),
('Jacob',        'Tremblay',   'Luca',             'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jacob_Tremblay_%282016%29.jpg/240px-Jacob_Tremblay_%282016%29.jpg'),
('Jack Dylan',   'Grazer',     'Alberto',          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Jack_Dylan_Grazer_2019.jpg/240px-Jack_Dylan_Grazer_2019.jpg'),
('Ginnifer',     'Goodwin',    'Judy Hopps',       'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ginnifer_Goodwin_2012.jpg/240px-Ginnifer_Goodwin_2012.jpg'),
('Jason',        'Bateman',    'Nick Wilde',       'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Jason_Bateman_2013.jpg/240px-Jason_Bateman_2013.jpg'),
('Idris',        'Elba',       'Chefe Bogo',       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Idris_Elba-4484_%28cropped%29.jpg/240px-Idris_Elba-4484_%28cropped%29.jpg'),
('Chris',        'Pratt',      'Mario',            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chris_Pratt_2019.jpg/240px-Chris_Pratt_2019.jpg'),
('Charlie',      'Day',        'Luigi',            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Charlie_Day.jpg/240px-Charlie_Day.jpg'),
('Anya Taylor-Joy', '',        'Princesa Peach',   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Anya_Taylor-Joy_at_2022_Toronto_International_Film_Festival_%28cropped%29.jpg/240px-Anya_Taylor-Joy_at_2022_Toronto_International_Film_Festival_%28cropped%29.jpg'),
('Chieko',       'Baishô',     'Sophie',           'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Chieko_Baish%C3%B4.jpg/240px-Chieko_Baish%C3%B4.jpg'),
('Takuya',       'Kimura',     'Howl',             'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Takuya_Kimura_2009.jpg/240px-Takuya_Kimura_2009.jpg'),
('Tom',          'Hanks',      'Woody',            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_2014.jpg/240px-Tom_Hanks_2014.jpg'),
('Tim',          'Allen',      'Buzz Lightyear',   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Tim_Allen_2012.jpg/240px-Tim_Allen_2012.jpg'),
('Annie',        'Potts',      'Bo Peep',          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Annie_Potts_2014.jpg/240px-Annie_Potts_2014.jpg'),
('Joan',         'Cusack',     'Jessie',           'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Joan_Cusack_2012.jpg/240px-Joan_Cusack_2012.jpg'),
('Auliʻi',       'Cravalho',   'Moana',            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Auli%27i_Cravalho_2016.jpg/240px-Auli%27i_Cravalho_2016.jpg'),
('Dwayne',       'Johnson',    'Maui',             'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/240px-Dwayne_Johnson_2014_%28cropped%29.jpg'),
('Rachel',       'House',      'Avó Tala',         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Rachel_House_2016.jpg/240px-Rachel_House_2016.jpg'),
('Mandy',        'Moore',      'Rapunzel',         'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Mandy_Moore_2013.jpg/240px-Mandy_Moore_2013.jpg'),
('Zachary',      'Levi',       'Flynn Rider',      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Zachary_Levi_2019.jpg/240px-Zachary_Levi_2019.jpg'),
('Kristen',      'Bell',       'Anna',             'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Kristen_Bell_2016.jpg/240px-Kristen_Bell_2016.jpg'),
('Idina',        'Menzel',     'Elsa',             'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Idina_Menzel_2013.jpg/240px-Idina_Menzel_2013.jpg'),
('Ming-Na',      'Wen',        'Mulan',            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ming-Na_Wen_2019.jpg/240px-Ming-Na_Wen_2019.jpg'),
('Jackie',       'Chan',       'Mestre Tigre',     'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jackie_Chan_2016.jpg/240px-Jackie_Chan_2016.jpg'),
('Luisa',        'Moreno',     'Lupe',             'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Placeholder_female_superstar.jpg/240px-Placeholder_female_superstar.jpg');

-- ── Filmes (todos infantis, classificação L ou +6) ────────────────────────────

INSERT INTO filme (titulo, id_produtora_principal, id_pais_origem, orcamento, duracao, sinopse, ano, poster, banner, trailer, classificacao, estilo_visual, flag) VALUES

-- 1
('Divertida Mente',
 1, 1, 175000000, '01:35:00',
 'Quando Riley se muda para São Francisco, as emoções que vivem em sua mente — Alegria, Medo, Raiva, Nojinho e Tristeza — lutam para mantê-la feliz enquanto ela enfrenta uma grande mudança em sua vida.',
 2015,
 'https://m.media-amazon.com/images/I/81IwXJGQ8aL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp1917849.jpg',
 'https://www.youtube.com/embed/yRUAzGQ3nSY',
 'L', '3D', TRUE),

-- 2
('Divertida Mente 2',
 1, 1, 200000000, '01:40:00',
 'Riley entra na adolescência e as emoções originais se veem às voltas com novas chegantes: Ansiedade, Inveja, Tédio e Vergonha, que chegam para complicar tudo.',
 2024,
 'https://m.media-amazon.com/images/I/81VBbMsKwIL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp12879628.jpg',
 'https://www.youtube.com/embed/LEjhY15eCx0',
 'L', '3D', FALSE),

-- 3
('Shrek',
 3, 1, 60000000, '01:30:00',
 'Um ogro solitário chamado Shrek embarca em uma aventura para resgatar a Princesa Fiona de uma torre guardada por um dragão, contando com a companhia de um burro falante pelo caminho.',
 2001,
 'https://m.media-amazon.com/images/I/81V4Kk-GG7L._AC_SL1200_.jpg',
 'https://wallpapercave.com/wp/wp2064749.jpg',
 'https://www.youtube.com/embed/W37DlG1i61s',
 'L', '3D', TRUE),

-- 4
('Shrek 2',
 3, 1, 150000000, '01:33:00',
 'Shrek e Fiona viajam para o reino Far Far Away para conhecer os pais de Fiona. As coisas se complicam quando o Rei tenta acabar com o relacionamento deles com a ajuda do Gato de Botas.',
 2004,
 'https://m.media-amazon.com/images/I/71p9LxHBooL._AC_SL1024_.jpg',
 'https://wallpapercave.com/wp/wp2064749.jpg',
 'https://www.youtube.com/embed/1k9oJMI51LU',
 'L', '3D', TRUE),

-- 5
('Kung Fu Panda',
 3, 1, 130000000, '01:32:00',
 'Po, um panda que sonha em ser um mestre do kung fu, é inesperadamente escolhido para cumprir uma antiga profecia. Com a ajuda dos lendários Furiosos Cinco e do Mestre Shifu, ele precisa defender o Vale da Paz.',
 2008,
 'https://m.media-amazon.com/images/I/714CZx8YXIL._AC_SL1200_.jpg',
 'https://wallpapercave.com/wp/wp2139254.jpg',
 'https://www.youtube.com/embed/1HVfHkFGnMU',
 'L', '3D', TRUE),

-- 6
('A Era do Gelo: 3',
 6, 1, 90000000, '01:34:00',
 'Manny, Sid e Diego se aventuram por um mundo subterrâneo repleto de dinossauros para resgatar os ovos que Sid acidentalmente roubou. O excêntrico caçador Buck os guia nessa missão impossível.',
 2009,
 'https://m.media-amazon.com/images/I/71AkyV+f-TL._AC_SL1200_.jpg',
 'https://wallpapercave.com/wp/wp1917845.jpg',
 'https://www.youtube.com/embed/anM1XfIVemg',
 'L', '3D', TRUE),

-- 7
('Madagascar',
 3, 1, 75000000, '01:26:00',
 'Quatro animais mimados do Zoológico de Nova York — um leão, uma zebra, um hipopótamo e uma girafa — se veem na selva de Madagascar, longe do conforto do zoológico, precisando aprender a sobreviver juntos.',
 2005,
 'https://m.media-amazon.com/images/I/714R26BVXKL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp2002267.jpg',
 'https://www.youtube.com/embed/7I8fVb8fXD0',
 'L', '3D', TRUE),

-- 8
('Luca',
 1, 1, 65000000, '01:35:00',
 'Luca e seu amigo Alberto são criaturas marinhas que assumem forma humana ao sair da água. Os dois passam um verão incrível em uma cidade italiana ensolarada, mas seu segredo ameaça ser descoberto a qualquer momento.',
 2021,
 'https://m.media-amazon.com/images/I/91U62E6+WbL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp8832768.jpg',
 'https://www.youtube.com/embed/mYfJxlgR2jw',
 'L', '3D', FALSE),

-- 9
('Zootopia',
 2, 1, 150000000, '01:48:00',
 'A detetive novata Judy Hopps e o astuto Nick Wilde se unem para resolver um misterioso caso de animais desaparecidos na moderna cidade de Zootopia, onde predadores e presas convivem em harmonia.',
 2016,
 'https://m.media-amazon.com/images/I/71kT9R7GG5L._AC_SL1024_.jpg',
 'https://wallpapercave.com/wp/wp1917851.jpg',
 'https://www.youtube.com/embed/jWM0ct-OLsM',
 'L', '3D', FALSE),

-- 10
('O Castelo Animado',
 4, 2, 24000000, '01:59:00',
 'Sophie tem sua vida transformada quando a malvada Bruxa do Charco a transforma em uma velha de noventa anos. Ela encontra refúgio no castelo andante do misterioso mago Howl e começa uma incrível jornada mágica.',
 2004,
 'https://i.pinimg.com/474x/ec/f5/96/ecf596b4b836dba11873a07b12381088.jpg',
 'https://wallpapercave.com/wp/wp1917846.jpg',
 'https://www.youtube.com/embed/iwROgK94zcM',
 'L', 'Anime', TRUE),

-- 11
('A Princesa Mononoke',
 4, 2, 20000000, '02:13:00',
 'Ashitaka parte em uma jornada épica para encontrar a cura de uma maldição e se vê no meio de um conflito brutal entre os deuses da floresta e os humanos que destroem a natureza.',
 1997,
 'https://i0.wp.com/studioghibli.com.br/wp-content/uploads/2025/03/Poster-Princesa-Mononoke-IMAX-scaled.jpeg',
 'https://wallpapercave.com/wp/wp3395261.jpg',
 'https://www.youtube.com/embed/4OiMa4kptAE',
 '+6', 'Anime', TRUE),

-- 12
('Toy Story',
 1, 1, 30000000, '01:21:00',
 'Woody, um cowboy de brinquedo, tem sua posição de brinquedo favorito do jovem Andy ameaçada quando o novo e moderno Buzz Lightyear chega. Os dois precisam aprender a se dar bem para escapar de um vizinho perigoso.',
 1995,
 'https://m.media-amazon.com/images/I/81xPGtM6tKL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp1878416.jpg',
 'https://www.youtube.com/embed/v-PjgYDrg70',
 'L', '3D', TRUE),

-- 13
('Super Mario: Galaxy',
 5, 1, 100000000, '01:32:00',
 'Mario e Luigi são irmãos encanadores transportados para um mundo mágico. Mario precisa atravessar o Reino dos Cogumelos para salvar seu irmão das garras do malvado Bowser e resgatar a Princesa Peach.',
 2023,
 'https://m.media-amazon.com/images/I/71SqkgZzXDL._AC_SL1024_.jpg',
 'https://wallpapercave.com/wp/wp11705534.jpg',
 'https://www.youtube.com/embed/quHOQPMdX74',
 'L', '3D', FALSE),

-- 14
('Moana',
 2, 1, 150000000, '01:47:00',
 'Moana, a filha do chefe de sua ilha, parte em uma aventura pelo oceano para salvar seu povo. Ao longo da jornada, ela descobre sua identidade e aprende sobre a coragem necessária para enfrentar o desconhecido.',
 2016,
 'https://m.media-amazon.com/images/I/91hkMgTnEBL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp2197428.jpg',
 'https://www.youtube.com/embed/LKFuXETZUsI',
 'L', '3D', TRUE),

-- 15
('Enrolados',
 2, 1, 260000000, '01:40:00',
 'Rapunzel, uma jovem com longos cabelos mágicos, foge da torre onde foi mantida por uma bruxa e parte em aventura pelo mundo real ao lado de Flynn Rider, um ladrão com um coração surpreendentemente bom.',
 2010,
 'https://m.media-amazon.com/images/I/81CuvqjFmCL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp2006534.jpg',
 'https://www.youtube.com/embed/TbQm5doF_Uc',
 'L', '3D', TRUE),

-- 16
('Frozen',
 2, 1, 150000000, '01:42:00',
 'Anna parte em busca de sua irmã Elsa, cuja magia de gelo mergulhou o reino de Arendelle em um inverno eterno. Acompanhada pelo lenhador Kristoff e pela rena Sven, ela descobre o verdadeiro significado do amor.',
 2013,
 'https://m.media-amazon.com/images/I/81P6HDPQTBL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp2006533.jpg',
 'https://www.youtube.com/embed/TbQm5doF_Uc',
 'L', '3D', TRUE),

-- 17
('Mulan',
 2, 1, 90000000, '01:28:00',
 'Para salvar seu velho pai da guerra, a jovem Mulan se disfarça de homem e vai para o exército em seu lugar. Com coragem e inteligência, ela se prova capaz de enfrentar qualquer desafio.',
 1998,
 'https://m.media-amazon.com/images/I/71RQzGVJJyL._AC_SL1200_.jpg',
 'https://wallpapercave.com/wp/wp2006531.jpg',
 'https://www.youtube.com/embed/GnKZqJFJGRM',
 'L', '2D', TRUE),

-- 18
('Os Caras Malvados',
 3, 1, 90000000, '01:40:00',
 'Um grupo de vilões notórios tenta se tornar bons para evitar a prisão. Liderados pelo carismático Mr. Wolf, eles empreendem missões que testam sua capacidade de fazer o bem e surpreendem a todos ao redor.',
 2022,
 'https://ingresso-a.akamaihd.net/prd/img/movie/pecadores/7f6c9699-002e-43a8-adb3-49d2055014fd.webp',
 'https://wallpapercave.com/wp/wp11705534.jpg',
 'https://www.youtube.com/embed/wAUM6RJwNGU',
 'L', '3D', FALSE),

-- 19
('Cara de Um, Focinho de Outro',
 3, 1, 85000000, '01:35:00',
 'Um menino e seu cachorro trocam de corpo misteriosamente e precisam descobrir como reverter a mágica antes que seja tarde demais, vivendo a vida um do outro de formas cada vez mais divertidas e reveladoras.',
 2026,
 'https://ingresso-a.akamaihd.net/b2b/production/uploads/articles-content/8923869c-f8a6-4258-ba74-4170bf7fb202.jpg',
 'https://wallpapercave.com/wp/wp2002267.jpg',
 'https://www.youtube.com/embed/7I8fVb8fXD0',
 'L', '3D', FALSE),

-- 20
('Como Mágica',
 8, 1, 120000000, '01:45:00',
 'Uma jovem descobre que tem poderes mágicos e precisa aprender a controlá-los enquanto enfrenta um vilão que quer roubar a magia de todas as crianças do mundo. Uma história de coragem, amizade e autoconhecimento.',
 2026,
 'https://m.media-amazon.com/images/I/81FkRi6+7TL._AC_SL1500_.jpg',
 'https://wallpapercave.com/wp/wp8832768.jpg',
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

INSERT INTO usuario (nome, sobrenome, apelido, email, senha, data_nascimento, role) VALUES
('Administrador', 'HollyWoo', 'admin',
 'admin@hollywoo.com',
 '$2b$12$LQv3c1yqBwEHF0Wy9T1XCOhXBg4xHUK0e2pGEJGThAZcFWiFuTNbu',
 '2000-01-01', 'admin'),
('Ana', 'Clara Silva', 'AnaClara',
 'ana.clara@gmail.com',
 '$2b$12$92IXUNpkjO8FVzDHx9LzNO4tO4V2c3PkW1CqYXWq5HE6HVKpHJTJa',
 '2009-08-12', 'user');
