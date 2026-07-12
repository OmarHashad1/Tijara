import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, CLIENT_URL } from './configs';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ResponseInterceptor, TimeoutInterceptor } from './common/interceptors';
import { raw, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: CLIENT_URL,
  });

  app.use('/orders/webhook', raw({ type: 'application/json' }));
  app.getHttpAdapter().get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'ok' });
  });

  app.useGlobalInterceptors(
    new TimeoutInterceptor(),
    new ResponseInterceptor(),
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(PORT);
}
bootstrap();
