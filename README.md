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
-   **참고:** 이 API는 `auth` 서비스(`auth/src/modules/auth/auth.controller.ts`)에는 정의되어 있으나, 제공된 게이트웨이 컨트롤러(`gateway/src/routes/auth/auth-auth.controller.ts`)에는 해당 프록시 설정이 없습니다. 사용하려면 게이트웨이에 라우팅 추가가 필요합니다. (현재 대화에서는 게이트웨이에 없다고 가정하고 문서를 작성했으나, 만약 추가되었다면 이 참고는 무시해도 됩니다.)

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

## 참고

*   위 API 명세는 제공된 `gateway` 및 `auth` 서비스의 컨트롤러 코드를 기준으로 작성되었습니다.
*   API 엔드포인트의 `/api` prefix는 일반적인 API 게이트웨이 설정을 가정한 것이며, 실제 게이트웨이의 글로벌 prefix 설정에 따라 달라질 수 있습니다. 현재 게이트웨이 컨트롤러 자체에는 `/auth/auth`, `/auth/users`와 같이 서비스별 경로가 지정되어 있습니다.

*   사용자 생성(`OPERATOR`, `AUDITOR`, `ADMIN`) API 관련하여 `auth` 서비스 코드에 "생성자 권한 추가" `TODO`가 있으므로, 향후 해당 API들에 대한 접근 제어가 강화될 수 있습니다. 현재 게이트웨이에서는 `@Public`으로 열려있습니다.