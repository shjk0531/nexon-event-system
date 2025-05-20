# 실행 방법



## Docker로 실행 


```bash
docker-compose up -d --build
```



---
## 인증 (Auth) API

### 1. 로그인

* **Method:** `POST`
* **Endpoint:** `/api/auth/auth/login`
* **설명:** 사용자 이메일과 비밀번호로 로그인합니다. 성공 시 액세스 토큰을 응답 본문에 반환하고, HTTP-only 쿠키(`refresh_token`)로 리프레시 토큰을 설정합니다.
* **권한:** `PUBLIC`
* **Request Body:**

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
* **Response (200 OK):**

  ```json
  {
    "access_token": "your_access_token"
  }
  ```
* **Response Headers:**

  * `Set-Cookie`: `refresh_token=your_refresh_token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=...`
* **오류 응답:**

  * `401 Unauthorized`: 잘못된 인증 정보

### 2. 로그아웃

* **Method:** `POST`
* **Endpoint:** `/api/auth/auth/logout`
* **설명:** 인증된 사용자의 리프레시 토큰을 무효화하고, 브라우저에 저장된 쿠키를 제거합니다.
* **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`
* **Request Headers:**

  * `Authorization`: `Bearer your_access_token`
  * `Cookie`: `refresh_token=your_refresh_token`
* **Response (200 OK):**

  ```json
  {
    "message": "Logged out successfully"
  }
  ```
* **Response Headers:**

  * `Set-Cookie`: `refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
* **오류 응답:**

  * `401 Unauthorized`: 토큰이 없거나 유효하지 않은 경우

### 3. 리프레시 토큰 처리 (로직 설명)

* **API (Auth Service):** `POST /auth/refresh`
* **로직 흐름:**

  1. 클라이언트가 쿠키(`refresh_token`)를 포함해 요청
  2. 서버에서 쿠키를 조회 후 `JwtUtil.verify()`로 유효성 확인
  3. `AuthService.rotateTokens()`로 이전 토큰 사용 처리 후 새 액세스·리프레시 토큰 발급
  4. 새 리프레시 토큰을 `Set-Cookie`로 설정, 액세스 토큰을 응답 본문에 반환

---

## 사용자 (Users) API

모든 사용자 API는 JWT 인증(`AuthGuard('jwt')`) 및 역할 기반 권한 검사(`RolesGuard`)를 수행합니다. `@Public`으로 표시된 엔드포인트는 인증 없이 호출 가능합니다.

### 1. 일반 사용자 생성 (USER)

* **Method:** `POST`
* **Endpoint:** `/api/auth/users/user`
* **설명:** 일반 사용자 계정을 생성합니다.
* **권한:** `PUBLIC`
* **Request Body:**

  ```json
  {
    "email": "newuser@example.com",
    "password": "password123"
  }
  ```
* **Response (201 Created):**

  ```json
  {
    "email": "newuser@example.com",
    "role": "USER"
  }
  ```
* **오류 응답:**

  * `409 Conflict`: 이메일 중복

### 2. 운영자 생성 (OPERATOR)

* **Method:** `POST`
* **Endpoint:** `/api/auth/users/operator`
* **설명:** 운영자 계정을 생성합니다.
* **권한:** `PUBLIC`
* **Request Body / Response / 오류:** USER와 동일, `role`만 `OPERATOR`

### 3. 감사자 생성 (AUDITOR)

* **Method:** `POST`
* **Endpoint:** `/api/auth/users/auditor`
* **설명:** 감사자 계정을 생성합니다.
* **권한:** `PUBLIC`
* **Request Body / Response / 오류:** USER와 동일, `role`만 `AUDITOR`

### 4. 관리자 생성 (ADMIN)

* **Method:** `POST`
* **Endpoint:** `/api/auth/users/admin`
* **설명:** 관리자 계정을 생성합니다.
* **권한:** `PUBLIC`
* **Request Body / Response / 오류:** USER와 동일, `role`만 `ADMIN`

### 5. 특정 사용자 조회

