export enum EventType {
    /** 하루 단위 출석 체크인 이벤트 */
    DAILY_CHECK_IN      = 'DAILY_CHECK_IN',
    /** 주간 출석 횟수에 따른 보상 이벤트 */
    WEEKLY_ATTENDANCE   = 'WEEKLY_ATTENDANCE',
    /** 추천인 코드 입력/발급 이벤트 */
    REFERRAL            = 'REFERRAL',
    /** 결제 금액 임계치 달성 이벤트 */
    SPEND_THRESHOLD     = 'SPEND_THRESHOLD',
    /** 확률적 페이백 이벤트 */
    PAYBACK             = 'PAYBACK',
}
  