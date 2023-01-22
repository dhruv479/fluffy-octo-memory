import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { Constants } from './common/constants';
import { NullTransform } from './common/pipes/null-check.pipes';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
    cors: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  app
    .useGlobalPipes(new NullTransform())
    .useGlobalPipes(
      new ValidationPipe({
        transform: false,
        whitelist: true,
      }),
    )
    .useGlobalFilters(new AllExceptionsFilter(httpAdapter))
    .use(helmet())
    .useGlobalInterceptors(new ResponseInterceptor())
    .setGlobalPrefix('api');

  if (process.env.NODE_ENV === Constants.DEV_ENV) {
    const options = new DocumentBuilder()
      .setTitle('Custhort')
      .setDescription('API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(Number(process.env.PORT) || Constants.DEFAULT_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
  return app;
}

export default bootstrap().then((app) => app);
