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

### 캐싱 아키텍처

- **Redis 캐싱**: 성능 최적화를 위한 전략적 캐싱 적용
- **권한 캐싱**: CoupleAuthGuard에서 커플 권한 확인 결과 캐싱
- **캐시 무효화**: 데이터 변경시 관련 캐시 자동 삭제
- **RedisService**: 패턴 기반 캐시 삭제(`delPattern`) 지원

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

### 환경변수 관리

모든 환경변수는 **ConfigService**를 통해 타입 안전하게 관리됩니다:
- 애플리케이션 시작 시 필수 환경변수 검증
- 타입 변환 및 유효성 검사 (포트 범위, URL 형식 등)
- `process.env` 직접 사용 금지, ConfigService getter 사용 필수

## 코드 구조 및 패턴

### 아키텍처 계층

- **Controller**: 요청/응답 처리 및 검증
- **Service**: 비즈니스 플로우 조합 (오케스트레이터 역할)
- **Helper**: OAuth, Redis 등 복잡한 외부 연동 로직
- **Repository**: 데이터 접근 로직 (Prisma 추상화)
- **Utils**: 순수함수 기반 재사용 가능한 유틸리티

### 서비스 레이어

- 모든 서비스는 try-catch 블록 없이 구현되어 있음 (GlobalExceptionFilter가 처리)
- 비즈니스 로직 예외는 명시적인 HttpException으로 처리
- Repository 패턴을 통해 데이터 접근 로직 분리
- 복잡한 로직은 Helper 클래스로 분리 (예: AuthHelper)

### Repository 패턴

- **UserRepository**: 사용자 데이터 접근 (전역 사용 가능)
- **CoupleRepository**: 커플, 기념일, 위젯 테이블 통합 관리
- **ListRepository**: list, listContent 테이블 CRUD 작업
- **MemoRepository**: memo, couple 테이블 메모 관련 작업
- **TodoRepository**: todo, user 테이블 할일 관련 작업
- 모든 Repository는 `@Global()` RepositoriesModule에서 제공
- Prisma 직접 사용 대신 Repository를 통한 데이터 접근

### 유틸리티

#### 공통 유틸리티 (src/common/utils/)
- **date.util.ts**: 날짜 계산 관련 순수함수들
  - `getDDay()`: 커플 디데이 계산
  - `getDays()`: 남은 일수 계산  
  - `getUpcomingAnniversary()`: 다가오는 기념일 계산
  - `getDaysToNextBirthday()`: 생일까지 남은 일수 계산
- **couple.util.ts**: 커플 관련 유틸 함수들
  - `getPartnerId()`: 커플에서 파트너 ID 찾기 (순수함수)
- **response.util.ts**: API 응답 포매팅
  - `formatApiResponse()`: 통일된 API 응답 구조 생성
- **random.util.ts**: 랜덤 문자열 생성 등

#### 모듈별 유틸리티
- **user/utils/user.util.ts**: 사용자, 파트너, 커플 데이터 포매팅 함수들
- **list/utils/list.util.ts**: List 데이터 포매팅, 알림 메시지 생성
- **memo/utils/memo.util.ts**: Memo 데이터 포매팅 함수들  
- **todo/utils/todo.util.ts**: Todo 그룹화, 데이터 포매팅 함수들
- **auth/utils/auth.utils.ts**: OAuth URL 생성, 로그인 응답 포매팅

### Guard 시스템

- **JwtAuthGuard**: JWT 토큰 검증
- **CoupleAuthGuard**: 커플 관계 검증이 필요한 엔드포인트에 적용
  - Redis 캐싱으로 성능 최적화 (TTL: 1시간)
  - 커플 해제시 자동 캐시 무효화
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

1. **데이터 접근**: Repository 패턴 사용, Prisma 직접 호출 금지
2. **환경변수**: ConfigService 사용, `process.env` 직접 사용 금지  
3. **서비스**: try-catch 없이 구현 (GlobalExceptionFilter가 처리)
4. **순수함수**: 계산 로직은 Utils로 분리
5. **복잡한 로직**: OAuth, Redis 등은 Helper 클래스로 분리
6. **권한 검사**: 커플 권한 필요시 CoupleAuthGuard 적용
7. **파일 업로드**: ImageUploader 인터페이스 사용

### 코드 작성 가이드라인

