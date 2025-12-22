-- Supabase 데이터베이스 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites 테이블 생성
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_url TEXT NOT NULL,
  sub_menus JSONB DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 데이터만 조회/수정/삭제 가능
-- 주의: 서버에서 직접 접근하므로 RLS는 비활성화하거나 서비스 역할 키를 사용해야 합니다
-- 개발 단계에서는 RLS를 비활성화하는 것을 권장합니다

-- RLS 비활성화 (서버에서 직접 접근하는 경우)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE sites DISABLE ROW LEVEL SECURITY;

