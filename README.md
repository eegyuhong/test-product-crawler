# Product Crawler Dashboard

크롤러 테스트를 위한 대시보드와 API 서비스입니다. Playwright를 활용한 웹 크롤링 기능과 실시간 모니터링이 가능한 대시보드를 제공합니다.

## 기술 스택

- [Next.js](https://nextjs.org) - React 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - UI 컴포넌트 라이브러리
- [Playwright](https://playwright.dev/) - 웹 크롤링 및 자동화
- [Docker](https://www.docker.com/) - 컨테이너화 및 배포
- [Railway](https://railway.app/) - 클라우드 배포 플랫폼

## 주요 기능

- 웹 크롤링 API 엔드포인트
- 실시간 크롤링 상태 모니터링
- 크롤링 결과 데이터 시각화
- 크롤링 작업 스케줄링

## 시작하기

### 로컬 개발 환경

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start
```

서버 실행 후 [http://localhost:3000](http://localhost:3000)에서 대시보드를 확인할 수 있습니다.

```

## 아키텍처 특이사항

- Playwright Chromium 사용으로 크롤러 용량 최적화
- Railway 배포를 위한 Docker 컨테이너화
- 로컬 개발 시에는 Docker 없이 직접 실행 가능

## 배포 (Docker 환경 (배포용))

이 프로젝트는 Railway를 통해 자동 배포됩니다.

- GitHub 저장소와 Railway가 연동되어 있어 자동 배포가 구성되어 있습니다.
- `main` 브랜치에 push하면 자동으로 배포가 트리거됩니다.
- Railway는 프로젝트의 Dockerfile을 감지하여 자동으로 컨테이너를 빌드하고 배포합니다.

배포 상태는 Railway 대시보드에서 실시간으로 확인할 수 있습니다.