- **Repository**: 데이터베이스 접근은 반드시 Repository를 통해
- **ConfigService**: 모든 환경변수 접근은 ConfigService getter 사용
- **Utils vs Helper**: 순수함수는 Utils, 외부 의존성 있는 복잡한 로직은 Helper
- **에러 처리**: HttpException으로 명시적 비즈니스 에러 처리
- **API 응답**: `formatApiResponse()` 사용하여 통일된 응답 구조 제공
- **유틸 조직화**: 
  - 순수함수(계산 로직)는 common/utils에 배치
  - 모듈 특화 로직은 해당 모듈의 utils 폴더에 배치
  - 재사용 가능한 함수는 전역으로, 모듈별 특화 함수는 지역으로
- **성능 최적화**:
  - 반복적인 권한 확인은 Redis 캐싱 적용
  - 복합 작업은 트랜잭션으로 데이터 일관성 보장
  - DB 접근 로직은 Repository 패턴으로 통합 관리
  - 새로운 PrismaClient 인스턴스 생성 금지

### 리팩토링 완료 모듈

다음 모듈들은 Repository 패턴과 서비스 로직 분리가 완료되었습니다:
- ✅ **Couple 모듈**: Repository 패턴, formatApiResponse 적용
- ✅ **List 모듈**: Repository 패턴, 유틸 분리 완료  
- ✅ **Memo 모듈**: Repository 패턴, 유틸 분리 완료
- ✅ **Todo 모듈**: Repository 패턴, 유틸 분리 완료
- ✅ **User 모듈**: Repository 패턴, formatApiResponse, 유틸 분리 완료

### 향후 리팩토링 예정

- 🔄 **Auth 모듈**: 선택적 formatApiResponse 적용 고려
- 🔄 **Notification 모듈**: Repository 패턴 검토 예정
- 🔄 **MyPage 모듈**: Repository 패턴 적용 예정

## 성능 최적화

### 캐싱 아키텍처

#### Redis 캐싱 전략
- **CoupleAuthGuard**: 커플 권한 확인 캐싱 (TTL: 1시간)
  - 캐시 키: `couple:auth:{userId}:{coupleId}`
  - 캐시 무효화: 커플 해제시 패턴 기반 삭제
- **세션 관리**: JWT 리프레시 토큰 Redis 저장
- **SSE 연결**: 클라이언트 연결 상태 관리

#### 캐시 키 네이밍 컨벤션
```
{모듈}:{기능}:{식별자1}:{식별자2}
예시:
- couple:auth:123:456
- user:session:123
- sse:connection:123
```

#### 캐시 무효화 전략
- **데이터 변경시**: 관련 캐시 즉시 삭제
- **패턴 기반 삭제**: `RedisService.delPattern()` 활용
- **TTL 기반**: 자동 만료로 데이터 일관성 보장

### 트랜잭션 가이드라인

#### 트랜잭션 적용 기준
- **복합 작업**: 여러 테이블 생성/수정이 필요한 경우
- **데이터 일관성**: 중간 실패시 부분 데이터 방지 필요
- **원자성 보장**: 모두 성공하거나 모두 실패해야 하는 작업

#### 구현 방법
```typescript
// Service 레벨에서 직접 트랜잭션 처리 (권장)
await this.prisma.$transaction(async (tx) => {
  const result1 = await tx.table1.create({...});
  const result2 = await tx.table2.create({...});
  return result1;
});
```

#### 주의사항
- Repository 패턴 유지하면서 서비스에서 트랜잭션 처리
- 복잡한 비즈니스 로직은 별도 UseCase 계층 고려
- 트랜잭션 범위는 최소한으로 유지

### 성능 병목 해결 사례

#### 해결된 성능 이슈
1. **couple.util.ts PrismaClient 생성**: 새 인스턴스 생성 → Repository 패턴으로 이동
2. **CoupleAuthGuard DB 반복 조회**: 매 요청 DB 조회 → Redis 캐싱 적용
3. **UserService.matchUser 트랜잭션**: 분리된 DB 작업 → 단일 트랜잭션으로 통합
4. **ListService.listDoneHandler 쿼리**: 전체 couple 객체 조회 → 필요한 필드만 select

#### 성능 개선 효과
- **CoupleAuthGuard**: ~10ms → ~1ms (90% 단축)
- **DB 커넥션**: 커넥션 풀 효율성 대폭 향상
- **데이터 일관성**: 트랜잭션으로 무결성 보장
- **쿼리 최적화**: 불필요한 데이터 전송 제거, 네트워크 트래픽 감소