* **Method:** `GET`
* **Endpoint:** `/api/auth/users/user/:id`
* **설명:** 특정 사용자 정보를 조회합니다.
* **권한:** `ADMIN`
* **Request Headers:** `Authorization: Bearer your_access_token`
* **Response (200 OK):**

  ```json
  {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```
* **오류 응답:**

  * `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### 6. 전체 사용자 목록 조회

* **Method:** `GET`
* **Endpoint:** `/api/auth/users/users`
* **설명:** 모든 사용자 목록을 조회합니다.
* **권한:** `ADMIN`
* **Response (200 OK):**

  ```json
  [ { "_id": "id1", "email": "user1@example.com", "role": "USER", ... }, ... ]
  ```
* **오류 응답:**

  * `401 Unauthorized`, `403 Forbidden`

### 7. 내 정보 조회

* **Method:** `GET`
* **Endpoint:** `/api/auth/users/me`
* **설명:** 로그인된 사용자의 정보를 조회합니다.
* **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`
* **Response / 오류:** 특정 사용자 조회와 동일 구조

### 8. 사용자 정보 수정

* **Method:** `PATCH`
* **Endpoint:** `/api/auth/users/user`
* **설명:** 본인의 정보를 수정합니다.
* **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`
* **Request Body (선택적 필드):**

  ```json
  { "email": "new@example.com", "password": "newpass" }
  ```
* **Response / 오류:** 수정된 사용자 객체, `401`/`404`

### 9. 특정 사용자 삭제

* **Method:** `DELETE`
* **Endpoint:** `/api/auth/users/user/:id`
* **설명:** 특정 사용자 계정을 삭제합니다.
* **권한:** `ADMIN`
* **Response (200 OK):** 삭제된 사용자 객체
* **오류 응답:** `401`, `403`, `404`

### 10. 내 계정 삭제

* **Method:** `DELETE`
* **Endpoint:** `/api/auth/users/me`
* **설명:** 본인의 계정을 삭제합니다.
* **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`
* **Response / 오류:** 삭제된 사용자 객체, `401`/`404`

---

## 이벤트 (Event) API (Event Server)

### 1. 이벤트 캘린더 조회

* **Method:** `GET`
* **Endpoint:** `/events/calendar?month=YYYY-MM`
* **설명:** 지정한 월의 일별 출석(claimed) 여부를 반환합니다.
* **Request Params:**

  * `month` (예: `2025-05`)
* **Response (200 OK):**

  ```json
  {
    "days": [
      { "date": "2025-05-01", "claimed": false },
      { "date": "2025-05-02", "claimed": true },
      ...
    ]
  }
  ```

### 2. 추천인 ID 조회

* **Method:** `GET`
* **Endpoint:** `/events/referrerId`
* **설명:** JWT 페이로드 기반으로 추천인 코드를 생성해 반환합니다.
* **Response (200 OK):**

  ```json
  "referrerCodeString"
  ```

### 3. 이벤트 생성

* **Method:** `POST`
* **Endpoint:** `/events`
* **설명:** 새로운 이벤트를 생성합니다.
* **Request Body (CreateEventDto):**

  ```json
  {
    "name": "5월 출석 이벤트",
    "type": "WEEKLY_ATTENDANCE",
    "startAt": "2025-05-01T00:00:00.000Z",
    "endAt": "2025-05-31T23:59:59.999Z",
    "isActive": true,
    "config": { "minCount": 3 }
  }
  ```
* **Response (200 OK):** 이벤트 객체(JSON)

### 4. 이벤트 목록 조회

* **Method:** `GET`
* **Endpoint:** `/events`
* **설명:** 모든 이벤트를 조회합니다.
* **Response (200 OK):** 이벤트 배열(JSON)

### 5. 이벤트 상세 조회

* **Method:** `GET`
* **Endpoint:** `/events/:id`
* **설명:** 특정 이벤트 상세 정보를 조회합니다.
* **Response (200 OK):** 이벤트 객체(JSON)
* **오류 응답:** `404 Not Found`

### 6. 이벤트 수정

