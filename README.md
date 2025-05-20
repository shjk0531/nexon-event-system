# API 명세
## 1. Gateway API 명세

모든 엔드포인트에 `AuthGuard('jwt')` + `RolesGuard`가 적용되며, `@Roles(...)`로 권한 제한

### 1-1. 이벤트 관리

| 기능        | Method | Gateway Endpoint                           | Roles           | Request Body                                                                                                                                                                          | Response Body                                                                                                                                                                                                           | Status Codes            |
| --------- | ------ | ------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 이벤트 생성    | POST   | `/api/event/events`                        | OPERATOR, ADMIN | `json<br>{<br>  "name": "string",<br>  "type": "DAILY_CHECK_IN",<br>  "startAt": "2025-05-20T00:00:00.000Z",<br>  "endAt": "2025-05-31T23:59:59.999Z",<br>  "config": { … }<br>}<br>` | `json<br>{<br>  "id":"string",<br>  "name":"string",<br>  "type":"DAILY_CHECK_IN",<br>  "startAt":"…",<br>  "endAt":"…",<br>  "isActive":true,<br>  "config":{…},<br>  "createdAt":"…",<br>  "updatedAt":"…" <br>}<br>` | 201, 400, 401, 403      |
| 이벤트 목록 조회 | GET    | `/api/event/events`                        | OPERATOR, ADMIN | —                                                                                                                                                                                     | `json<br>[ { …EventResponse }, … ]<br>`                                                                                                                                                                                 | 200, 401, 403           |
| 이벤트 상세 조회 | GET    | `/api/event/events/:id`                    | OPERATOR, ADMIN | —                                                                                                                                                                                     | `json<br>{ …EventResponse }<br>`                                                                                                                                                                                        | 200, 401, 403, 404      |
| 이벤트 수정    | PATCH  | `/api/event/events/:id`                    | OPERATOR, ADMIN | `json<br>{<br>  "name"?: "string",<br>  "config"?: {…},<br>  "isActive"?: false<br>}<br>`                                                                                             | `json<br>{ …EventResponse }<br>`                                                                                                                                                                                        | 200, 400, 401, 403, 404 |
| 이벤트 삭제    | DELETE | `/api/event/events/:id`                    | OPERATOR, ADMIN | —                                                                                                                                                                                     | — (빈 바디)                                                                                                                                                                                                                | 204, 401, 403, 404      |
| 보상 등록     | POST   | `/api/event/events/:id/rewards`            | OPERATOR, ADMIN | `json<br>{<br>  "type": "ITEM",<br>  "config": { "itemId":"sword","quantity":1 }<br>}<br>`                                                                                            | `json<br>{<br>  "id":"string",<br>  "eventId":"string",<br>  "type":"ITEM",<br>  "config":{…},<br>  "createdAt":"…",<br>  "updatedAt":"…" <br>}<br>`                                                                    | 201, 400, 401, 403, 404 |
| 달력 조회     | GET    | `/api/event/events/calendar?month=YYYY-MM` | USER            | —                                                                                                                                                                                     | `json<br>{<br>  "days":[ { "date":"2025-05-01", "claimed":true }, … ]<br>}<br>`                                                                                                                                         | 200, 400, 401, 403      |

### 1-2. 보상 요청 관리

| 기능          | Method | Gateway Endpoint                      | Roles                    | Request Body                         | Response Body                                                                                                                             | Status Codes       |
| ----------- | ------ | ------------------------------------- | ------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 보상 요청 생성    | POST   | `/api/event/claims`                   | USER                     | `json<br>{ "eventId":"string" }<br>` | `json<br>{<br>  "id":"string",<br>  "eventId":"string",<br>  "userId":"string",<br>  "status":"PENDING",<br>  "requestedAt":"…"<br>}<br>` | 201, 400, 401, 403 |
| 내 보상 요청 조회  | GET    | `/api/event/claims/:eventId`          | USER                     | —                                    | `json<br>{<br>  "id":"string",<br>  "eventId":"string",<br>  "userId":"string",<br>  "status":"GRANTED",<br>  "detail":{…}<br>}<br>`      | 200, 401, 403, 404 |
| 전체 보상 요청 조회 | GET    | `/api/event/claims?eventId=&status=…` | OPERATOR, AUDITOR, ADMIN | —                                    | `json<br>[ { …ClaimDocument }, … ]<br>`                                                                                                   | 200, 401, 403      |

---

## 2. Event Server API 명세

실제 비즈니스 로직을 수행하는 서비스의 직통 엔드포인트입니다.

### 2-1. 이벤트 관리

| 기능        | Method | Server Endpoint                  | Request Body                          | Response Body                                               | Status Codes  |
| --------- | ------ | -------------------------------- | ------------------------------------- | ----------------------------------------------------------- | ------------- |
| 이벤트 생성    | POST   | `/events`                        | CreateEventDto (위 Gateway와 동일)        | EventDocument 형태 (id `_id`, timestamps 포함)                  | 201, 400      |
| 이벤트 목록 조회 | GET    | `/events`                        | —                                     | `EventDocument[]`                                           | 200           |
| 이벤트 상세 조회 | GET    | `/events/:id`                    | —                                     | `EventDocument`                                             | 200, 404      |
| 이벤트 수정    | PATCH  | `/events/:id`                    | UpdateEventDto                        | `EventDocument`                                             | 200, 400, 404 |
| 이벤트 삭제    | DELETE | `/events/:id`                    | —                                     | — (204 No Content)                                          | 204, 404      |
| 보상 등록     | POST   | `/events/:id/rewards`            | CreateRewardDto                       | `RewardDocument`                                            | 201, 400, 404 |
| 달력 조회     | GET    | `/events/calendar?month=YYYY-MM` | `{ "month":"2025-05" }` (경로 또는 Query) | `{ days: [ { date: '2025-05-01', claimed: boolean }, … ] }` | 200, 400      |

### 2-2. 보상 요청 관리

| 기능          | Method | Server Endpoint             | Request Body          | Response Body                | Status Codes |
| ----------- | ------ | --------------------------- | --------------------- | ---------------------------- | ------------ |
| 보상 요청 생성    | POST   | `/claims`                   | `{ eventId: string }` | `ClaimDocument` 상태 `PENDING` | 201, 400     |
| 내 보상 요청 조회  | GET    | `/claims/:eventId`          | —                     | `ClaimDocument`              | 200, 404     |
| 전체 보상 요청 조회 | GET    | `/claims?eventId=&status=…` | —                     | `ClaimDocument[]`            | 200          |

---

### 공통 오류 응답

```jsonc
// 400 Bad Request (DTO 유효성 검사 실패 등)
{
  "statusCode": 400,
  "message": ["config must be an object", /* … */],
  "error": "Bad Request"
}

// 401 Unauthorized (JWT 검증 실패)
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// 403 Forbidden (권한 없음)
{
  "statusCode": 403,
  "message": "Forbidden resource"
}

// 404 Not Found (리소스 없음)
{
  "statusCode": 404,
  "message": "Event {id} not found"
}
```
