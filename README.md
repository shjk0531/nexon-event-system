# 실행 방법



## Docker로 실행 


```bash
docker-compose up -d --build
```



---

# API 명세

## 인증 (Auth) API

### 1. 로그인

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/auth/login`
-   **설명:** 사용자 이메일과 비밀번호로 로그인합니다. 성공 시 액세스 토큰과 함께 HTTP-only 쿠키로 리프레시 토큰을 설정합니다.
-   **권한:** `PUBLIC`
-   **Request Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
-   **Response (200 OK):**
    ```json
    {
        "access_token": "your_access_token"
    }
    ```
-   **Response Headers:**
    -   `Set-Cookie`: `refresh_token=your_refresh_token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=...` (리프레시 토큰)
-   **오류 응답:**
    -   `401 Unauthorized`: 잘못된 인증 정보 (예: 이메일 또는 비밀번호 불일치)

### 2. 로그아웃

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/auth/logout`
-   **설명:** 사용자를 로그아웃하고, 리프레시 토큰 쿠키를 제거합니다. `auth` 서비스에서 `@CurrentUser`를 사용하므로 인증된 사용자만 호출 가능합니다.
-   **권한:** `ALL`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token` (액세스 토큰)
    -   `Cookie`: `refresh_token=your_refresh_token` (요청 시 쿠키에 리프레시 토큰 포함)
-   **Response (200 OK):**
    ```json
    {
        "message": "Logged out successfully"
    }
    ```
-   **Response Headers:**
    -   `Set-Cookie`: `refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT` (쿠키 제거)
-   **오류 응답:**
    -   `401 Unauthorized`: 액세스 토큰 또는 리프레시 토큰이 없거나 유효하지 않은 경우

### 3. 토큰 재발급

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/auth/refresh`
-   **설명:** 유효한 리프레시 토큰(쿠키)을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급받습니다.
-   **권한:** `PUBLIC`
-   **Request Headers:**
    -   `Cookie`: `refresh_token=your_refresh_token`
-   **Response (200 OK):**
    ```json
    {
        "access_token": "new_access_token"
    }
    ```
-   **Response Headers:**
    -   `Set-Cookie`: `refresh_token=new_refresh_token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=...`
-   **오류 응답:**
    -   `401 Unauthorized`: 리프레시 토큰이 없거나 유효하지 않은 경우


## 사용자 (Users) API

모든 사용자 API 엔드포인트는 기본적으로 JWT 인증(`AuthGuard('jwt')`) 및 역할 기반 접근 제어(`RolesGuard`)를 받습니다 (별도 명시 없을 시). `@Public`으로 지정된 경우에만 인증이 필요 없습니다.

### 1. 사용자 생성 (일반 USER)

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/users/user`
-   **설명:** 새로운 일반 사용자(USER) 계정을 생성합니다.
-   **권한:** `PUBLIC`
-   **Request Body:**
    ```json
    {
        "email": "newuser@example.com",
        "password": "password123"
    }
    ```
-   **Response (201 Created):**
    ```json
    {
        "email": "newuser@example.com",
        "role": "USER"
    }
    ```
-   **오류 응답:**
    -   `409 Conflict`: 이미 존재하는 이메일

### 2. 운영자 생성 (OPERATOR)

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/users/operator`
-   **설명:** 새로운 운영자(OPERATOR) 계정을 생성합니다.
-   **권한:** `PUBLIC`
-   **Request Body:**
    ```json
    {
        "email": "operator@example.com",
        "password": "password123"
    }
    ```
-   **Response (201 Created):**
    ```json
    {
        "email": "operator@example.com",
        "role": "OPERATOR"
    }
    ```
-   **오류 응답:**
    -   `409 Conflict`: 이미 존재하는 이메일
-   **참고:** `auth` 서비스의 `UsersController`에는 생성자 권한 관련 `TODO` 주석이 있습니다.

