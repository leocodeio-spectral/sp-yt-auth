import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from '@leocodeio-njs/njs-response';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const swaggerProtection = {
    route: configService.get('SWAGGER_ROUTE'),
    password: configService.get('SWAGGER_PASSWORD'),
  };
  app.use(
    [swaggerProtection.route],
    basicAuth({
      challenge: true,
      users: {
        admin: swaggerProtection.password,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // [TODO] Add some HTTP filters.
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('API_VERSION'),
    prefix: 'v',
  });

  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setDescription('API for managing feedback')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API key for authentication',
      },
      'x-api-key',
    )

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerProtection.route, app, document);
  console.log('application running on port', configService.get('PORT'));
  await app.listen(configService.get('PORT'));
}
bootstrap();
