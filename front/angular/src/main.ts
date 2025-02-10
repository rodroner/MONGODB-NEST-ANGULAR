import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/core/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  /*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/core/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });

  await app.listen(3000);
}
bootstrap();
*/