### 3. 감사자 생성 (AUDITOR)

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/users/auditor`
-   **설명:** 새로운 감사자(AUDITOR) 계정을 생성합니다.
-   **권한:** `PUBLIC`
-   **Request Body:**
    ```json
    {
        "email": "auditor@example.com",
        "password": "password123"
    }
    ```
-   **Response (201 Created):**
    ```json
    {
        "email": "auditor@example.com",
        "role": "AUDITOR"
    }
    ```
-   **오류 응답:**
    -   `409 Conflict`: 이미 존재하는 이메일
-   **참고:** `auth` 서비스의 `UsersController`에는 생성자 권한 관련 `TODO` 주석이 있습니다.

### 4. 관리자 생성 (ADMIN)

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/users/admin`
-   **설명:** 새로운 관리자(ADMIN) 계정을 생성합니다.
-   **권한:** `PUBLIC`
-   **Request Body:**
    ```json
    {
        "email": "admin@example.com",
        "password": "password123"
    }
    ```
-   **Response (201 Created):**
    ```json
    {
        "email": "admin@example.com",
        "role": "ADMIN"
    }
    ```
-   **오류 응답:**
    -   `409 Conflict`: 이미 존재하는 이메일
-   **참고:** `auth` 서비스의 `UsersController`에는 생성자 권한 관련 `TODO` 주석이 있습니다.

### 5. 특정 사용자 정보 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/auth/users/user/:id`
-   **설명:** 특정 ID를 가진 사용자의 정보를 조회합니다.
-   **권한:** `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `id`: 조회할 사용자의 ID
-   **Response (200 OK):**
    ```json
    {
        "_id": "user_id",
        "email": "user@example.com",
        "role": "USER",
        // 기타 사용자 정보
    }
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 ID의 사용자를 찾을 수 없음

### 6. 모든 사용자 목록 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/auth/users/users`
-   **설명:** 모든 사용자 계정 목록을 조회합니다. (`auth` 서비스의 `findAll` 메소드는 개발 환경에서만 사용 가능하도록 코드가 작성되어 있을 수 있으니 참고 바랍니다.)
-   **권한:** `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Response (200 OK):**
    ```json
    [
        {
            "_id": "user_id_1",
            "email": "user1@example.com",
            "role": "USER"
        },
        {
            "_id": "user_id_2",
            "email": "operator2@example.com",
            "role": "OPERATOR"
        }
        // ... 기타 사용자 정보
    ]
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자 (ADMIN 역할이 아닌 경우)
    -   `500 Internal Server Error`: `auth` 서비스에서 개발 환경 제한 등으로 인해 오류 발생 시

### 7. 사용자 정보 업데이트 (본인)

-   **Method:** `PATCH`
-   **Endpoint:** `/api/auth/users/user`
-   **설명:** 현재 로그인된 사용자의 정보를 업데이트합니다. (`auth` 서비스에서 `@CurrentUser` 사용)
-   **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN` (본인 정보에 한함)
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Request Body:** (업데이트할 필드만 포함)
    ```json
    {
        "password": "newpassword123"
    }
    ```
-   **Response (200 OK):**
    ```json
    {
        "_id": "user_id",
        "email": "user@example.com",
        "role": "USER",
        // 업데이트된 사용자 정보
    }
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `404 Not Found`: 사용자를 찾을 수 없음

### 8. 특정 사용자 삭제

-   **Method:** `DELETE`
-   **Endpoint:** `/api/auth/users/user/:id`
-   **설명:** 특정 ID를 가진 사용자 계정을 삭제합니다.
-   **권한:** `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `id`: 삭제할 사용자의 ID
-   **Response (200 OK):**
    ```json
    {
        "_id": "user_id",
        "email": "user@example.com",
        "role": "USER"
        // 삭제된 사용자 정보
    }
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자 (ADMIN 역할이 아닌 경우)
    -   `404 Not Found`: 사용자를 찾을 수 없음
-   **주의:** 이 엔드포인트는 `ADMIN`만 호출 가능하며, 제공된 ID로 사용자를 직접 삭제합니다. 다른 역할의 사용자는 본인 계정 삭제 시 아래의 `/api/auth/users/me` 엔드포인트를 사용해야 합니다.

