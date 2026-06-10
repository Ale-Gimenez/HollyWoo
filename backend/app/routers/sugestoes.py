from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.models import Filme, SugestaoEdicao, Usuario
from app.routers.filmes import _set_relations, _to_out, _parse_duracao, _get_or_404
from app.schemas.schemas import SugestaoEdicaoCreate, SugestaoEdicaoOut, MsgOut

router = APIRouter(prefix="/sugestoes", tags=["Sugestões"])


@router.post("/{filme_id}", response_model=SugestaoEdicaoOut, status_code=201)
def criar_sugestao(
    filme_id: int,
    body: SugestaoEdicaoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    """Usuário autenticado sugere uma edição para um filme existente."""
    _get_or_404(db, filme_id)
    sug = SugestaoEdicao(
        id_filme=filme_id,
        id_usuario=usuario.id_usuario,
        titulo=body.titulo,
        ano=body.ano,
        sinopse=body.sinopse,
        classificacao=body.classificacao,
        poster=body.poster,
        banner=body.banner,
        trailer=body.trailer,
        duracao=_parse_duracao(body.duracao) if body.duracao else None,
        orcamento=body.orcamento,
        estilo_visual=body.estilo_visual,
        ids_categorias=",".join(str(i) for i in body.ids_categorias) if body.ids_categorias else None,
        ids_paises=",".join(str(i) for i in body.ids_paises) if body.ids_paises else None,
        ids_linguagens=",".join(str(i) for i in body.ids_linguagens) if body.ids_linguagens else None,
        ids_sagas=",".join(str(i) for i in body.ids_sagas) if body.ids_sagas else None,
    )
    db.add(sug)
    db.commit()
    db.refresh(sug)
    return _normalize_sug(sug)


@router.get("", response_model=List[SugestaoEdicaoOut])
def listar_sugestoes(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    """Admin lista todas as sugestões de edição pendentes."""
    sugs = db.query(SugestaoEdicao).filter(SugestaoEdicao.status == "pendente").all()
    return [_normalize_sug(s) for s in sugs]


@router.get("/{filme_id}", response_model=List[SugestaoEdicaoOut])
def listar_sugestoes_filme(
    filme_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    """Admin lista sugestões pendentes de um filme específico."""
    sugs = (
        db.query(SugestaoEdicao)
        .filter(SugestaoEdicao.id_filme == filme_id, SugestaoEdicao.status == "pendente")
        .all()
    )
    return [_normalize_sug(s) for s in sugs]


@router.put("/{sug_id}/aprovar", response_model=SugestaoEdicaoOut)
def aprovar_sugestao(
    sug_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    """Admin aprova uma sugestão, aplicando as alterações no filme."""
    sug = _get_sug_or_404(db, sug_id)
    filme = _get_or_404(db, sug.id_filme)

    # Aplica campos escalares que foram sugeridos
    if sug.titulo:        filme.titulo        = sug.titulo
    if sug.ano:           filme.ano           = sug.ano
    if sug.sinopse:       filme.sinopse       = sug.sinopse
    if sug.classificacao: filme.classificacao = sug.classificacao
    if sug.poster:        filme.poster        = sug.poster
    if sug.banner:        filme.banner        = sug.banner
    if sug.trailer:       filme.trailer       = sug.trailer
    if sug.duracao:       filme.duracao       = sug.duracao
    if sug.orcamento:     filme.orcamento     = sug.orcamento
    if sug.estilo_visual: filme.estilo_visual = sug.estilo_visual

    # Aplica relações N:N que foram sugeridas
    rel_data = {}
    if sug.ids_categorias: rel_data["ids_categorias"] = [int(i) for i in sug.ids_categorias.split(",") if i]
    if sug.ids_paises:     rel_data["ids_paises"]     = [int(i) for i in sug.ids_paises.split(",") if i]
    if sug.ids_linguagens: rel_data["ids_linguagens"] = [int(i) for i in sug.ids_linguagens.split(",") if i]
    if sug.ids_sagas:      rel_data["ids_sagas"]      = [int(i) for i in sug.ids_sagas.split(",") if i]
    if rel_data:
        _set_relations(db, filme, rel_data)

    sug.status = "aprovada"
    db.commit()
    db.refresh(sug)
    return _normalize_sug(sug)


@router.delete("/{sug_id}", response_model=SugestaoEdicaoOut)
def recusar_sugestao(
    sug_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    """Admin recusa uma sugestão de edição."""
    sug = _get_sug_or_404(db, sug_id)
    sug.status = "recusada"
    db.commit()
    db.refresh(sug)
    return _normalize_sug(sug)


# ─── helpers internos ─────────────────────────────────────────────────────────

def _get_sug_or_404(db: Session, sug_id: int) -> SugestaoEdicao:
    s = db.get(SugestaoEdicao, sug_id)
    if not s:
        raise HTTPException(status_code=404, detail="Sugestão não encontrada")
    if s.status != "pendente":
        raise HTTPException(status_code=400, detail=f"Sugestão já está com status '{s.status}'")
    return s


def _normalize_sug(s: SugestaoEdicao) -> dict:
    return {
        "id": s.id,
        "id_filme": s.id_filme,
        "id_usuario": s.id_usuario,
        "nome_usuario": f"{s.usuario.nome} {s.usuario.sobrenome or ''}".strip() if s.usuario else "Usuário",
        "avatar_usuario": s.usuario.imagem if s.usuario else None,
        "status": s.status,
        "criado_em": s.criado_em.isoformat() if s.criado_em else None,
        "titulo": s.titulo,
        "ano": s.ano,
        "sinopse": s.sinopse,
        "classificacao": s.classificacao,
        "poster": s.poster,
        "banner": s.banner,
        "trailer": s.trailer,
        "duracao": str(s.duracao) if s.duracao else None,
        "orcamento": float(s.orcamento) if s.orcamento else None,
        "estilo_visual": s.estilo_visual,
        "ids_categorias": [int(i) for i in s.ids_categorias.split(",") if i] if s.ids_categorias else [],
        "ids_paises":     [int(i) for i in s.ids_paises.split(",") if i]     if s.ids_paises     else [],
        "ids_linguagens": [int(i) for i in s.ids_linguagens.split(",") if i] if s.ids_linguagens else [],
        "ids_sagas":      [int(i) for i in s.ids_sagas.split(",") if i]      if s.ids_sagas      else [],
    }
