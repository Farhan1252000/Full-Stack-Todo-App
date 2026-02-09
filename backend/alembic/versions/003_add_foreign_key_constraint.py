"""Add foreign key constraint to tasks table

Revision ID: 003_add_foreign_key_constraint
Revises: 002_add_users_table
Create Date: 2026-02-09 21:20:00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003_add_foreign_key_constraint'
down_revision = '002_add_users_table'
branch_labels = None
depends_on = None


def upgrade():
    # Add the foreign key constraint to the tasks table
    op.create_foreign_key(
        'fk_tasks_user_id_users',
        'tasks',  # source table (should be plural based on the original migration)
        'users',  # target table
        ['user_id'],  # source columns
        ['id']  # target columns
    )


def downgrade():
    # Drop the foreign key constraint
    op.drop_constraint('fk_tasks_user_id_users', 'tasks', type_='foreignkey')

    # Drop indexes
    op.drop_index('idx_tasks_completed')
    op.drop_index('idx_tasks_user_created_at')
    op.drop_index('idx_tasks_user_id')