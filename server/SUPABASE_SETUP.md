# Supabase 설정 가이드

MongoDB에서 Supabase로 마이그레이션한 프로젝트의 설정 가이드입니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/) 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `site-dash`
   - Database Password: 강력한 비밀번호 생성 (복사해 보관)
   - Region: 가까운 지역 선택
4. "Create new project" 클릭

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 "SQL Editor" 탭으로 이동
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행
3. 또는 다음 SQL을 실행:

```sql
-- Users 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites 테이블
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_url TEXT NOT NULL,
  sub_menus JSONB DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
```

## 3. Supabase API 키 확인

1. Supabase 대시보드에서 "Settings" > "API" 탭으로 이동
2. 다음 정보를 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 4. Railway 환경 변수 설정

Railway 대시보드의 Variables 탭에서 다음 변수 추가/수정:

```env
# Supabase 설정 (MongoDB 대신 사용)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 기존 환경 변수 유지
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=https://ggnu11.github.io/site-dash
BACKEND_URL=https://site-dash-production.up.railway.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=production
```

## 5. Row Level Security (RLS) 설정

서버에서 직접 접근하는 경우 RLS를 비활성화해야 합니다:

1. Supabase 대시보드 > "Authentication" > "Policies" 탭
2. 또는 SQL Editor에서 실행:

```sql
-- RLS 비활성화 (서버에서 직접 접근)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
```

또는 서비스 역할 키(service_role key)를 사용하여 RLS를 우회할 수 있습니다.

## 6. 의존성 설치

로컬에서 테스트하는 경우:

```bash
cd server
npm install
```

## 7. 로컬 환경 변수 설정

`server/.env` 파일 생성:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
```

## 8. 테스트

1. 서버 시작:

   ```bash
   npm run dev
   ```

2. API 테스트:
   - `http://localhost:5001/health` - 헬스체크
   - `http://localhost:5001/api/auth/google` - Google 로그인

## 주의사항

- **보안**: `SUPABASE_ANON_KEY`는 공개되어도 되지만, 서비스 역할 키는 절대 공개하지 마세요
- **RLS**: 프로덕션에서는 RLS를 활성화하고 적절한 정책을 설정하는 것을 권장합니다
- **데이터 마이그레이션**: 기존 MongoDB 데이터가 있다면 마이그레이션 스크립트를 작성해야 합니다
