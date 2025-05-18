import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EventAttendance extends Document {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    startingDate: Date;

    @Prop({ required: true })
    endingDate: Date;

    @Prop({ required: true })
    location: string;
    
    @Prop({ required: true })
    rewardList: string[];

}


export const EventAttendanceSchema = SchemaFactory.createForClass(EventAttendance);