### 9. 본인 정보 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/auth/users/me`
-   **설명:** 현재 로그인된 사용자의 정보를 조회합니다. (`auth` 서비스에서 `@CurrentUser` 사용)
-   **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Response (200 OK):**
    ```json
    {
        "_id": "user_id",
        "email": "user@example.com",
        "role": "USER",
        // 기타 사용자 정보
    }
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `404 Not Found`: 사용자를 찾을 수 없음 (매우 드문 경우)

### 10. 본인 계정 삭제

-   **Method:** `DELETE`
-   **Endpoint:** `/api/auth/users/me`
-   **설명:** 현재 로그인된 사용자의 계정을 삭제합니다. (`auth` 서비스에서 `@CurrentUser` 사용)
-   **권한:** `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Response (200 OK):**
    ```json
    {
        "_id": "user_id",
        "email": "user@example.com",
        "role": "USER"
        // 삭제된 사용자 정보
    }
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `404 Not Found`: 사용자를 찾을 수 없음

## 이벤트 (Event) API

모든 이벤트 API 엔드포인트는 기본적으로 JWT 인증(`AuthGuard('jwt')`) 및 역할 기반 접근 제어(`RolesGuard`)를 받습니다.

### 1. 달력 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/event/events/calendar`
-   **설명:** 특정 월의 이벤트 달력을 조회합니다.
-   **권한:** `USER`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Query Parameters:**
    -   `month`: 조회할 월 (예: `YYYY-MM` 형식, 예: `2025-05`)
-   **Response (200 OK):** (응답 형식은 `event` 서비스의 `eventService.getCalendar` 반환값에 따라 달라집니다.)
    ```json
    // 예시 응답
    [
        {
            "date": "2025-05-01",
            "events": [
                { "eventId": "event_id_1", "title": "크리스마스 이벤트" }
            ]
        }
        // ... 기타 날짜별 이벤트 정보
    ]
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자

### 2. 추천인 ID 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/event/events/referrerId`
-   **설명:** 현재 로그인된 사용자의 추천인 ID를 조회합니다.
-   **권한:** `USER`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Response (200 OK):** (응답 형식은 `event` 서비스의 `eventService.getReferrerId` 반환값에 따라 달라집니다.)
    ```json
    // 예시 응답
    {
        "referrerId": "user_specific_referrer_id"
    }
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자

### 3. 이벤트 생성

-   **Method:** `POST`
-   **Endpoint:** `/api/event/events`
-   **설명:** 새로운 이벤트를 생성합니다.
-   **권한:** `OPERATOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Request Body:** (`event` 서비스의 `CreateEventDto` 참조)
    ```json
    // 예시 CreateEventDto
    {
    "name": "5월 결제 페이백 이벤트",
    "type": "PAYBACK",
    "startAt": "2025-05-01T00:00:00.000Z",
    "endAt":   "2025-05-31T23:59:59.999Z",
    "config": {
      "minAmount": 10000,
      "maxAmount": 1000000,
      "cashbackRate": 0.1,
      "cashbackProbability": 0.5
    }
    ```
-   **Response (201 Created):** (생성된 이벤트 정보)
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자

### 4. 이벤트 목록 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/event/events`
-   **설명:** 모든 이벤트 목록을 조회합니다.
-   **권한:** `OPERATOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Response (200 OK):** (이벤트 목록)
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자

### 5. 이벤트 상세 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/event/events/:id`
-   **설명:** 특정 ID를 가진 이벤트의 상세 정보를 조회합니다.
-   **권한:** `OPERATOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `id`: 조회할 이벤트의 ID
-   **Response (200 OK):** (이벤트 상세 정보)
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 ID의 이벤트를 찾을 수 없음

### 6. 이벤트 수정

-   **Method:** `PATCH`
-   **Endpoint:** `/api/event/events/:id`
-   **설명:** 특정 ID를 가진 이벤트를 수정합니다.
-   **권한:** `OPERATOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `id`: 수정할 이벤트의 ID
-   **Request Body:** (`event` 서비스의 `UpdateEventDto` 참조)
    ```json
    // 예시 UpdateEventDto (부분 업데이트 가능)
    {
        "title": "[기간 연장] 2025년 5월 가정의 달 특별 출석 이벤트",
        "description": "뜨거운 성원에 힘입어 이벤트 기간을 연장합니다! (수정일: 2025-05-20)",
        "endDate": "2025-06-10T23:59:59.000Z",
        "maxClaims": 12000
    }
    ```
-   **Response (200 OK):** (수정된 이벤트 정보)
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 ID의 이벤트를 찾을 수 없음

### 7. 이벤트 삭제

