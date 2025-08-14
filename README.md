# 🚀 Our Own - 엔터프라이즈급 커플 매니저 플랫폼

> **기술적 도전과 비즈니스 가치를 함께 고려한 프로젝트**  
> 확장 가능한 아키텍처, 실시간 통신, 대용량 처리를 고려한 백엔드 설계

## 📋 프로젝트 개요

**Our Own**은 커플 전용 라이프 매니저로, **월 10,000+ 커플이 사용할 수 있는 확장 가능한 플랫폼**을 목표로 설계된 프로젝트입니다. 단순한 CRUD 애플리케이션을 넘어서, **실제 서비스 운영에 필요한 모든 기술적 요소**를 고려하여 개발했습니다.

### 🎯 기술적 목표

- **확장 가능한 아키텍처**: 사용자 증가에 대응할 수 있는 모듈화된 설계
- **실시간 통신**: 커플 간 즉시 동기화되는 UX 제공
- **안정성**: 글로벌 예외 처리, 타입 안전성, 테스트 가능한 구조
- **보안**: OAuth 2.0, JWT, 데이터 검증, 권한 관리 시스템

## 🏗️ 아키텍처 설계

### 핵심 기술 스택

```
Backend:    NestJS + TypeScript + Prisma
Database:   MySQL (트랜잭션 안정성) + Redis (캐싱 & 세션)
Real-time:  Server-Sent Events (확장성 고려)
Auth:       OAuth 2.0 (카카오/구글) + JWT
Cloud:      AWS S3 (파일 저장) + APNS (푸시 알림)
```

### 🎨 설계 원칙 및 패턴

#### 1. **Repository 패턴 + 의존성 주입**

```typescript
// 데이터 접근 계층 완전 분리, 테스트 용이성 극대화
@Injectable()
export class CoupleRepository {
  async findById(id: number) {
    /* Prisma 추상화 */
  }
}

@Injectable()
export class CoupleService {
  constructor(private repository: CoupleRepository) {}
}
```

#### 2. **글로벌 예외 처리 시스템**

```typescript
// 모든 에러를 중앙에서 처리, 고유 에러 ID로 추적
@Catch()
export class GlobalExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const errorId = randomUUID();
    // 환경별 에러 메시지, 상세 로깅, 자동 상태 코드 변환
  }
}
```

#### 3. **타입 안전한 환경변수 관리**

```typescript
// 런타임 환경변수 검증, 타입 변환, IDE 자동완성 지원
@Injectable()
export class ConfigService {
  get jwtSecret(): string {
    return this.validateString('JWT_SECRET');
  }
  get dbPort(): number {
    return this.validatePort('DB_PORT');
  }
}
```

#### 4. **권한 기반 접근 제어**

```typescript
// Guard 시스템으로 커플 관계 자동 검증
@UseGuards(JwtAuthGuard, CoupleAuthGuard)
@Get('/shared-data')
async getSharedData(@CurrentUserId() userId: number) {}
```

## 🔧 해결한 기술적 챌린지

### 1. **실시간 동기화 문제**

**문제**: 커플 간 데이터 실시간 동기화 필요  
**해결**: Server-Sent Events + Redis 활용

- WebSocket 대비 낮은 자원 사용량
- 브라우저 자동 재연결 지원
- Redis 채널로 서버 간 메시지 브로드캐스트

### 2. **확장성 문제**

**문제**: 사용자 증가 시 성능 저하 방지  
**해결**: 계층화된 아키텍처 + 캐싱 전략

- Repository 패턴으로 데이터 접근 최적화
- Redis 캐싱으로 DB 부하 감소
- 모듈별 분리로 마이크로서비스 전환 용이

### 3. **코드 품질 문제**

**문제**: 장기적 유지보수 가능한 코드베이스 구축  
**해결**: 엄격한 타입 시스템 + 패턴 적용

- TypeScript strict 모드 + ESLint 규칙
- Repository, Service, Utils 계층 분리
- 순수함수 기반 유틸리티 설계

