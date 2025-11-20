import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, path: string): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('Documentação da API do E-commerce')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(path, app, swaggerDocument);
}
