"""Initial migration

Revision ID: 001_initial_migration
Revises: 
Create Date: 2026-02-08 12:00:00

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
import uuid

# revision identifiers, used by Alembic.
revision = '001_initial_migration'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create the tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Uuid, primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column('user_id', sa.Uuid, nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('completed', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP"))
        # Note: Foreign key constraint to auth.users is commented out since Better Auth table may not exist yet
        # sa.ForeignKeyConstraint(['user_id'], ['auth.users.id'], ondelete='CASCADE')
    )

    # Create indexes for performance
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_user_created_at', 'tasks', ['user_id', 'created_at'])
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])

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
        CREATE TRIGGER update_tasks_updated_at 
            BEFORE UPDATE ON tasks 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade():
    # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column();")
    
    # Drop indexes
    op.drop_index('idx_tasks_completed')
    op.drop_index('idx_tasks_user_created_at')
    op.drop_index('idx_tasks_user_id')
    
    # Drop table
    op.drop_table('tasks')