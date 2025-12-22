# Site Dash Backend

Node.js + Express + MongoDB 기반 백엔드 서버

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sitedash
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001

# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### Google OAuth 설정 방법

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **사용자 인증 정보**로 이동
4. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션** 선택
6. **승인된 리디렉션 URI**에 다음을 추가:
   - 개발 환경: `http://localhost:5001/api/auth/google/callback`
   - 프로덕션 환경: `https://your-domain.com/api/auth/google/callback`
7. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 `.env` 파일에 추가

⚠️ **중요**: Redirect URI는 정확히 일치해야 합니다. `BACKEND_URL` 환경 변수와 일치하는지 확인하세요.

### 3. MongoDB 설치 및 실행

```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# MongoDB Community Edition을 다운로드하여 설치하세요
```

### 4. 서버 실행

```bash
# 개발 모드 (nodemon)
npm run dev

# 프로덕션 모드
npm start
```

## 📡 API 엔드포인트

### 인증

- `GET /api/auth/google` - Google OAuth 로그인 시작
- `GET /api/auth/google/callback` - Google OAuth 콜백 (자동 처리)
- `GET /api/auth/me` - 현재 사용자 정보

### 사이트 관리

- `GET /api/sites` - 사이트 목록 조회
- `POST /api/sites` - 새 사이트 생성
- `PUT /api/sites/:id` - 사이트 수정
- `DELETE /api/sites/:id` - 사이트 삭제

## 🌐 배포

### MongoDB Atlas (클라우드)

1. [MongoDB Atlas](https://www.mongodb.com/atlas) 계정 생성
2. 클러스터 생성
3. 연결 문자열을 `MONGODB_URI`에 설정

### Railway 배포 (권장)

Railway는 간단하고 빠른 배포를 제공합니다.

#### 1. Railway 계정 생성 및 프로젝트 생성

1. [Railway](https://railway.app/)에 접속하여 계정 생성
2. **New Project** 클릭
3. **Deploy from GitHub repo** 선택 (또는 **Empty Project** 선택 후 수동 배포)

#### 2. GitHub 저장소 연결 (선택사항)

- GitHub 저장소를 연결하면 자동 배포가 가능합니다
- `server` 폴더를 루트로 설정하거나, Railway에서 **Root Directory**를 `server`로 설정

#### 3. 환경 변수 설정

Railway 대시보드에서 **Variables** 탭으로 이동하여 다음 환경 변수를 추가:

```env
# Railway가 자동으로 제공 (설정 불필요)
PORT=5000

# 필수 환경 변수
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/site_dash?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
SESSION_SECRET=your_session_secret_here

# 프론트엔드 URL (GitHub Pages URL)
FRONTEND_URL=https://ggnu11.github.io/site-dash

# 백엔드 URL (Railway가 제공하는 도메인)
# 배포 후 Railway에서 제공하는 URL로 설정
BACKEND_URL=https://your-app-name.railway.app

# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### 4. Google OAuth 리디렉션 URI 업데이트

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** > **사용자 인증 정보**로 이동
3. OAuth 클라이언트 ID 편집
4. **승인된 리디렉션 URI**에 Railway URL 추가:
   ```
   https://your-app-name.railway.app/api/auth/google/callback
   ```
5. 저장

#### 5. 배포 확인

1. Railway 대시보드에서 **Deployments** 탭 확인
2. 배포가 완료되면 **Settings** > **Domains**에서 제공되는 URL 확인
3. `https://your-app-name.railway.app` 접속하여 API 서버 확인

#### 6. 프론트엔드 환경 변수 업데이트

프론트엔드의 `.env` 파일에 Railway 백엔드 URL 추가:

```env
VITE_API_URL=https://your-app-name.railway.app/api
```

#### Railway CLI 사용 (선택사항)

```bash
# Railway CLI 설치
npm i -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
railway init

# 환경 변수 설정
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
railway variables set FRONTEND_URL=https://ggnu11.github.io/site-dash
railway variables set BACKEND_URL=https://your-app-name.railway.app
railway variables set GOOGLE_CLIENT_ID=your_google_client_id
railway variables set GOOGLE_CLIENT_SECRET=your_google_client_secret

# 배포
railway up
```

### Heroku 배포

```bash
# Heroku CLI 설치 후
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Vercel 배포

1. `vercel.json` 파일 생성:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ]
}
```

2. 환경변수 설정:

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```
