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
```

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

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
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
