import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from '@/config/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Carrega as configs do arquivo .env
  const configService = app.get(ConfigService);

  // Configura o swagger
  setupSwagger(app, 'docs');

  // Configura a porta do servidor
  await app.listen(configService.getOrThrow<number>('port'));
}

bootstrap();
