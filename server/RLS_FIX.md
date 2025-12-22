# Supabase RLS (Row Level Security) 문제 해결

## 문제
```
new row violates row-level security policy for table "users"
```

이 오류는 Supabase의 Row Level Security (RLS) 정책 때문에 발생합니다.

## 해결 방법

### 방법 1: 서비스 역할 키 사용 (권장)

서버에서는 **service_role key**를 사용하여 RLS를 우회할 수 있습니다.

1. **Supabase 대시보드에서 서비스 역할 키 확인:**
   - Settings > API 탭으로 이동
   - **service_role** 키 복사 (⚠️ 절대 공개하지 마세요!)

2. **Railway 환경 변수 설정:**
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role 키)
   ```

3. **코드는 자동으로 service_role 키를 우선 사용합니다**

### 방법 2: RLS 비활성화 (개발용)

Supabase SQL Editor에서 실행:

```sql
-- RLS 비활성화
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
```

⚠️ **주의**: 프로덕션에서는 RLS를 활성화하고 적절한 정책을 설정하는 것을 권장합니다.

### 방법 3: RLS 정책 설정 (프로덕션 권장)

서버에서 접근할 수 있도록 정책 설정:

```sql
-- 서비스 역할로 모든 작업 허용 (서버에서만 사용)
CREATE POLICY "Service role can do everything" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything" ON sites
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 현재 설정

코드는 `SUPABASE_SERVICE_ROLE_KEY`를 우선 사용하고, 없으면 `SUPABASE_ANON_KEY`를 사용합니다.

**Railway Variables에 추가:**
```
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_키_입력
```

