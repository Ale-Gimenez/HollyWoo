"""
seed.py — Popula o banco de dados do HollyWoo com dados iniciais.

Uso (rode na pasta backend/, com o venv ativado):
    python seed.py
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from app.core.database import SessionLocal
from app.core.security import hash_password   # usa o mesmo hash do sistema
from app.models.models import (
    Pais, Linguagem, Categoria, Produtora,
    Ator, Diretor, AtorPais, DiretorPais,
    Filme, FilmePais, FilmeCategoria, FilmeAtor,
    FilmeDiretor, FilmeLinguagem, FilmeProdutora,
    DestaqueHome, Usuario,
)

db = SessionLocal()

def bulk_insert(objects):
    db.add_all(objects)
    db.flush()   # gera os IDs sem commitar ainda

print("🌱 Iniciando seed...")

# ─── Países ───────────────────────────────────────────────────────────────────
paises_data = [
    "Estados Unidos", "Japão", "Reino Unido", "França", "Alemanha",
    "Canadá", "Austrália", "Itália", "Espanha", "Brasil",
]
paises = {n: Pais(nome=n) for n in paises_data}
bulk_insert(list(paises.values()))
print(f"  ✓ {len(paises)} países")

# ─── Linguagens ───────────────────────────────────────────────────────────────
linguagens_data = ["Inglês", "Japonês", "Francês", "Alemão", "Espanhol", "Português", "Italiano"]
linguagens = {n: Linguagem(nome=n) for n in linguagens_data}
bulk_insert(list(linguagens.values()))
print(f"  ✓ {len(linguagens)} linguagens")

# ─── Categorias ───────────────────────────────────────────────────────────────
categorias_data = [
    "Animação", "Aventura", "Comédia", "Drama", "Fantasia",
    "Musical", "Família", "Mistério", "Ação", "Romance",
]
categorias = {n: Categoria(nome=n) for n in categorias_data}
bulk_insert(list(categorias.values()))
print(f"  ✓ {len(categorias)} categorias")

# ─── Produtoras ───────────────────────────────────────────────────────────────
produtoras_data = [
    "Walt Disney Pictures", "Pixar Animation Studios", "DreamWorks Animation",
    "Studio Ghibli", "Universal Pictures", "Warner Bros. Animation",
    "Sony Pictures Animation", "Illumination Entertainment",
]
produtoras = {n: Produtora(nome=n) for n in produtoras_data}
bulk_insert(list(produtoras.values()))
print(f"  ✓ {len(produtoras)} produtoras")

# ─── Diretores ────────────────────────────────────────────────────────────────
diretores_data = [
    ("John",    "Lasseter",   "Estados Unidos"),
    ("Pete",    "Docter",     "Estados Unidos"),
    ("Andrew",  "Stanton",    "Estados Unidos"),
    ("Hayao",   "Miyazaki",   "Japão"),
    ("Chris",   "Buck",       "Estados Unidos"),
    ("Jennifer","Lee",        "Estados Unidos"),
    ("Brad",    "Bird",       "Estados Unidos"),
    ("Lee",     "Unkrich",    "Estados Unidos"),
]
diretores = {}
for nome, sobrenome, pais_nome in diretores_data:
    d = Diretor(nome=nome, sobrenome=sobrenome)
    db.add(d)
    db.flush()
    db.add(DiretorPais(id_diretor=d.id_diretor, id_pais=paises[pais_nome].id_pais))
    diretores[f"{nome} {sobrenome}"] = d
print(f"  ✓ {len(diretores)} diretores")

# ─── Atores ───────────────────────────────────────────────────────────────────
atores_data = [
    ("Tom",    "Hanks",      "Estados Unidos"),
    ("Tim",    "Allen",      "Estados Unidos"),
    ("Ellen",  "DeGeneres",  "Estados Unidos"),
    ("Albert", "Brooks",     "Estados Unidos"),
    ("Mike",   "Myers",      "Canadá"),
    ("Eddie",  "Murphy",     "Estados Unidos"),
    ("Idina",  "Menzel",     "Estados Unidos"),
    ("Kristen","Bell",       "Estados Unidos"),
    ("Antonio","Banderas",   "Espanha"),
    ("Cate",   "Blanchett",  "Austrália"),
]
atores = {}
for nome, sobrenome, pais_nome in atores_data:
    a = Ator(nome=nome, sobrenome=sobrenome)
    db.add(a)
    db.flush()
    db.add(AtorPais(id_ator=a.id_ator, id_pais=paises[pais_nome].id_pais))
    atores[f"{nome} {sobrenome}"] = a
print(f"  ✓ {len(atores)} atores")

# ─── Filmes ───────────────────────────────────────────────────────────────────
# Cada entrada: (titulo, ano, sinopse, classificacao, produtora, pais_origem,
#                categorias[], linguagens[], diretores[], atores[], poster, banner, trailer)
filmes_data = [
    {
        "titulo": "Toy Story",
        "ano": 1995,
        "sinopse": "Woody, um cowboy brinquedo, vê sua posição de brinquedo favorito ameaçada pela chegada do astronauta Buzz Lightyear. Juntos terão de superar suas diferenças para escapar de um menino problemático.",
        "classificacao": "Livre",
        "produtora": "Pixar Animation Studios",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Aventura", "Comédia", "Família"],
        "linguagens": ["Inglês"],
        "diretores": ["John Lasseter"],
        "atores": ["Tom Hanks", "Tim Allen"],
        "poster": "https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg",
        "banner": "https://images.alphacoders.com/668/668866.jpg",
        "trailer": "https://www.youtube.com/watch?v=KYz2wyBy3kc",
        "flag": True,
    },
    {
        "titulo": "Procurando Nemo",
        "ano": 2003,
        "sinopse": "Nemo, um peixe-palhaço, é capturado e levado a um aquário em Sydney. Seu pai Marlin atravessa o oceano para encontrá-lo, fazendo amizade com Dory, uma peixinha com problemas de memória.",
        "classificacao": "Livre",
        "produtora": "Pixar Animation Studios",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Aventura", "Família", "Comédia"],
        "linguagens": ["Inglês"],
        "diretores": ["Andrew Stanton"],
        "atores": ["Albert Brooks", "Ellen DeGeneres"],
        "poster": "https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg",
        "banner": "https://images4.alphacoders.com/467/46761.jpg",
        "trailer": "https://www.youtube.com/watch?v=2zLkEBHDjGM",
        "flag": True,
    },
    {
        "titulo": "A Viagem de Chihiro",
        "ano": 2001,
        "sinopse": "Chihiro, uma menina de 10 anos, se perde num mundo mágico após seus pais serem transformados em porcos. Ela precisa trabalhar numa casa de banhos para espíritos e encontrar uma forma de salvar sua família.",
        "classificacao": "Livre",
        "produtora": "Studio Ghibli",
        "pais_origem": "Japão",
        "categorias": ["Animação", "Fantasia", "Aventura", "Família"],
        "linguagens": ["Japonês"],
        "diretores": ["Hayao Miyazaki"],
        "atores": [],
        "poster": "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
        "banner": "https://images8.alphacoders.com/878/878486.jpg",
        "trailer": "https://www.youtube.com/watch?v=ByXuk9QqQkk",
        "flag": True,
    },
    {
        "titulo": "Shrek",
        "ano": 2001,
        "sinopse": "Um ogro solitário chamado Shrek tem seu pântano invadido por criaturas de conto de fadas expulsas por Lord Farquaad. Para recuperar sua casa, ele parte numa aventura para resgatar uma princesa.",
        "classificacao": "Livre",
        "produtora": "DreamWorks Animation",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Comédia", "Aventura", "Família"],
        "linguagens": ["Inglês"],
        "diretores": ["Andrew Stanton"],
        "atores": ["Mike Myers", "Eddie Murphy", "Antonio Banderas"],
        "poster": "https://upload.wikimedia.org/wikipedia/en/7/7b/Shrek_%282001_animated_feature_film%29.jpg",
        "banner": "https://images.alphacoders.com/109/1099104.jpg",
        "trailer": "https://www.youtube.com/watch?v=W37DlG1i61s",
        "flag": True,
    },
    {
        "titulo": "Frozen",
        "ano": 2013,
        "sinopse": "A corajosa Anna parte numa épica jornada junto ao excêntrico Kristoff e sua rena Sven para encontrar sua irmã Elsa, cujos poderes de gelo aprisionaram o reino de Arendelle num inverno eterno.",
        "classificacao": "Livre",
        "produtora": "Walt Disney Pictures",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Musical", "Aventura", "Fantasia", "Família"],
        "linguagens": ["Inglês"],
        "diretores": ["Chris Buck", "Jennifer Lee"],
        "atores": ["Idina Menzel", "Kristen Bell"],
        "poster": "https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg",
        "banner": "https://images.alphacoders.com/457/457892.jpg",
        "trailer": "https://www.youtube.com/watch?v=TbQm5doF_Uc",
        "flag": True,
    },
    {
        "titulo": "Ratatouille",
        "ano": 2007,
        "sinopse": "Remy é um rato com um talento extraordinário para a culinária e sonha em se tornar chef. Em Paris, ele faz amizade com Linguini, um jovem desajeitado, e juntos tentam realizar seus sonhos na cozinha do famoso restaurante Gusteau's.",
        "classificacao": "Livre",
        "produtora": "Pixar Animation Studios",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Comédia", "Família", "Aventura"],
        "linguagens": ["Inglês", "Francês"],
        "diretores": ["Brad Bird"],
        "atores": ["Cate Blanchett"],
        "poster": "https://upload.wikimedia.org/wikipedia/en/5/50/RatatouillePoster.jpg",
        "banner": "https://images2.alphacoders.com/871/87173.jpg",
        "trailer": "https://www.youtube.com/watch?v=NgsQ8mVkN8w",
        "flag": True,
    },
    {
        "titulo": "Up — Altas Aventuras",
        "ano": 2009,
        "sinopse": "Carl, um senhor viúvo de 78 anos, decide realizar o sonho de sua esposa falecida e voa com sua casa usando milhares de balões coloridos. Sem querer leva junto Russell, um escoteiro animado.",
        "classificacao": "Livre",
        "produtora": "Pixar Animation Studios",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Aventura", "Comédia", "Drama", "Família"],
        "linguagens": ["Inglês"],
        "diretores": ["Pete Docter"],
        "atores": ["Edward Asner"],
        "poster": "https://upload.wikimedia.org/wikipedia/en/0/05/Up_%282009_film%29.jpg",
        "banner": "https://images3.alphacoders.com/100/1003898.jpg",
        "trailer": "https://www.youtube.com/watch?v=ORFWdXl_zJ4",
        "flag": True,
    },
    {
        "titulo": "Viva — A Vida é uma Festa",
        "ano": 2017,
        "sinopse": "Miguel sonha em se tornar músico, mas sua família proibiu a música por gerações. No Dia dos Mortos ele acidentalmente entra na Terra dos Mortos e precisa encontrar seu bisavô para voltar ao mundo dos vivos.",
        "classificacao": "Livre",
        "produtora": "Pixar Animation Studios",
        "pais_origem": "Estados Unidos",
        "categorias": ["Animação", "Musical", "Aventura", "Família", "Fantasia"],
        "linguagens": ["Inglês", "Espanhol"],
        "diretores": ["Lee Unkrich"],
        "atores": [],
        "poster": "https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg",
        "banner": "https://images.alphacoders.com/935/935060.jpg",
        "trailer": "https://www.youtube.com/watch?v=Ga6RYejo6Hk",
        "flag": True,
    },
]

filmes_criados = []
for f in filmes_data:
    prod = produtoras[f["produtora"]]
    pais_origem = paises[f["pais_origem"]]
    filme = Filme(
        titulo=f["titulo"],
        ano=f["ano"],
        sinopse=f["sinopse"],
        classificacao=f["classificacao"],
        id_produtora_principal=prod.id_produtora,
        id_pais_origem=pais_origem.id_pais,
        poster=f.get("poster"),
        banner=f.get("banner"),
        trailer=f.get("trailer"),
        flag=f.get("flag", False),
    )
    db.add(filme)
    db.flush()

    # Categorias
    for cat_nome in f["categorias"]:
        db.add(FilmeCategoria(id_filme=filme.id_filme, id_categoria=categorias[cat_nome].id_categoria))

    # Linguagens
    for ling_nome in f["linguagens"]:
        db.add(FilmeLinguagem(id_filme=filme.id_filme, id_linguagem=linguagens[ling_nome].id_linguagem))

    # País
    db.add(FilmePais(id_filme=filme.id_filme, id_pais=pais_origem.id_pais))

    # Produtora
    db.add(FilmeProdutora(id_filme=filme.id_filme, id_produtora=prod.id_produtora))

    # Diretores
    for dir_nome in f["diretores"]:
        if dir_nome in diretores:
            db.add(FilmeDiretor(id_filme=filme.id_filme, id_diretor=diretores[dir_nome].id_diretor))

    # Atores
    for ator_nome in f["atores"]:
        if ator_nome in atores:
            db.add(FilmeAtor(id_filme=filme.id_filme, id_ator=atores[ator_nome].id_ator))

    filmes_criados.append(filme)

print(f"  ✓ {len(filmes_criados)} filmes")

# ─── Destaques da Home (primeiros 5 filmes aprovados) ─────────────────────────
for i, filme in enumerate(filmes_criados[:5]):
    db.add(DestaqueHome(id_filme=filme.id_filme, ordem=i + 1))
print(f"  ✓ 5 destaques da home configurados")

# ─── Usuários ─────────────────────────────────────────────────────────────────
usuarios_data = [
    {
        "nome": "Admin",
        "sobrenome": "HollyWoo",
        "apelido": "admin",
        "email": "admin@hollywoo.com",
        "senha": "admin123",
        "role": "admin",
    },
    {
        "nome": "Maria",
        "sobrenome": "Silva",
        "apelido": "mariasilva",
        "email": "maria@email.com",
        "senha": "senha123",
        "role": "user",
    },
]

for u in usuarios_data:
    db.add(Usuario(
        nome=u["nome"],
        sobrenome=u["sobrenome"],
        apelido=u["apelido"],
        email=u["email"],
        senha=hash_password(u["senha"]),
        role=u["role"],
    ))
print(f"  ✓ {len(usuarios_data)} usuários criados")
print()
print("  👤 Login admin:  admin@hollywoo.com  /  admin123")
print("  👤 Login user:   maria@email.com     /  senha123")

# ─── Commit ───────────────────────────────────────────────────────────────────
db.commit()
db.close()
print()
print("✅ Seed concluído com sucesso!")
