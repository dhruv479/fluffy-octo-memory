import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './modules/todo/todo.module';
import { PostModule } from './modules/post/post.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { TodoController } from './modules/todo/todo.controller';
import { PostController } from './modules/post/post.controller';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    TodoModule,
    PostModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/user', method: RequestMethod.POST },
        { path: '/api/user/login', method: RequestMethod.POST },
      )
      .forRoutes(TodoController, PostController, UserController);
  }
}
