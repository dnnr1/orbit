import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { db } from '@orbit/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'DATABASE',
      useValue: db,
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}