-   **Method:** `DELETE`
-   **Endpoint:** `/api/event/events/:id`
-   **설명:** 특정 ID를 가진 이벤트를 삭제합니다.
-   **권한:** `OPERATOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `id`: 삭제할 이벤트의 ID
-   **Response (200 OK / 204 No Content):** (삭제 성공)
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 ID의 이벤트를 찾을 수 없음

### 8. 이벤트 보상 추가

-   **Method:** `POST`
-   **Endpoint:** `/api/event/events/:id/rewards`
-   **설명:** 특정 이벤트에 보상을 추가합니다.
-   **권한:** `OPERATOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `id`: 보상을 추가할 이벤트의 ID
-   **Request Body:** (`event` 서비스의 `CreateRewardDto` 참조)
    ```json
    // 예시 CreateRewardDto
    {
        "type": "POINT",
        "name": "5월 이벤트 특별 참여 포인트",
        "quantity": 1000,
        "metadata": { "reason": "2025-05-20 추가 보상 지급" }
    }
    ```
-   **Response (201 Created):** (추가된 보상 정보를 포함한 이벤트 정보 또는 성공 메시지)
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 ID의 이벤트를 찾을 수 없음

## 이벤트 보상 (Claim) API

모든 이벤트 보상 API 엔드포인트는 기본적으로 JWT 인증(`AuthGuard('jwt')`) 및 역할 기반 접근 제어(`RolesGuard`)를 받습니다.

### 1. 보상 요청 생성

-   **Method:** `POST`
-   **Endpoint:** `/api/event/claims`
-   **설명:** 사용자가 특정 이벤트에 대한 보상을 요청합니다.
-   **권한:** `USER`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Request Body:** (`event` 서비스의 `ClaimEventDto` 참조)
    ```json
    // 예시 ClaimEventDto
    {
        "eventId": "may_family_event_2025",
        "payload": { 
            "missionId": "daily_login_20250520",
            "claimedAt": "2025-05-20T10:00:00.000Z"
        }
    }
    ```
-   **Response (200 OK / 201 Created):** (`event` 서비스의 `ClaimResponseDto` 참조)
    ```json
    // 예시 성공 응답 (GRANTED)
    {
        "claimId": "claim_id_123",
        "status": "GRANTED",
        "processedAt": "2025-12-25T10:00:00.000Z",
        "rewards": [
            { "type": "ITEM", "name": "산타의 선물", "quantity": 1 }
        ]
    }
    // 예시 거절 응답 (REJECTED)
    {
        "claimId": "claim_id_456",
        "status": "REJECTED",
        "processedAt": "2025-12-25T10:05:00.000Z"
    }
    ```
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터 (예: 이미 보상 수령, 이벤트 없음 등)
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 이벤트를 찾을 수 없음

### 2. 특정 사용자의 보상 요청 목록 조회 (관리자용)

