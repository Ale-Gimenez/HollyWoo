from datetime import time as dt_time
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.models import (
    Ator, Categoria, Diretor, Filme, FilmeAtor, FilmeCategoria,
    FilmeDiretor, FilmeLinguagem, FilmePais, FilmeProdutora,
    FilmeSaga, FilmeTema, Linguagem, Pais, Produtora, Saga, Usuario,
    DestaqueHome, SugestaoEdicao,
)
from app.schemas.schemas import (
    FilmeCreate, FilmeListOut, FilmeOut, FilmeUpdate, MsgOut
)

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
        raise HTTPException(
            status_code=422,
            detail=f"Formato de duração inválido: '{s}'. Use HH:MM ou HH:MM:SS"
        )

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

def _to_list_out(filmes) -> List[FilmeListOut]:
    """Converte uma lista de ORM Filme para FilmeListOut com era calculada."""
    return [FilmeListOut.from_orm_with_era(f) for f in filmes]

def _to_out(filme) -> FilmeOut:
    """Converte um ORM Filme para FilmeOut com era calculada."""
    return FilmeOut.from_orm_with_era(filme)

# ─── Rotas públicas ───────────────────────────────────────────────────────────

@router.get("", response_model=List[FilmeListOut])
def list_filmes(
    titulo: Optional[str] = Query(None, description="Busca por título"),
    ano: Optional[int] = Query(None),
    era: Optional[str] = Query(None, description="'classico', 'novo' ou None"),
    categoria: Optional[int] = Query(None, description="id_categoria"),
    ator: Optional[int] = Query(None, description="id_ator"),
    diretor: Optional[int] = Query(None, description="id_diretor"),
    pais: Optional[int] = Query(None, description="id_pais"),
    aprovados: bool = Query(True, description="False = pendentes (só admin)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    from app.schemas.schemas import _LIMIAR_CLASSICO, _LIMIAR_NOVO

    q = db.query(Filme)

    if aprovados:
        q = q.filter(Filme.flag == True)

    if titulo:
        q = q.filter(Filme.titulo.ilike(f"%{titulo}%"))
    if ano:
        q = q.filter(Filme.ano == ano)

    # Filtro por era calculada dinamicamente no banco
    if era == "classico":
        q = q.filter(Filme.ano <= _LIMIAR_CLASSICO)
    elif era == "novo":
        q = q.filter(Filme.ano >= _LIMIAR_NOVO)
    elif era == "medio":
        q = q.filter(Filme.ano > _LIMIAR_CLASSICO, Filme.ano < _LIMIAR_NOVO)

    if categoria:
        q = q.join(FilmeCategoria, FilmeCategoria.id_filme == Filme.id_filme).filter(
            FilmeCategoria.id_categoria == categoria
        )
    if ator:
        q = q.join(FilmeAtor, FilmeAtor.id_filme == Filme.id_filme).filter(
            FilmeAtor.id_ator == ator
        )
    if diretor:
        q = q.join(FilmeDiretor, FilmeDiretor.id_filme == Filme.id_filme).filter(
            FilmeDiretor.id_diretor == diretor
        )
    if pais:
        q = q.join(FilmePais, FilmePais.id_filme == Filme.id_filme).filter(
            FilmePais.id_pais == pais
        )

    return _to_list_out(q.offset(skip).limit(limit).all())

@router.get("/pendentes", response_model=List[FilmeListOut])
def list_pendentes(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    return _to_list_out(db.query(Filme).filter(Filme.flag == False).all())


@router.get("/{filme_id}", response_model=FilmeOut)
def get_filme(filme_id: int, db: Session = Depends(get_db)):
    return _to_out(_get_or_404(db, filme_id))

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
        flag=False,  # aguarda aprovação do admin
    )
    db.add(filme)
    db.flush()  # obtém id_filme antes do commit

    _set_relations(db, filme, data)
    db.commit()
    db.refresh(filme)
    return _to_out(filme)

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
        "titulo", "orcamento", "sinopse", "ano",
        "poster", "banner", "trailer", "id_produtora_principal", "id_pais_origem",
        "classificacao", "estilo_visual",
    }
    for field in scalar_fields:
        if field in data:
            setattr(filme, field, data[field])

    if "duracao" in data:
        filme.duracao = _parse_duracao(data["duracao"])

    _set_relations(db, filme, data)
    db.commit()
    db.refresh(filme)
    return _to_out(filme)

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
    return _to_out(filme)

@router.delete("/{filme_id}", response_model=MsgOut)
def delete_filme(
    filme_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    filme = _get_or_404(db, filme_id)
    for Model in (FilmeProdutora, FilmePais, FilmeCategoria, FilmeAtor, FilmeDiretor, FilmeLinguagem, FilmeSaga, FilmeTema):
        db.query(Model).filter(Model.id_filme == filme_id).delete()
    # Apaga destaques e sugestões que referenciam este filme
    db.query(DestaqueHome).filter(DestaqueHome.id_filme == filme_id).delete()
    db.query(SugestaoEdicao).filter(SugestaoEdicao.id_filme == filme_id).delete()
    db.delete(filme)
    db.commit()
    return MsgOut(detail="Filme removido com sucesso")