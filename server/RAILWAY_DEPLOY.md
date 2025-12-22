# Railway 배포 가이드

이 가이드는 Site Dash 백엔드 서버를 Railway에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **MongoDB Atlas 계정 및 클러스터**
   - [MongoDB Atlas](https://www.mongodb.com/atlas)에서 계정 생성
   - 무료 클러스터 생성
   - 데이터베이스 사용자 생성
   - 네트워크 액세스에서 `0.0.0.0/0` 추가 (모든 IP 허용)

2. **Google OAuth 설정**
   - [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 클라이언트 ID 생성
   - 승인된 리디렉션 URI 준비 (배포 후 Railway URL로 업데이트)

## 🚀 Railway 배포 단계

### 1단계: Railway 프로젝트 생성

1. [Railway](https://railway.app/) 접속 및 로그인
2. **New Project** 클릭
3. **Deploy from GitHub repo** 선택
4. GitHub 저장소 선택
5. **Root Directory**를 `server`로 설정

### 2단계: 환경 변수 설정

Railway 대시보드에서 **Variables** 탭으로 이동하여 다음 변수들을 추가:

#### 필수 환경 변수

```env
# MongoDB 연결 문자열 (MongoDB Atlas에서 복사)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/site_dash?retryWrites=true&w=majority

# JWT 토큰 시크릿 (랜덤한 긴 문자열)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# 세션 시크릿 (랜덤한 긴 문자열)
SESSION_SECRET=your_session_secret_here_make_it_long_and_random

# 프론트엔드 URL (GitHub Pages)
FRONTEND_URL=https://ggnu11.github.io/site-dash

# 백엔드 URL (Railway가 제공하는 URL, 배포 후 업데이트)
BACKEND_URL=https://your-app-name.railway.app

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# 프로덕션 환경 설정
NODE_ENV=production
```

#### Railway 자동 제공 변수

- `PORT` - Railway가 자동으로 할당 (설정 불필요)

### 3단계: Google OAuth 리디렉션 URI 업데이트

1. Railway 배포 완료 후 제공되는 URL 확인 (예: `https://your-app-name.railway.app`)
2. [Google Cloud Console](https://console.cloud.google.com/) 접속
3. **API 및 서비스** > **사용자 인증 정보**로 이동
4. OAuth 클라이언트 ID 편집
5. **승인된 리디렉션 URI**에 추가:
   ```
   https://your-app-name.railway.app/api/auth/google/callback
   ```
6. 저장
7. Railway 환경 변수에서 `BACKEND_URL` 업데이트

### 4단계: 배포 확인

1. Railway 대시보드에서 **Deployments** 탭 확인
2. 배포 로그 확인 (에러가 없는지 확인)
3. **Settings** > **Domains**에서 제공되는 URL 확인
4. 브라우저에서 `https://your-app-name.railway.app` 접속
5. `{"message":"Site Dash API Server"}` 메시지가 표시되면 성공

### 5단계: 프론트엔드 환경 변수 업데이트

프론트엔드 프로젝트의 `.env` 파일에 Railway 백엔드 URL 추가:

```env
VITE_API_URL=https://your-app-name.railway.app/api
```

프론트엔드를 다시 빌드하고 배포:

```bash
pnpm run build
pnpm run deploy
```

## 🔧 문제 해결

### 배포 실패

- **로그 확인**: Railway 대시보드의 **Deployments** > **View Logs**에서 에러 확인
- **환경 변수 확인**: 모든 필수 환경 변수가 설정되었는지 확인
- **MongoDB 연결 확인**: MongoDB Atlas의 네트워크 액세스 설정 확인

### CORS 오류

- `FRONTEND_URL` 환경 변수가 정확한지 확인
- 프론트엔드 URL에 슬래시(`/`)가 없는지 확인

### Google OAuth 오류

- `BACKEND_URL`이 Railway에서 제공하는 URL과 일치하는지 확인
- Google Cloud Console의 리디렉션 URI가 정확한지 확인
- `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET`이 올바른지 확인

### 데이터베이스 연결 오류

- MongoDB Atlas의 연결 문자열이 올바른지 확인
- 데이터베이스 사용자 이름과 비밀번호가 올바른지 확인
- 네트워크 액세스에서 Railway의 IP가 허용되었는지 확인 (또는 `0.0.0.0/0` 사용)

## 📝 참고사항

- Railway는 무료 플랜에서 월 500시간 제공
- MongoDB Atlas는 무료 플랜(M0) 제공
- 프로덕션 환경에서는 강력한 `JWT_SECRET`과 `SESSION_SECRET` 사용 권장
- 환경 변수는 Railway 대시보드에서 쉽게 수정 가능

## 🔗 유용한 링크

- [Railway 문서](https://docs.railway.app/)
- [MongoDB Atlas 문서](https://docs.atlas.mongodb.com/)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)