-   **Method:** `GET`
-   **Endpoint:** `/api/event/claims/admin`
-   **설명:** 감사자 또는 관리자가 특정 사용자의 전체 보상 요청 목록을 조회합니다.
-   **권한:** `AUDITOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Request Body (게이트웨이는 GET 요청이나, `event` 서비스가 Body를 기대 - 주의사항 참조):** (`event` 서비스의 `FindClaimUserDto` 참조)
    ```json
    // 예시 FindClaimUserDto
    {
        "userId": "queried_user_id_123",
        "eventId": "may_family_event_2025" // 특정 이벤트로 필터링 시 (생략 가능)
    }
    ```
-   **Response (200 OK):** (`event` 서비스의 `ClaimResponseDto` 배열)
    ```json
    [
        {
            "claimId": "claim_id_abc",
            "eventId": "may_family_event_2025",
            "status": "GRANTED",
            "processedAt": "2025-05-20T10:00:00.000Z",
            "rewards": [
                { "type": "ITEM", "name": "5월의 감사 선물 상자", "quantity": 1 }
            ]
        }
        // ... 해당 사용자의 다른 클레임 정보
    ]
    ```
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터 (예: `userId` 누락)
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
-   **주의:** 이 API는 현재 게이트웨이(`GET` 요청)와 이벤트 서비스(`@Body`를 사용하여 요청 본문에서 데이터를 읽으려고 시도) 간의 요청 처리 방식에 불일치가 있습니다. 일반적인 HTTP `GET` 요청은 본문을 포함하지 않거나, 포함하더라도 프록시/서버에서 무시될 수 있습니다. 따라서 게이트웨이를 통해 이 API를 호출할 경우, `event` 서비스가 `FindClaimUserDto`를 제대로 수신하지 못하여 의도대로 동작하지 않거나 오류가 발생할 수 있습니다. `event` 서비스의 해당 API를 `POST`로 변경하거나 `Query Parameter`를 사용하도록 수정을 고려해야 합니다.

### 3. 내 보상 요청 조회

-   **Method:** `GET`
-   **Endpoint:** `/api/event/claims/:eventId`
-   **설명:** 사용자가 특정 이벤트에 대해 자신이 요청한 보상 내역을 조회합니다.
-   **권한:** `USER`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Path Parameters:**
    -   `eventId`: 조회할 이벤트의 ID
-   **Response (200 OK):** (`event` 서비스의 `ClaimResponseDto` 참조, 위 1번 응답 예시와 유사)
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 이벤트에 대한 클레임 정보를 찾을 수 없음

### 4. 전체 보상 요청 조회 (관리자/감사자)

-   **Method:** `GET`
-   **Endpoint:** `/api/event/claims`
-   **설명:** 감사자 또는 관리자가 전체 보상 요청 목록을 필터링하여 조회합니다.
-   **권한:** `AUDITOR`, `ADMIN`
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Query Parameters:** (`event` 서비스의 `FilterClaimsDto` 참조)
    -   `eventId` (optional): 특정 이벤트 ID로 필터링
    -   `status` (optional): 클레임 상태로 필터링 (예: `GRANTED`, `REJECTED`, `PENDING`. 쉼표로 구분된 여러 값 가능)
-   **Response (200 OK):** (`event` 서비스의 `ClaimResponseDto` 배열)
    ```json
    [
        {
            "claimId": "claim_id_123",
            "status": "GRANTED",
            // ... 기타 정보
        },
        {
            "claimId": "claim_id_456",
            "status": "REJECTED",
            // ... 기타 정보
        }
    ]
    ```
-   **오류 응답:**
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자

## 이벤트 결제 (Payment) API

모든 이벤트 결제 API 엔드포인트는 기본적으로 JWT 인증(`AuthGuard('jwt')`) 및 역할 기반 접근 제어(`RolesGuard`)를 받습니다. (게이트웨이 `EventPaymentController`에 `@UseGuards(AuthGuard('jwt'), RolesGuard)` 적용됨)

### 1. 결제 생성

-   **Method:** `POST`
-   **Endpoint:** `/api/event/payments`
-   **설명:** 사용자가 새로운 결제를 생성합니다.
-   **권한:** `USER` (게이트웨이 `EventPaymentController`의 `createPayment`에 `@Roles(Role.USER)` 적용됨)
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token`
-   **Request Body:** (`event` 서비스의 `CreatePaymentDto` 참조)
    ```json
    // 예시 CreatePaymentDto
    {
        "eventId": "special_offer_202505",
        "amount": 25000,
        "paymentMethod": "CREDIT_CARD",
        "metadata": {
            "productName": "5월 한정 스페셜 패키지",
            "orderDate": "2025-05-20"
        }
    }
    ```
-   **Response (200 OK / 201 Created):** (`event` 서비스의 `PaymentResponseDto` 참조)
    ```json
    // 예시 PaymentResponseDto
    {
        "paymentId": "payment_id_789",
        "status": "PENDING", // 또는 "COMPLETED" 등 초기 상태
        "amount": 25000,
        "createdAt": "2025-05-20T11:00:00.000Z"
    }
    ```
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터
    -   `401 Unauthorized`: 인증되지 않은 사용자
    -   `403 Forbidden`: 권한 없는 사용자

### 2. 결제 상태 업데이트

-   **Method:** `PUT`
-   **Endpoint:** `/api/event/payments/:paymentId/status`
-   **설명:** 특정 결제의 상태를 업데이트합니다. (내부 시스템 또는 결제 게이트웨이 콜백 등에 의해 호출될 수 있음)
-   **권한:** `USER` (게이트웨이 `EventPaymentController`의 `updatePaymentStatus`에 `@Roles(Role.USER)` 적용됨. 이 부분은 실제 시스템 로직에 따라 ADMIN/OPERATOR 또는 내부 서비스 전용 권한이 더 적절할 수 있습니다. 현재 설정 기준으로 명시합니다.)
-   **Request Headers:**
    -   `Authorization`: `Bearer your_access_token` (호출 주체에 따라 필요)