* **Method:** `PATCH`
* **Endpoint:** `/events/:id`
* **설명:** 이벤트 속성을 부분 업데이트합니다.
* **Request Body (UpdateEventDto):**

  ```json
  { "name": "[연장] 5월 출석 이벤트", "endAt": "2025-06-10T23:59:59.000Z" }
  ```
* **Response (200 OK):** 수정된 이벤트 객체

### 7. 이벤트 삭제

* **Method:** `DELETE`
* **Endpoint:** `/events/:id`
* **설명:** 이벤트를 삭제합니다.
* **Response (200 OK):** 없음

### 8. 이벤트 보상 추가

* **Method:** `POST`
* **Endpoint:** `/events/:id/rewards`
* **설명:** 이벤트에 보상을 추가합니다.
* **Request Body (CreateRewardDto):**

  ```json
  { "type": "ITEM", "config": { "itemId": "SWORD", "itemName": "검", "quantity": 1 } }
  ```
* **Response (200 OK):** 생성된 Reward 객체

---

## 보상 클레임 (Claim) API

### 1. 보상 요청

* **Method:** `POST`
* **Endpoint:** `/claims`
* **설명:** 사용자 보상을 요청합니다.
* **Request Body (ClaimEventDto):**

  ```json
  { "eventId": "eventId123", "payload": { /* optional */ } }
  ```
* **Response (200 OK):** ClaimResponseDto

### 2. 내 보상 조회

* **Method:** `GET`
* **Endpoint:** `/claims/:eventId`
* **설명:** 해당 이벤트에 대한 자신의 클레임 정보를 조회합니다.
* **Response (200 OK):** ClaimResponseDto

### 3. 특정 유저 클레임 조회

* **Method:** `GET`
* **Endpoint:** `/claims/admin`
* **설명:** 감사자/관리자용, 특정 사용자의 이벤트 클레임 목록을 조회합니다.
* **Request Body (FindClaimUserDto):**

  ```json
  { "userId": "user123", "eventId": "event123" }
  ```
* **Response (200 OK):** ClaimResponseDto\[]

### 4. 전체 클레임 조회

* **Method:** `GET`
* **Endpoint:** `/claims?eventId=&status=GRANTED,REJECTED`
* **설명:** 감사자/관리자가 필터링하여 모든 클레임을 조회합니다.
* **Query Params:**

  * `eventId` (optional)
  * `status` (optional, comma-separated)
* **Response (200 OK):** ClaimResponseDto\[]

---

## 결제 (Payment) API

### 1. 결제 생성

* **Method:** `POST`
* **Endpoint:** `/payments`
* **설명:** 새로운 결제를 생성합니다.
* **Request Body (CreatePaymentDto):**

  ```json
  { "type": "PURCHASE", "amount": 10000 }
  ```
* **Response (200 OK):** PaymentResponseDto

### 2. 결제 상태 업데이트

* **Method:** `PUT`
* **Endpoint:** `/payments/:paymentId/status`
* **설명:** 결제 상태를 업데이트합니다.
* **Request Body:**

  ```json
  { "status": "COMPLETED" }
  ```
* **Response (200 OK):** PaymentResponseDto

---

## 이벤트 예시 플로우

다음은 각 이벤트 타입별로 **이벤트 생성 → 보상 설정 → 사용자 보상 요청** 순으로 호출할 수 있는 예시 흐름입니다. Postman, curl 등을 이용해 순서대로 호출하며 테스트해 보세요.

### 1. DAILY\_CHECK\_IN (하루 단위 출석 체크)

1. 이벤트 생성

   * **Method:** `POST`
   * **Endpoint:** `/events`
   * **Request Body:**

     ```json
     {
       "name": "Daily Check-In",
       "type": "DAILY_CHECK_IN",
       "startAt": "2025-05-01T00:00:00.000Z",
       "endAt": "2025-05-31T23:59:59.999Z",
       "config": {}
     }
     ```
   * **Response:**

     ```json
     { "_id": "{eventId}", "name": "Daily Check-In", ... }
     ```

