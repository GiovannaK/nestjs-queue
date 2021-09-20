import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareBuilder } from '@nestjs/core';
import { Queue } from 'bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateUserController } from './create-user/create-user.controller';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { SendMailProducerService } from './jobs/sendMail-producer-service';
import {createBullBoard} from 'bull-board'
import {BullAdapter} from 'bull-board/bullAdapter'

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'sendEmail-queue',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      }
    }),
  ],
  controllers: [AppController, CreateUserController],
  providers: [AppService, SendMailProducerService, SendMailConsumer],
})
export class AppModule {
  constructor(
    @InjectQueue('sendEmail-queue') private sendMailQueue: Queue
  ){}

  configure(consumer: MiddlewareBuilder){
    const {router} = createBullBoard([
      new BullAdapter(this.sendMailQueue)
    ])
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
