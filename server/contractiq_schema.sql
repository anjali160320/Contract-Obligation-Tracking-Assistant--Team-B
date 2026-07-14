-- ContractIQ Enterprise Database
-- Combined Schema (Part 1 + Part 2)
-- PostgreSQL 16+

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =========================
-- ENUMS (Foundation)
-- =========================
CREATE TYPE user_status AS ENUM ('ACTIVE','INACTIVE','SUSPENDED','PENDING');
CREATE TYPE role_type AS ENUM ('SYSTEM','CUSTOM');
CREATE TYPE organization_status AS ENUM ('ACTIVE','TRIAL','SUSPENDED','EXPIRED');
CREATE TYPE department_status AS ENUM ('ACTIVE','INACTIVE');

CREATE TABLE organizations(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(150) NOT NULL,
 code VARCHAR(30) UNIQUE NOT NULL,
 email VARCHAR(150),
 phone VARCHAR(30),
 website VARCHAR(255),
 logo_url TEXT,
 address TEXT,
 city VARCHAR(100),
 state VARCHAR(100),
 country VARCHAR(100),
 postal_code VARCHAR(20),
 timezone VARCHAR(100) DEFAULT 'UTC',
 currency CHAR(3) DEFAULT 'USD',
 status organization_status DEFAULT 'TRIAL',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP
);

CREATE TABLE departments(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(100) NOT NULL,
 description TEXT,
 status department_status DEFAULT 'ACTIVE',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP,
 UNIQUE(organization_id,name)
);

CREATE TABLE users(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id),
 department_id UUID REFERENCES departments(id),
 employee_code VARCHAR(30),
 first_name VARCHAR(80) NOT NULL,
 last_name VARCHAR(80),
 full_name VARCHAR(200),
 email VARCHAR(150) UNIQUE NOT NULL,
 phone VARCHAR(30),
 password_hash TEXT NOT NULL,
 profile_image TEXT,
 designation VARCHAR(100),
 job_title VARCHAR(100),
 status user_status DEFAULT 'ACTIVE',
 email_verified BOOLEAN DEFAULT FALSE,
 last_login TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP
);

