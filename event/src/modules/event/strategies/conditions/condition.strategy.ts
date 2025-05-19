import { EventDocument } from '../../schemas/event.schema';

export interface ConditionStrategy {
  canTrigger(userId: string, event: EventDocument): Promise<boolean>;
}
