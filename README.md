# Site Dash

## 🚀 GitHub Pages 배포 방법

### 1. 사전 준비

1. **환경 변수 설정** (선택사항)
   - 프로덕션 API URL이 필요한 경우 `.env` 파일 생성:
   ```bash
   VITE_API_URL=https://your-api-url.com/api
   ```

2. **GitHub 저장소 확인**
   - 저장소 이름: `site-dash`
   - 배포 URL: `https://ggnu11.github.io/site-dash/`

### 2. 배포 실행

```bash
# 빌드 및 배포 (한 번에 실행)
pnpm run deploy
```

또는 단계별로:

```bash
# 1. 프로젝트 빌드
pnpm run build

# 2. GitHub Pages에 배포
pnpm run deploy
```

### 3. GitHub 저장소 설정 확인

1. GitHub 저장소로 이동: `https://github.com/ggnu11/site-dash`
2. **Settings** → **Pages** 메뉴로 이동
3. **Source**를 `gh-pages` 브랜치로 설정
4. **Save** 클릭

### 4. 배포 확인

- 배포 완료 후 몇 분 후 접속: `https://ggnu11.github.io/site-dash/`
- 배포 상태는 GitHub Actions 또는 저장소의 Pages 설정에서 확인 가능

### 📝 참고사항

- `gh-pages` 브랜치는 자동으로 생성/업데이트됩니다
- 빌드된 파일은 `dist` 폴더에서 `gh-pages` 브랜치로 배포됩니다
- SPA 라우팅을 위해 `404.html` 파일이 자동으로 포함됩니다
- Base 경로는 `/site-dash/`로 설정되어 있습니다 (`vite.config.ts`)

### 🔧 문제 해결

**배포 후 404 에러가 발생하는 경우:**
- GitHub 저장소의 Pages 설정에서 `gh-pages` 브랜치가 선택되어 있는지 확인
- `vite.config.ts`의 `base` 경로가 저장소 이름과 일치하는지 확인

**API 연결 오류:**
- `.env` 파일에 `VITE_API_URL` 환경 변수를 설정했는지 확인
- 프로덕션 API 서버가 CORS를 허용하는지 확인