CREATE TABLE roles(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID REFERENCES organizations(id),
 name VARCHAR(100) NOT NULL,
 description TEXT,
 role_type role_type DEFAULT 'CUSTOM',
 is_default BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 module VARCHAR(100) NOT NULL,
 permission_key VARCHAR(150) UNIQUE NOT NULL,
 description TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions(
 role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
 permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
 PRIMARY KEY(role_id,permission_id)
);

CREATE TABLE user_roles(
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
 assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 assigned_by UUID REFERENCES users(id),
 PRIMARY KEY(user_id,role_id)
);

CREATE TABLE user_sessions(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 refresh_token TEXT NOT NULL,
 ip_address VARCHAR(60),
 device_name VARCHAR(150),
 browser VARCHAR(100),
 operating_system VARCHAR(100),
 expires_at TIMESTAMP,
 revoked BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 token TEXT NOT NULL,
 expires_at TIMESTAMP NOT NULL,
 used BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verification_tokens(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 token TEXT NOT NULL,
 expires_at TIMESTAMP,
 verified BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_roles_org ON roles(organization_id);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_org_name_trgm ON organizations USING gin(name gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING gin(full_name gin_trgm_ops);




-- =========================
-- ENUMS (Contracts)
-- =========================
CREATE TYPE contract_status AS ENUM ('DRAFT','UNDER_REVIEW','PENDING_APPROVAL','APPROVED','ACTIVE','EXPIRED','TERMINATED','REJECTED','ARCHIVED');
CREATE TYPE contract_priority AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
CREATE TYPE contract_type AS ENUM ('NDA','MSA','SOW','EMPLOYMENT','VENDOR','CUSTOMER','PARTNERSHIP','SERVICE','PURCHASE','LEASE','OTHER');
CREATE TYPE version_status AS ENUM ('DRAFT','CURRENT','ARCHIVED');
CREATE TYPE attachment_type AS ENUM ('CONTRACT','ANNEXURE','IMAGE','PDF','OTHER');
CREATE TYPE team_role AS ENUM ('OWNER','EDITOR','VIEWER','LEGAL','APPROVER');

CREATE TABLE counterparties(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 company_name VARCHAR(200) NOT NULL,
 legal_name VARCHAR(250),
 registration_number VARCHAR(100),
 tax_number VARCHAR(100),
 website VARCHAR(255),
 email VARCHAR(150),
 phone VARCHAR(30),
 address TEXT,
 city VARCHAR(100),
 state VARCHAR(100),
 country VARCHAR(100),
 postal_code VARCHAR(20),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP
);

CREATE INDEX idx_counterparty_name ON counterparties USING gin(company_name gin_trgm_ops);

CREATE TABLE contracts(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id),
 department_id UUID REFERENCES departments(id),
 counterparty_id UUID REFERENCES counterparties(id),
 owner_id UUID NOT NULL REFERENCES users(id),
 contract_number VARCHAR(50) UNIQUE NOT NULL,
 reference_code VARCHAR(50) UNIQUE,
 title VARCHAR(250) NOT NULL,
 description TEXT,
 contract_type contract_type NOT NULL,
 priority contract_priority DEFAULT 'MEDIUM',
 status contract_status DEFAULT 'DRAFT',
 contract_value NUMERIC(18,2),
 currency CHAR(3) DEFAULT 'USD',
 start_date DATE,
 end_date DATE,
 signed_date DATE,
 effective_date DATE,
 auto_renew BOOLEAN DEFAULT FALSE,
 renewal_notice_days INTEGER DEFAULT 30,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP,
 CHECK(end_date IS NULL OR start_date IS NULL OR end_date>=start_date)
);

CREATE INDEX idx_contract_status ON contracts(status);
CREATE INDEX idx_contract_owner ON contracts(owner_id);
CREATE INDEX idx_contract_end_date ON contracts(end_date);
CREATE INDEX idx_contract_title ON contracts USING gin(title gin_trgm_ops);

CREATE TABLE contract_versions(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
 version_number INTEGER NOT NULL,
 version_status version_status DEFAULT 'DRAFT',
 document_url TEXT,
 checksum VARCHAR(128),
 snapshot JSONB,
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(contract_id,version_number)
);

CREATE TABLE contract_attachments(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
 uploaded_by UUID NOT NULL REFERENCES users(id),
 attachment_type attachment_type,
 file_name VARCHAR(255),
 file_url TEXT,
 mime_type VARCHAR(100),
 file_size BIGINT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contract_comments(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
 parent_comment_id UUID REFERENCES contract_comments(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id),
 comment TEXT NOT NULL,
 is_internal BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP
);

CREATE TABLE tags(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id),
 tag_name VARCHAR(100) NOT NULL,
 color VARCHAR(7),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(organization_id,tag_name),
 CHECK(color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE contract_tags(
 contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
 tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
 PRIMARY KEY(contract_id,tag_id)
);

CREATE TABLE contract_team_members(
 contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
 user_id UUID REFERENCES users(id),
 team_role team_role DEFAULT 'VIEWER',
 assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(contract_id,user_id)
);

CREATE TABLE contract_custom_fields(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID REFERENCES organizations(id),
 field_name VARCHAR(100) NOT NULL,
 field_key VARCHAR(100) NOT NULL,
 field_type VARCHAR(50) NOT NULL,
 required BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(organization_id,field_key)
);

CREATE TABLE contract_custom_field_values(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
 custom_field_id UUID REFERENCES contract_custom_fields(id) ON DELETE CASCADE,
 field_value TEXT,
 UNIQUE(contract_id,custom_field_id)
);
