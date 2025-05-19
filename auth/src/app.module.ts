import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { validationSchema } from 'config/validation';
import { AuthModule } from 'modules/auth/auth.module';
import { UsersModule } from 'modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilModule } from 'utils/Utile.module';
import { UserFromHeaderMiddleware } from 'common/middleware/user-from-header.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_AUTH_URI ?? ''),
    UtilModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserFromHeaderMiddleware).forRoutes('*');
  }
}
