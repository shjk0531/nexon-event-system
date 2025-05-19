import { EventDocument } from '../schemas/event.schema';
import { EventType } from '../constants/event-type.constant';

/**
 * API 응답용 이벤트 객체 형태
 */
export interface EventResponse {
  id: string;
  name: string;
  type: EventType;
  startAt: string;
  endAt: string;
  isActive: boolean;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * EventDocument → EventResponse 매핑 유틸리티
 */
export class EventMapper {
  /**
   * 단일 이벤트 문서를 응답 DTO 형태로 변환
   */
  static toResponse(event: EventDocument): EventResponse {
    return {
      id: event._id.toHexString(),
      name: event.name,
      type: event.type,
      startAt: event.startAt.toISOString(),
      endAt: event.endAt.toISOString(),
      isActive: event.isActive,
      config: event.config,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  /**
   * 이벤트 문서 배열을 DTO 배열로 변환
   */
  static toListResponse(events: EventDocument[]): EventResponse[] {
    return events.map((evt) => this.toResponse(evt));
  }
}
