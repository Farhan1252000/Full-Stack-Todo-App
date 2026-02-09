"""Add users table

Revision ID: 002_add_users_table
Revises: 001_initial_migration
Create Date: 2026-02-09 21:10:00

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
import uuid
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '002_add_users_table'
down_revision = '001_initial_migration'
branch_labels = None
depends_on = None


def upgrade():
    # Create the users table
    op.create_table(
        'users',
        sa.Column('id', sa.Uuid, primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password', sa.String(255), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=True),
        sa.Column('last_name', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP"))
    )

    # Create indexes for performance
    op.create_index('idx_users_email', 'users', ['email'])

    # Create trigger to update the updated_at timestamp
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)

    op.execute("""
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade():
    # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS update_users_updated_at ON users;")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column();")

    # Drop indexes
    op.drop_index('idx_users_email')

    # Drop table
    op.drop_table('users')