-   **Path Parameters:**
    -   `paymentId`: 상태를 업데이트할 결제의 ID
-   **Request Body:**
    ```json
    {
        "status": "COMPLETED" // 예: "CANCELLED", "FAILED"
    }
    ```
-   **Response (200 OK):** (업데이트된 `PaymentResponseDto` 참조, 위 1번 응답 예시와 유사)
-   **오류 응답:**
    -   `400 Bad Request`: 잘못된 요청 데이터 (예: 유효하지 않은 상태값)
    -   `401 Unauthorized`: 인증되지 않은 사용자 (필요한 경우)
    -   `403 Forbidden`: 권한 없는 사용자
    -   `404 Not Found`: 해당 ID의 결제를 찾을 수 없음


## 이벤트 및 보상 타입 정의

이벤트 시스템에서 사용되는 주요 이벤트 종류와 보상 종류는 다음과 같습니다.

### 이벤트 종류 (EventType)

이벤트 생성 시 `type` 필드에 사용될 수 있는 값들입니다.

-   **`DAILY_CHECK_IN`**: 하루 단위 출석 체크인 이벤트
    -   설명: 매일 출석하여 보상을 받는 유형의 이벤트입니다.
    -   예시 `config`: `{ "totalDays": 28, "rewardsPerDay": { "1": "rewardId1", "7": "rewardId2" } }`
-   **`WEEKLY_ATTENDANCE`**: 주간 출석 횟수에 따른 보상 이벤트
    -   설명: 주 단위로 특정 횟수 이상 출석 시 보상을 받는 유형의 이벤트입니다.
    -   예시 `config`: `{ "daysRequired": 3, "rewardId": "weeklyReward" }`
-   **`REFERRAL`**: 추천인 코드 입력/발급 이벤트
    -   설명: 친구 추천 코드 입력 또는 본인의 추천 코드가 사용되었을 때 보상을 받는 유형의 이벤트입니다.
    -   예시 `config`: `{ "referrerRewardId": "refReward1", "refereeRewardId": "refReward2", "maxReferrals": 10 }`
-   **`SPEND_THRESHOLD`**: 결제 금액 임계치 달성 이벤트
    -   설명: 특정 기간 동안 누적 또는 단일 결제 금액이 일정 수준 이상일 경우 보상을 받는 유형의 이벤트입니다.
    -   예시 `config`: `{ "thresholdAmount": 50000, "rewardId": "spendReward", "cumulative": true }`
-   **`PAYBACK`**: 확률적 페이백 이벤트
    -   설명: 결제 또는 특정 활동 시 일정 확률로 보상(주로 결제 금액의 일부)을 돌려받는 유형의 이벤트입니다.
    -   예시 `config`: `{ "paybackRate": 0.1, "probability": 0.05, "maxPaybackAmount": 10000 }`

### 보상 종류 (RewardType)

이벤트 보상 설정 시 `type` 필드에 사용될 수 있는 값들입니다.

-   **`ITEM`**: 특정 아이템 지급
    -   설명: 게임 내 아이템, 특정 상품 등을 지급합니다.
    -   예시 `config`: `{ "itemId": "SWORD_OF_LEGEND", "quantity": 1, "itemGrade": "Epic" }`
-   **`POINT`**: 포인트 지급
    -   설명: 서비스 내에서 사용할 수 있는 포인트를 지급합니다.
    -   예시 `config`: `{ "amount": 1000, "pointType": "EVENT_POINT" }`
-   **`COUPON`**: 쿠폰 지급
    -   설명: 할인 쿠폰, 무료 이용권 등을 지급합니다.
    -   예시 `config`: `{ "couponCode": "WELCOME2025", "discountRate": 0.15, "maxDiscountAmount": 5000, "validityDays": 30 }`
-   **`CASHBACK`**: 현금환급(캐시백)
    -   설명: 결제 금액의 일부 또는 특정 금액을 현금성 자산으로 환급합니다.
    -   예시 `config`: `{ "amount": 5000, "currency": "KRW", "refundMethod": "ACCOUNT_TRANSFER" }`

**참고:** 위 `config` 객체의 내용은 예시이며, 실제 필요한 속성은 각 이벤트 및 보상 타입의 구체적인 구현에 따라 달라질 수 있습니다.