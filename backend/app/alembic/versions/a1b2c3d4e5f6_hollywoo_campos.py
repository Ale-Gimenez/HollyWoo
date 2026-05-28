"""hollywoo: classificacao, estilo_visual, saga, filme_saga, favorito

Revision ID: a1b2c3d4e5f6
Revises: 57a9ef6bf842
Branch Labels: None
Depends on: None

Create Date: 2026-05-28
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "57a9ef6bf842"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Novos campos em filme ─────────────────────────────────────────────────
    op.add_column("filme", sa.Column("classificacao", sa.String(10), nullable=True))
    op.add_column("filme", sa.Column("estilo_visual", sa.String(50), nullable=True))

    # ── Tabela saga ───────────────────────────────────────────────────────────
    op.create_table(
        "saga",
        sa.Column("id_saga",   sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("nome",      sa.String(255), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=True),
        sa.UniqueConstraint("nome"),
        mysql_charset="utf8mb4",
        mysql_collate="utf8mb4_unicode_ci",
    )

    # ── Tabela filme_saga ─────────────────────────────────────────────────────
    op.create_table(
        "filme_saga",
        sa.Column("id_filme_saga", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("id_filme",      sa.Integer(), nullable=False),
        sa.Column("id_saga",       sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["id_filme"], ["filme.id_filme"]),
        sa.ForeignKeyConstraint(["id_saga"],  ["saga.id_saga"]),
        mysql_charset="utf8mb4",
        mysql_collate="utf8mb4_unicode_ci",
    )

    # ── Tabela favorito ───────────────────────────────────────────────────────
    op.create_table(
        "favorito",
        sa.Column("id_favorito", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("id_usuario",  sa.Integer(), nullable=False),
        sa.Column("id_filme",    sa.Integer(), nullable=False),
        sa.Column("criado_em",   sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.ForeignKeyConstraint(["id_usuario"], ["usuario.id_usuario"]),
        sa.ForeignKeyConstraint(["id_filme"],   ["filme.id_filme"]),
        sa.UniqueConstraint("id_usuario", "id_filme", name="uq_usuario_filme"),
        mysql_charset="utf8mb4",
        mysql_collate="utf8mb4_unicode_ci",
    )


def downgrade() -> None:
    op.drop_table("favorito")
    op.drop_table("filme_saga")
    op.drop_table("saga")
    op.drop_column("filme", "estilo_visual")
    op.drop_column("filme", "classificacao")
