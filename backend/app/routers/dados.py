from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.models.models import Ator, Categoria, Diretor, Linguagem, Pais, Produtora, Saga
from app.schemas.schemas import (
    AtorOut, CategoriaOut, DiretorOut, LinguagemOut,
    MsgOut, PaisOut, ProdutoraOut, SagaCreate, SagaOut, SagaUpdate,
)

router = APIRouter(prefix="/dados", tags=["Dados auxiliares"])

# ── Dados de referência (leitura pública) ─────────────────────────────────────

@router.get("/paises", response_model=list[PaisOut])
def get_paises(db: Session = Depends(get_db)):
    return db.query(Pais).order_by(Pais.nome).all()

@router.get("/categorias", response_model=list[CategoriaOut])
def get_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).order_by(Categoria.nome).all()

@router.get("/linguagens", response_model=list[LinguagemOut])
def get_linguagens(db: Session = Depends(get_db)):
    return db.query(Linguagem).order_by(Linguagem.nome).all()

@router.get("/produtoras", response_model=list[ProdutoraOut])
def get_produtoras(db: Session = Depends(get_db)):
    return db.query(Produtora).order_by(Produtora.nome).all()

@router.get("/atores", response_model=list[AtorOut])
def get_atores(db: Session = Depends(get_db)):
    return db.query(Ator).order_by(Ator.sobrenome).all()

@router.get("/diretores", response_model=list[DiretorOut])
def get_diretores(db: Session = Depends(get_db)):
    return db.query(Diretor).order_by(Diretor.sobrenome).all()

# ── Sagas (CRUD — leitura pública, escrita só admin) ──────────────────────────

@router.get("/sagas", response_model=list[SagaOut])
def get_sagas(db: Session = Depends(get_db)):
    return db.query(Saga).order_by(Saga.nome).all()

@router.get("/sagas/{saga_id}", response_model=SagaOut)
def get_saga(saga_id: int, db: Session = Depends(get_db)):
    saga = db.get(Saga, saga_id)
    if not saga:
        raise HTTPException(status_code=404, detail="Saga não encontrada")
    return saga

@router.post("/sagas", response_model=SagaOut, status_code=201)
def create_saga(
    body: SagaCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    saga = Saga(nome=body.nome, descricao=body.descricao)
    db.add(saga)
    db.commit()
    db.refresh(saga)
    return saga

@router.patch("/sagas/{saga_id}", response_model=SagaOut)
def update_saga(
    saga_id: int,
    body: SagaUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    saga = db.get(Saga, saga_id)
    if not saga:
        raise HTTPException(status_code=404, detail="Saga não encontrada")
    if body.nome is not None:
        saga.nome = body.nome
    if body.descricao is not None:
        saga.descricao = body.descricao
    db.commit()
    db.refresh(saga)
    return saga

@router.delete("/sagas/{saga_id}", response_model=MsgOut)
def delete_saga(
    saga_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    saga = db.get(Saga, saga_id)
    if not saga:
        raise HTTPException(status_code=404, detail="Saga não encontrada")
    db.delete(saga)
    db.commit()
    return MsgOut(detail="Saga removida com sucesso")
