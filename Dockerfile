# Playwright의 공식 Ubuntu 이미지 사용
FROM mcr.microsoft.com/playwright:v1.53.0-jammy

# 작업 디렉토리 설정
WORKDIR /app

# Node.js 18 설치 (Playwright 이미지에 포함되어 있지만 확실히 하기 위해)
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# pnpm 설치
RUN npm install -g pnpm

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# Playwright 브라우저 설치 (이미 설치되어 있지만 확실히 하기 위해)
RUN pnpm exec playwright install chromium

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN pnpm build

# 포트 노출
EXPOSE 8080

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=8080

# 애플리케이션 실행
CMD ["pnpm", "start"] 