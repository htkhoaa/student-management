"""Initial migration

Revision ID: 1af959637e50
Revises: None
Create Date: 2026-05-10 22:07:36.221463

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1af959637e50'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    ## Create table 'classes'
    op.create_table('classes',
    sa.Column('name', sa.String(length=50), nullable=False),
             sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
             sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
             sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
             sa.PrimaryKeyConstraint('id')
    )
    # Create index for table 'classes'
    op.create_index(op.f('ix_classes_id'), 'classes', ['id'], unique=False)
    op.create_index(op.f('ix_classes_name'), 'classes', ['name'], unique=True)


    ## Create table 'students'
    op.create_table('students',
    sa.Column('full_name', sa.String(length=150), nullable=False),
             sa.Column('email', sa.String(length=255), nullable=False),
             sa.Column('gender', sa.Enum('MALE', 'FEMALE', 'OTHER', name='gendertype'), nullable=False),
             sa.Column('phone', sa.String(length=20), nullable=True),
             sa.Column('class_id', sa.Integer(), nullable=False),
             sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
             sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
             sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
             sa.ForeignKeyConstraint(['class_id'], ['classes.id'], ondelete='RESTRICT'),
             sa.PrimaryKeyConstraint('id')
    )
    # Create index for table 'students'
    op.create_index(op.f('ix_students_email'), 'students', ['email'], unique=True)
    op.create_index(op.f('ix_students_id'), 'students', ['id'], unique=False)


    ## Create table 'users'
    op.create_table('users',
    sa.Column('username', sa.String(length=50), nullable=False),
             sa.Column('password_hash', sa.String(length=255), nullable=False),
             sa.Column('email', sa.String(length=255), nullable=False),
             sa.Column('role', sa.Enum('ADMIN', 'STUDENT', name='userrole'), nullable=False),
             sa.Column('is_active', sa.Boolean(), nullable=True),
             sa.Column('student_id', sa.Integer(), nullable=True),
             sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
             sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
             sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
             sa.ForeignKeyConstraint(['student_id'], ['students.id'], ondelete='SET NULL'),
             sa.PrimaryKeyConstraint('id'),
             sa.UniqueConstraint('email'),
             sa.UniqueConstraint('student_id')
    )
    # Create index for table 'users'
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

def downgrade():
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')

    op.drop_index(op.f('ix_students_id'), table_name='students')
    op.drop_index(op.f('ix_students_email'), table_name='students')
    op.drop_table('students')

    op.drop_index(op.f('ix_classes_name'), table_name='classes')
    op.drop_index(op.f('ix_classes_id'), table_name='classes')
    op.drop_table('classes')
