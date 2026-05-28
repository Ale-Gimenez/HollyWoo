from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.models import Favorito, Filme, Usuario
from app.schemas.schemas import FavoritoOut, MsgOut

router = APIRouter(prefix="/favoritos", tags=["Favoritos"])


@router.get("", response_model=List[FavoritoOut])
def listar_favoritos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Retorna todos os filmes favoritados pelo usuário logado."""
    return (
        db.query(Favorito)
        .filter(Favorito.id_usuario == current_user.id_usuario)
        .all()
    )


@router.post("/{filme_id}", response_model=FavoritoOut, status_code=201)
def adicionar_favorito(
    filme_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Adiciona um filme à lista de favoritos do usuário logado."""
    if not db.get(Filme, filme_id):
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    existente = (
        db.query(Favorito)
        .filter(
            Favorito.id_usuario == current_user.id_usuario,
            Favorito.id_filme == filme_id,
        )
        .first()
    )
    if existente:
        raise HTTPException(status_code=409, detail="Filme já está nos favoritos")

    fav = Favorito(id_usuario=current_user.id_usuario, id_filme=filme_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


@router.delete("/{filme_id}", response_model=MsgOut)
def remover_favorito(
    filme_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Remove um filme dos favoritos do usuário logado."""
    fav = (
        db.query(Favorito)
        .filter(
            Favorito.id_usuario == current_user.id_usuario,
            Favorito.id_filme == filme_id,
        )
        .first()
    )
    if not fav:
        raise HTTPException(status_code=404, detail="Favorito não encontrado")
    db.delete(fav)
    db.commit()
    return MsgOut(detail="Filme removido dos favoritos")


@router.get("/verificar/{filme_id}")
def verificar_favorito(
    filme_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Verifica se um filme específico está nos favoritos do usuário logado."""
    existe = (
        db.query(Favorito)
        .filter(
            Favorito.id_usuario == current_user.id_usuario,
            Favorito.id_filme == filme_id,
        )
        .first()
    )
    return {"favoritado": existe is not None}
