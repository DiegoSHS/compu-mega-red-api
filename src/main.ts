import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { FormattedResponseInterceptor } from './common/interceptors';
import { AllExceptionsFilter } from './common/filters';

function formatValidationErrors(errors: any[]) {
  // Concatena mensajes legibles en español
  const formatted = errors.map(err => {
    if (err.constraints) {
      return Object.values(err.constraints).join(', ');
    }
    if (err.children && err.children.length) {
      return formatValidationErrors(err.children);
    }
    return 'Datos inválidos en el request';
  });
  return formatted.flat().join('; ');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ValidationPipe mejorado: whitelist + transformación y mensajes personalizados en español
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => new BadRequestException(formatValidationErrors(errors)),
    }),
  );
  // Interceptor global para formatear respuestas
  app.useGlobalInterceptors(new FormattedResponseInterceptor());
  // Filtro global para manejo de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