2. 보상 추가

   * **Method:** `POST`
   * **Endpoint:** `/events/{eventId}/rewards`
   * **Request Body:**

     ```json
     {
       "type": "POINT",
       "config": { "amount": 100, "pointType": "EVENT_POINT" }
     }
     ```
   * **Response:** 생성된 Reward 객체

3. 사용자 보상 요청

   * **Method:** `POST`
   * **Endpoint:** `/claims`
   * **Request Body:**

     ```json
     { "eventId": "{eventId}" }
     ```
   * **Response (GRANTED):**

     ```json
     {
       "claimId": "{claimId}",
       "status": "GRANTED",
       "processedAt": "2025-05-01T10:00:00.000Z",
       "rewards": [ { "type": "POINT", "amount": 100, "currency": "GAME_MONEY" } ]
     }
     ```

### 2. WEEKLY\_ATTENDANCE (주간 출석 횟수 기반)

1. 이벤트 생성

   * **Request Body:**

     ```json
     {
       "name": "Weekly Attendance",
       "type": "WEEKLY_ATTENDANCE",
       "startAt": "2025-05-01T00:00:00.000Z",
       "endAt": "2025-05-31T23:59:59.999Z",
       "config": { "minCount": 3 }
     }
     ```

2. 보상 추가

   * **Request Body:**

     ```json
     {
       "type": "COUPON",
       "config": { "couponCode": "WEEKLY3", "discountRate": 0.2, "validityDays": 7 }
     }
     ```

3. 사용자 보상 요청

   * **Request Body:** `{ "eventId": "{eventId}" }`
   * **Response:**

     ```json
     { "claimId": "{claimId}", "status": "GRANTED", "rewards": [ { "type": "COUPON", "couponCode": "WEEKLY3", ... } ] }
     ```

### 3. REFERRAL (추천인 코드 입력)

1. 이벤트 생성

   * **Request Body:**

     ```json
     {
       "name": "Referral Bonus",
       "type": "REFERRAL",
       "startAt": "2025-05-01T00:00:00.000Z",
       "endAt": "2025-06-01T00:00:00.000Z",
       "config": {}
     }
     ```

2. 보상 추가

   * **Request Body:**

     ```json
     { "type": "ITEM", "config": { "itemId": "REF_TOKEN", "itemName": "Referral Token", "quantity": 1 } }
     ```

3. 사용자 보상 요청

   * **Request Body:**

     ```json
     { "eventId": "{eventId}", "payload": { "referralCode": "{referrerCode}" } }
     ```

### 4. SPEND\_THRESHOLD (결제 금액 임계치)

1. 이벤트 생성

   * **Request Body:**

     ```json
     {
       "name": "Spend Threshold 50k",
       "type": "SPEND_THRESHOLD",
       "startAt": "2025-05-01T00:00:00.000Z",
       "endAt": "2025-05-31T23:59:59.999Z",
       "config": { "threshold": 50000 }
     }
     ```

2. 보상 추가

   * **Request Body:**

     ```json
     { "type": "CASHBACK", "config": { "amount": 5000, "currency": "KRW", "refundMethod": "ACCOUNT_TRANSFER" } }
     ```

3. 사용자 보상 요청

   * **Request Body:** `{ "eventId": "{eventId}" }`

### 5. PAYBACK (확률적 페이백)

1. 이벤트 생성

   * **Request Body:**

     ```json
     {
       "name": "Random Payback",
       "type": "PAYBACK",
       "startAt": "2025-05-01T00:00:00.000Z",
       "endAt": "2025-05-31T23:59:59.999Z",
       "config": { "paybackRate": 0.1, "maxPaybackAmount": 10000 }
     }
     ```

2. 보상 추가

   * **Request Body:** 동일 config 활용

3. 사용자 보상 요청

   * **Request Body:** `{ "eventId": "{eventId}" }`
   * **Response:**

     ```json
     { "claimId": "{claimId}", "status": "GRANTED", "rewards": [ { "type": "CASHBACK", "rate": 0.1, "amount": 800 } ] }
     ```
