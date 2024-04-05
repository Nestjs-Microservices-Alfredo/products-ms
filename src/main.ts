import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Products');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      }
    },
  );

  // logger.log(`NATS Servers: ${envs.natsServers}`);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new RpcException(errors);
     }
    })
  )


  await app.listen();

  logger.log(`Products Microservice Online`);

  
}
bootstrap();
