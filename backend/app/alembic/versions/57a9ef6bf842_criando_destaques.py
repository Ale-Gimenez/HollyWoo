"""criando destaques

Revision ID: 57a9ef6bf842
Revises: 
Create Date: 2026-05-27 10:48:29.732398

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

revision: str = '57a9ef6bf842'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('ator',
        sa.Column('id_ator',          mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',             mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('sobrenome',        mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('nome_personagem',  mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False, server_default=''),
        sa.Column('img',              mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=500),  nullable=False, server_default=''),
        sa.PrimaryKeyConstraint('id_ator'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('diretor',
        sa.Column('id_diretor', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',       mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('sobrenome',  mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('img',        mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=500),  nullable=False, server_default=''),
        sa.PrimaryKeyConstraint('id_diretor'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('categoria',
        sa.Column('id_categoria', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',         mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.PrimaryKeyConstraint('id_categoria'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('nome', 'categoria', ['nome'], unique=True)

    op.create_table('linguagem',
        sa.Column('id_linguagem', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',         mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('img',          mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=500),  nullable=False, server_default=''),
        sa.PrimaryKeyConstraint('id_linguagem'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('nome_linguagem', 'linguagem', ['nome'], unique=True)

    op.create_table('pais',
        sa.Column('id_pais', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',    mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('img',     mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=500),  nullable=False, server_default=''),
        sa.PrimaryKeyConstraint('id_pais'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('nome_pais', 'pais', ['nome'], unique=True)

    op.create_table('produtora',
        sa.Column('id_produtora', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',         mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('img',          mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=500),  nullable=False, server_default=''),
        sa.PrimaryKeyConstraint('id_produtora'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('nome_produtora', 'produtora', ['nome'], unique=True)

    op.create_table('usuario',
        sa.Column('id_usuario',      mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('nome',            mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('sobrenome',       mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=True),
        sa.Column('apelido',         mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=100),  nullable=True),
        sa.Column('email',           mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('senha',           mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('data_nascimento', sa.DATE(), nullable=True),
        sa.Column('imagem',          mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=500),  nullable=True),
        sa.Column('role',            mysql.ENUM('admin', 'user'), server_default=sa.text("'user'"), nullable=False),
        sa.Column('data_criacao',    mysql.DATETIME(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id_usuario'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('email',   'usuario', ['email'],   unique=True)
    op.create_index('apelido', 'usuario', ['apelido'], unique=True)

    op.create_table('refresh_token_blacklist',
        sa.Column('id',        mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('token',     mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=512), nullable=False),
        sa.Column('criado_em', mysql.DATETIME(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('token', 'refresh_token_blacklist', ['token'], unique=True)

    op.create_table('filme',
        sa.Column('id_filme',               mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('titulo',                 mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=False),
        sa.Column('id_produtora_principal', mysql.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('id_pais_origem',         mysql.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('orcamento',              mysql.DECIMAL(precision=15, scale=2), nullable=True),
        sa.Column('duracao',                mysql.TIME(), nullable=True),
        sa.Column('sinopse',                mysql.LONGTEXT(collation='utf8mb4_unicode_ci'), nullable=True),
        sa.Column('ano',                    mysql.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('poster',                 mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=True),
        sa.Column('banner',                 mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=True),
        sa.Column('trailer',                mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=True),
        sa.Column('flag',                   mysql.TINYINT(display_width=1), server_default=sa.text("'0'"), autoincrement=False, nullable=True),
        sa.Column('classificacao',          mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=10),  nullable=True),
        sa.Column('estilo_visual',          mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=100), nullable=True),
        sa.Column('era',                    mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=50),  nullable=True),
        sa.Column('saga',                   mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=255), nullable=True),
        sa.ForeignKeyConstraint(['id_pais_origem'],         ['pais.id_pais'],           name='fk_filme_pais_origem'),
        sa.ForeignKeyConstraint(['id_produtora_principal'], ['produtora.id_produtora'], name='fk_filme_produtora_principal'),
        sa.PrimaryKeyConstraint('id_filme'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('titulo', 'filme', ['titulo'], unique=True)

    op.create_table('destaque_home',
        sa.Column('id',       mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme', mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('ordem',    mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_filme'], ['filme.id_filme'], name='destaque_home_ibfk_1'),
        sa.PrimaryKeyConstraint('id'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )
    op.create_index('id_filme', 'destaque_home', ['id_filme'], unique=True)

    op.create_table('filme_categoria',
        sa.Column('id_filme_categoria', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme',           mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_categoria',       mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_categoria'], ['categoria.id_categoria'], name='filme_categoria_ibfk_2'),
        sa.ForeignKeyConstraint(['id_filme'],     ['filme.id_filme'],         name='filme_categoria_ibfk_1'),
        sa.PrimaryKeyConstraint('id_filme_categoria'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('filme_linguagem',
        sa.Column('id_filme_linguagem', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme',           mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_linguagem',       mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_filme'],     ['filme.id_filme'],         name='filme_linguagem_ibfk_1'),
        sa.ForeignKeyConstraint(['id_linguagem'], ['linguagem.id_linguagem'], name='filme_linguagem_ibfk_2'),
        sa.PrimaryKeyConstraint('id_filme_linguagem'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('filme_pais',
        sa.Column('id_filme_pais', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme',      mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_pais',       mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_filme'], ['filme.id_filme'], name='filme_pais_ibfk_1'),
        sa.ForeignKeyConstraint(['id_pais'],  ['pais.id_pais'],   name='filme_pais_ibfk_2'),
        sa.PrimaryKeyConstraint('id_filme_pais'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('filme_produtora',
        sa.Column('id_filme_produtora', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme',           mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_produtora',       mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_filme'],     ['filme.id_filme'],           name='filme_produtora_ibfk_1'),
        sa.ForeignKeyConstraint(['id_produtora'], ['produtora.id_produtora'],   name='filme_produtora_ibfk_2'),
        sa.PrimaryKeyConstraint('id_filme_produtora'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('filme_ator',
        sa.Column('id_filme_ator', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme',      mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_ator',       mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_ator'],  ['ator.id_ator'],   name='filme_ator_ibfk_2'),
        sa.ForeignKeyConstraint(['id_filme'], ['filme.id_filme'], name='filme_ator_ibfk_1'),
        sa.PrimaryKeyConstraint('id_filme_ator'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('filme_diretor',
        sa.Column('id_filme_diretor', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_filme',         mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_diretor',       mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_diretor'], ['diretor.id_diretor'], name='filme_diretor_ibfk_2'),
        sa.ForeignKeyConstraint(['id_filme'],   ['filme.id_filme'],     name='filme_diretor_ibfk_1'),
        sa.PrimaryKeyConstraint('id_filme_diretor'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('ator_pais',
        sa.Column('id_ator_pais', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_ator',      mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_pais',      mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_ator'], ['ator.id_ator'], name='ator_pais_ibfk_1'),
        sa.ForeignKeyConstraint(['id_pais'], ['pais.id_pais'], name='ator_pais_ibfk_2'),
        sa.PrimaryKeyConstraint('id_ator_pais'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('diretor_pais',
        sa.Column('id_diretor_pais', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_pais',         mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_diretor',      mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_diretor'], ['diretor.id_diretor'], name='diretor_pais_ibfk_2'),
        sa.ForeignKeyConstraint(['id_pais'],    ['pais.id_pais'],       name='diretor_pais_ibfk_1'),
        sa.PrimaryKeyConstraint('id_diretor_pais'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )

    op.create_table('produtora_pais',
        sa.Column('id_produtora_pais', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('id_produtora',      mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('id_pais',           mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['id_produtora'], ['produtora.id_produtora'], name='produtora_pais_ibfk_1'),
        sa.ForeignKeyConstraint(['id_pais'],      ['pais.id_pais'],           name='produtora_pais_ibfk_2'),
        sa.PrimaryKeyConstraint('id_produtora_pais'),
        mysql_collate='utf8mb4_unicode_ci', mysql_default_charset='utf8mb4', mysql_engine='InnoDB'
    )


def downgrade() -> None:
    op.drop_table('produtora_pais')
    op.drop_table('diretor_pais')
    op.drop_table('ator_pais')
    op.drop_table('filme_diretor')
    op.drop_table('filme_ator')
    op.drop_table('filme_produtora')
    op.drop_table('filme_pais')
    op.drop_table('filme_linguagem')
    op.drop_table('filme_categoria')
    op.drop_table('destaque_home')
    op.drop_table('filme')
    op.drop_table('refresh_token_blacklist')
    op.drop_table('usuario')
    op.drop_table('produtora')
    op.drop_table('pais')
    op.drop_table('linguagem')
    op.drop_table('categoria')
    op.drop_table('diretor')
    op.drop_table('ator')
