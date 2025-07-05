## 🔗 배포 주소

https://USERNAME.github.io/keinsrex-front/

> 정적 HTML 기반 GitHub Pages에 배포됨 (`next export`)



## 🖋️ 폰트 라이선스

- 본 프로젝트는 `KCC은영체`를 사용합니다.
- 출처: [https://noonnu.cc](https://noonnu.cc/font_page/907)
- 라이선스: CCL 저작자 표시 (상업적 이용 가능, 변경 가능, 출처 표시 필수)


# 🔥 base (Next.js + Tailwind 기본 베이스)

Next.js 기반 정적 사이트를 빠르고 안정적으로 시작하기 위한 **기본 베이스 프로젝트**입니다.  
최신 안정 버전만 사용하며, **3~4개의 정적 페이지로 구성된 프로젝트**를 위한 사전 지침입니다.

---

## ✅ 사용 스택

- **Next.js**: 15.3.4  
- **React**: 18.3.1  
- **Tailwind CSS**: 3.4.1  
- **TypeScript**: 5.4.5  
- **PostCSS / Autoprefixer**: 안정 버전  
- **ESLint**: 8.57.0 (`eslint-config-next`)

---

## 📦 설치 및 초기 세팅

```bash
# 1. 필수 패키지 설치
npm install next@15.3.4 react@18.3.1 react-dom@18.3.1

# 2. Tailwind + PostCSS 설치 및 설정
npm install -D tailwindcss@3.4.1 postcss@8.4.38 autoprefixer@10.4.19
npx tailwindcss init -p

# 3. TypeScript + 타입 정의 설치
npm install -D typescript@5.4.5 @types/react@18.2.64 @types/react-dom@18.2.17

# 4. ESLint 설정
npm install -D eslint@8.57.0 eslint-config-next@15.3.4
```

---

## 📁 필수 디렉토리 및 파일 생성

```bash
# 디렉토리 및 파일 생성
mkdir -p src/app
touch src/app/layout.tsx src/app/page.tsx src/app/globals.css
touch next.config.ts tsconfig.json
```

---

## 💡 주요 파일 구조

```
base/
├── public/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── next.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
```

---

## ✍️ globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ✍️ tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

---

## ✍️ next.config.ts

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

---

## ✍️ tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

✅ 이 내용 전체 복사해서 `README.md`에 붙여 넣으면 끝이야.