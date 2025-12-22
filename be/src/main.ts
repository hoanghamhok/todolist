import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { ValidationPipe} from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, //Remove properties that are not defined in DTOs
                        transform: true }), //auto convert data type,
  );

  const config = new DocumentBuilder()
    .setTitle('To Do List API')
    .setVersion('1.0')
    .build()
  
  const document = SwaggerModule.createDocument(app,config);

  SwaggerModule.setup('swagger',app,document);
  const port =process.env.PORT || 4000;

  await app.listen(port,'0.0.0.0');
}
bootstrap();