### 4. **보안 문제**

**문제**: 사용자 데이터 보호 및 인증/인가  
**해결**: 다중 보안 계층

- OAuth 2.0 + JWT 이중 인증
- Guard 시스템으로 API 레벨 권한 검증
- Prisma ORM으로 SQL Injection 방지

## 📊 핵심 성과 지표

### 기술적 성과

- **타입 안전성**: 100% TypeScript, 런타임 에러 방지
- **코드 품질**: ESLint 0 error, 일관된 코딩 컨벤션
- **테스트 용이성**: Repository 패턴으로 의존성 분리
- **확장성**: 모듈러 아키텍처로 기능별 독립 배포 가능

### 비즈니스 임팩트

- **사용자 경험**: 실시간 동기화로 seamless UX 제공
- **운영 효율성**: 글로벌 예외 처리로 에러 추적 자동화
- **개발 생산성**: 타입 시스템으로 IDE 지원 극대화
- **보안 신뢰성**: OAuth + Guard 시스템으로 데이터 보호

## 🛠️ 개발 하이라이트

### 설계한 주요 시스템

#### 1. **커플 매칭 시스템**

```typescript
// 유니크 코드 기반 안전한 커플 연결
export class CoupleService {
  async connectCouple(userCode: string, partnerCode: string) {
    // 중복 연결 방지 + 트랜잭션 처리
  }
}
```

#### 2. **실시간 알림 시스템**

```typescript
// SSE + APNS 하이브리드 알림
export class NotificationService {
  async sendRealtime(userId: number, type: string, data: any) {
    await this.sse.send(userId, { type, data });
    await this.push.sendToDevice(userToken, message);
  }
}
```

#### 3. **파일 업로드 추상화**

```typescript
// 인터페이스 기반 교체 가능한 업로더
interface ImageUploader {
  upload(file: File, folder: string): Promise<UploadResult>;
}

@Injectable()
export class S3UploaderService implements ImageUploader {
  // AWS S3 구현체
}
```

## 📈 확장 가능성

### 마이크로서비스 전환 준비

- **모듈별 독립성**: 각 도메인이 독립된 Repository 소유
- **API 표준화**: 통일된 응답 구조 (`formatApiResponse`)
- **설정 외부화**: ConfigService로 환경별 설정 분리

### 성능 최적화 여지

- **DB 최적화**: Repository 패턴으로 쿼리 중앙 관리
- **캐싱 전략**: Redis 활용한 L2 캐시 구현
- **CDN 연동**: S3 + CloudFront 정적 자원 최적화

## 🎓 학습 및 성장 포인트

### 습득한 기술

- **NestJS 고급 패턴**: Decorator, Guard, Interceptor, Pipe
- **데이터베이스 설계**: 정규화, 관계 설정, 인덱스 최적화
- **실시간 통신**: SSE, WebSocket 비교 분석 및 선택
- **클라우드 서비스**: AWS S3, Redis, 푸시 알림 연동

### 개발 방법론

- **테스트 주도 개발**: Repository 패턴으로 단위 테스트 용이성 확보
- **코드 리뷰**: ESLint, Prettier 자동화로 코드 품질 관리
- **문서화**: CLAUDE.md를 통한 아키텍처 의사결정 기록
- **버전 관리**: 의미 있는 커밋 메시지와 단계별 리팩토링

## 🔗 프로젝트 링크

- **API 문서**: https://duo.yeol.store/api
- **ERD**: [데이터베이스 설계도](README.md#📌-erd)
- **아키텍처 가이드**: [CLAUDE.md](CLAUDE.md)

---

> **💡 Key Message**: 이 프로젝트는 "기능 구현"을 넘어서 **"실제 서비스 운영에 필요한 모든 기술적 요소"**를 고려하여 설계된 엔터프라이즈급 백엔드 시스템입니다. 확장성, 안정성, 보안성을 모두 고려한 아키텍처를 통해 실무에서 바로 활용 가능한 기술 역량을 보여줍니다.
