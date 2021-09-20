import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer-service';
import { CreateUserDto } from './createUserDto';

@Controller('create-user')
export class CreateUserController {
  constructor(
    private sendMailProducerService: SendMailProducerService
  ){}

  @Post('/')
  async createUser(@Body() createUser: CreateUserDto){
    await this.sendMailProducerService.sendMail(createUser)
    return createUser;
  }
}
