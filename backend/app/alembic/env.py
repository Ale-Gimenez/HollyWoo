import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# ── Garante que a pasta `backend/` esteja no sys.path ──────────────────────
# O alembic é rodado de dentro de backend/app/, mas os imports usam `app.`
# então precisamos que o pai de `app/` (ou seja, `backend/`) esteja no path.
_here = os.path.dirname(os.path.abspath(__file__))           # backend/app/alembic/
_app_dir = os.path.dirname(_here)                             # backend/app/
_backend_dir = os.path.dirname(_app_dir)                     # backend/
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from app.core.database import Base  # noqa: E402  (import após sys.path)
import app.models.models  # noqa: F401 — garante que os models sejam registrados

# ───────────────────────────────────────────────────────────────────────────

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from app.core.config import settings  # noqa: E402

    alembic_config = config.get_section(config.config_ini_section, {})
    alembic_config["sqlalchemy.url"] = settings.DATABASE_URL

    connectable = engine_from_config(
        alembic_config,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
