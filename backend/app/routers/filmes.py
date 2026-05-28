from datetime import time as dt_time
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.models import (
    Ator, Categoria, Diretor, Filme, FilmeAtor, FilmeCategoria,
    FilmeDiretor, FilmeLinguagem, FilmePais, FilmeProdutora, FilmeSaga,
    Linguagem, Pais, Produtora, Saga, Usuario,
)
from app.schemas.schemas import FilmeCreate, FilmeListOut, FilmeOut, FilmeUpdate, MsgOut

router = APIRouter(prefix="/filmes", tags=["Filmes"])

# ─── helpers ──────────────────────────────────────────────────────────────────

def _parse_duracao(s: Optional[str]) -> Optional[dt_time]:
    if not s:
        return None
    parts = s.split(":")
    try:
        h, m = int(parts[0]), int(parts[1])
        sec = int(parts[2]) if len(parts) > 2 else 0
        return dt_time(h, m, sec)
    except Exception:
        raise HTTPException(status_code=422, detail=f"Formato de duração inválido: '{s}'. Use HH:MM ou HH:MM:SS")

def _set_relations(db: Session, filme: Filme, data: dict):
    """Atualiza todas as tabelas N:N do filme."""
    mapping = {
        "ids_produtoras": (FilmeProdutora, "id_produtora"),
        "ids_paises":     (FilmePais,      "id_pais"),
        "ids_categorias": (FilmeCategoria, "id_categoria"),
        "ids_atores":     (FilmeAtor,      "id_ator"),
        "ids_diretores":  (FilmeDiretor,   "id_diretor"),
        "ids_linguagens": (FilmeLinguagem, "id_linguagem"),
        "ids_sagas":      (FilmeSaga,      "id_saga"),
    }
    fk_filme = "id_filme"

    for key, (Model, fk_col) in mapping.items():
        ids = data.get(key)
        if ids is None:
            continue
        db.query(Model).filter(getattr(Model, fk_filme) == filme.id_filme).delete()
        for fk_id in ids:
            db.add(Model(**{fk_filme: filme.id_filme, fk_col: fk_id}))

def _get_or_404(db: Session, filme_id: int) -> Filme:
    f = db.get(Filme, filme_id)
    if not f:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    return f

# ─── Rotas públicas ───────────────────────────────────────────────────────────

@router.get("", response_model=List[FilmeListOut])
def list_filmes(
    titulo: Optional[str]          = Query(None, description="Busca por título, ator ou diretor"),
    ano: Optional[int]             = Query(None),
    categoria: Optional[int]       = Query(None, description="id_categoria"),
    classificacao: Optional[str]   = Query(None, description="ex: L, 6, 10, 12, 14, 16, 18"),
    estilo_visual: Optional[str]   = Query(None, description="ex: 3D, 2D, Stop Motion, Anime"),
    linguagem: Optional[int]       = Query(None, description="id_linguagem"),
    pais: Optional[int]            = Query(None, description="id_pais"),
    saga: Optional[int]            = Query(None, description="id_saga"),
    aprovados: bool                = Query(True, description="False = pendentes (só admin)"),
    skip: int                      = Query(0, ge=0),
    limit: int                     = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Filme)

    if aprovados:
        q = q.filter(Filme.flag == True)

    # busca unificada: título, ator ou diretor
    if titulo:
        q = (
            q.outerjoin(FilmeAtor,    FilmeAtor.id_filme    == Filme.id_filme)
             .outerjoin(Ator,         Ator.id_ator          == FilmeAtor.id_ator)
             .outerjoin(FilmeDiretor, FilmeDiretor.id_filme == Filme.id_filme)
             .outerjoin(Diretor,      Diretor.id_diretor    == FilmeDiretor.id_diretor)
             .filter(
                 Filme.titulo.ilike(f"%{titulo}%") |
                 Ator.nome.ilike(f"%{titulo}%")    |
                 Diretor.nome.ilike(f"%{titulo}%")
             )
             .distinct()
        )

    if ano:
        q = q.filter(Filme.ano == ano)

    if categoria:
        q = q.join(FilmeCategoria, FilmeCategoria.id_filme == Filme.id_filme).filter(
            FilmeCategoria.id_categoria == categoria
        )

    if classificacao:
        q = q.filter(Filme.classificacao == classificacao)

    if estilo_visual:
        q = q.filter(Filme.estilo_visual == estilo_visual)

    if linguagem:
        q = q.join(FilmeLinguagem, FilmeLinguagem.id_filme == Filme.id_filme).filter(
            FilmeLinguagem.id_linguagem == linguagem
        )

    if pais:
        q = q.join(FilmePais, FilmePais.id_filme == Filme.id_filme).filter(
            FilmePais.id_pais == pais
        )

    if saga:
        q = q.join(FilmeSaga, FilmeSaga.id_filme == Filme.id_filme).filter(
            FilmeSaga.id_saga == saga
        )

    return q.offset(skip).limit(limit).all()


@router.get("/pendentes", response_model=List[FilmeListOut])
def list_pendentes(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    return db.query(Filme).filter(Filme.flag == False).all()


@router.get("/{filme_id}", response_model=FilmeOut)
def get_filme(filme_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, filme_id)

# ─── Rotas autenticadas ───────────────────────────────────────────────────────

@router.post("", response_model=FilmeOut, status_code=201)
def create_filme(
    body: FilmeCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    data = body.model_dump()
    filme = Filme(
        titulo=data["titulo"],
        id_produtora_principal=data.get("id_produtora_principal"),
        id_pais_origem=data.get("id_pais_origem"),
        orcamento=data.get("orcamento"),
        duracao=_parse_duracao(data.get("duracao")),
        sinopse=data.get("sinopse"),
        ano=data.get("ano"),
        poster=data.get("poster"),
        banner=data.get("banner"),
        trailer=data.get("trailer"),
        classificacao=data.get("classificacao"),
        estilo_visual=data.get("estilo_visual"),
        flag=False,
    )
    db.add(filme)
    db.flush()

    _set_relations(db, filme, data)
    db.commit()
    db.refresh(filme)
    return filme


@router.patch("/{filme_id}", response_model=FilmeOut)
def update_filme(
    filme_id: int,
    body: FilmeUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    filme = _get_or_404(db, filme_id)
    data = body.model_dump(exclude_none=True)

    scalar_fields = {
        "titulo", "orcamento", "sinopse", "ano", "poster", "banner", "trailer",
        "id_produtora_principal", "id_pais_origem", "classificacao", "estilo_visual",
    }
    for field in scalar_fields:
        if field in data:
            setattr(filme, field, data[field])

    if "duracao" in data:
        filme.duracao = _parse_duracao(data["duracao"])

    _set_relations(db, filme, data)
    db.commit()
    db.refresh(filme)
    return filme


@router.put("/{filme_id}/aprovar", response_model=FilmeOut)
def aprovar_filme(
    filme_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    filme = _get_or_404(db, filme_id)
    filme.flag = True
    db.commit()
    db.refresh(filme)
    return filme


@router.delete("/{filme_id}", response_model=MsgOut)
def delete_filme(
    filme_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    filme = _get_or_404(db, filme_id)
    for Model in (FilmeProdutora, FilmePais, FilmeCategoria, FilmeAtor, FilmeDiretor, FilmeLinguagem, FilmeSaga):
        db.query(Model).filter(Model.id_filme == filme_id).delete()
    db.delete(filme)
    db.commit()
    return MsgOut(detail="Filme removido com sucesso")
