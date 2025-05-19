import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { validationSchema } from 'config/validation';
import { AttendanceModule } from 'modules/attendance/attendance.module';
import { UserFromHeaderMiddleware } from 'common/middleware/user-from-header.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_EVENT_URI ?? ''),
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserFromHeaderMiddleware).forRoutes('*');
  }
}
