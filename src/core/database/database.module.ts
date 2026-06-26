import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createClient } from 'redis';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'REDIS',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          url: configService.get<string>('REDIS_URL'),
        });

        await client.connect();
        client.on('error', (err) => {
          console.log(err);
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS'],
})
export class DatabaseModule {}
