# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 수 있는 가이드를 제공합니다.

## 프로젝트 개요

"Our Own"은 커플 전용 라이프 매니저 앱으로, NestJS, TypeScript, MySQL/Prisma, Redis로 구축되었습니다. 커플이 할 일, 메모, 버킷리스트, 기념일 등의 개인적인 콘텐츠를 비공개 공간에서 공유할 수 있습니다.

## 개발 명령어

```bash
# 개발
npm run start:dev        # 핫 리로드가 포함된 개발 서버 시작
npm run start:debug      # 디버그 모드로 시작

# 빌드 및 프로덕션
npm run build           # 애플리케이션 빌드
npm run start:prod      # 프로덕션 빌드 실행

# 코드 품질
npm run lint            # ESLint 자동 수정
npm run format          # Prettier 포맷팅

# 테스트
npm run test            # 단위 테스트 실행
npm run test:watch      # 워치 모드로 테스트 실행
npm run test:cov        # 커버리지 포함 테스트 실행
npm run test:e2e        # E2E 테스트 실행
```

## 데이터베이스 명령어

```bash
# Prisma 작업
npx prisma generate     # 스키마 변경 후 Prisma 클라이언트 생성
npx prisma migrate dev  # 마이그레이션 적용
npx prisma studio      # Prisma Studio 열기
```

## 아키텍처 개요

### 핵심 스택

- **프레임워크**: NestJS with TypeScript
- **데이터베이스**: MySQL with Prisma ORM
- **캐싱**: Redis (세션 및 임시 데이터용)
- **스토리지**: 커스텀 업로더 서비스를 통한 AWS S3
- **알림**: APNS 및 Expo SDK 통합
- **실시간**: Server-Sent Events (SSE)

### 주요 모듈

- **auth**: OAuth (카카오/구글), JWT 전략, Redis 세션
- **couple**: 고유한 사용자 코드를 통한 관계 관리
- **todo/memo/list**: 커플 간 공유 콘텐츠
- **notification**: APNS/Expo 발신자를 통한 푸시 알림 큐
- **sse**: 커플 사용자 간 실시간 업데이트
- **uploader**: ImageUploader 인터페이스를 통한 S3 파일 업로드

### 데이터베이스 설계

- **User**: 프로필, OAuth 데이터, 고유한 페어링 `code` 저장
- **Couple**: 두 사용자를 연결하고 공유 데이터(기념일, 위젯) 저장
- **공유 콘텐츠**: Todo, Memo, ListContent 모델이 커플과 작성자를 모두 참조
- **Notification**: NotificationType enum이 있는 큐 시스템

### 인증 플로우

1. OAuth 제공자가 User 레코드 생성/업데이트
2. JWT 토큰에 사용자 ID와 커플 정보 포함
3. Guards가 공유 기능에 대한 커플 관계 검증
4. `@CurrentUserId()` 데코레이터가 JWT에서 사용자 추출

### 커플 연결 시스템

- 사용자는 User.code 필드에 저장된 고유 코드를 통해 연결
- 커플 관계가 공유 기능을 활성화
- 연결 해제 시 캐스케이드 삭제로 공유 콘텐츠 제거

### 실시간 아키텍처

- SSE가 커플 사용자 간 라이브 업데이트 제공
- 알림 시스템이 푸시 알림을 통해 오프라인 사용자 처리
- Redis가 SSE 연결 및 세션 상태 관리

### 에러 핸들링 아키텍처

- **GlobalExceptionFilter**: 모든 예외를 중앙에서 처리하는 통합 에러 핸들링 시스템
- **에러 추적**: 고유한 에러 ID로 각 예외 추적 가능
- **환경별 처리**: 개발/프로덕션 환경에 따른 다른 에러 메시지 제공
- **상세 로깅**: 요청 정보, 스택 트레이스, 사용자 정보 포함한 상세한 에러 로그
- **자동 변환**: Prisma 에러를 적절한 HTTP 상태 코드로 자동 변환

## 환경 변수

필수 설정:

- `DATABASE_URL`: MySQL 연결 문자열
- `JWT_SECRET`: JWT 서명 키
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis 설정
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`: S3 설정
- 카카오 및 구글 제공자를 위한 OAuth 자격 증명

## 코드 구조 및 패턴

### 서비스 레이어

- 모든 서비스는 try-catch 블록 없이 구현되어 있음 (GlobalExceptionFilter가 처리)
- 비즈니스 로직 예외는 명시적인 HttpException으로 처리
- Prisma를 직접 사용하여 데이터베이스 작업 수행
- 복잡한 로직은 Helper 클래스로 분리 (예: AuthHelper)

### Guard 시스템

- **JwtAuthGuard**: JWT 토큰 검증
- **CoupleAuthGuard**: 커플 관계 검증이 필요한 엔드포인트에 적용
- `@CurrentUserId()` 데코레이터로 인증된 사용자 ID 추출

### 파일 업로드

- **ImageUploader 인터페이스**: 파일 업로드 추상화
- **S3UploaderService**: AWS S3 구현체
- 의존성 주입을 통한 업로더 교체 가능

## API 문서

Swagger UI가 `/api` 엔드포인트에서 제공됩니다. OAuth에서 발급된 JWT를 사용한 Bearer 토큰 인증을 사용합니다.

## 개발 시 주의사항

### 에러 처리

- 서비스 메서드에서 try-catch 사용 금지 (GlobalExceptionFilter가 처리)
- 비즈니스 로직 에러는 HttpException으로 명시적 처리
- 에러 로깅은 GlobalExceptionFilter에서 자동 처리

### 새로운 모듈 추가 시

1. 서비스는 try-catch 없이 구현
2. 복잡한 로직은 Helper 클래스로 분리
3. 커플 권한이 필요하면 CoupleAuthGuard 적용
4. 파일 업로드가 필요하면 ImageUploader 인터페이스 사용
