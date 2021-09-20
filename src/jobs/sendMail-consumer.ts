import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CreateUserDto } from "src/create-user/createUserDto";

@Processor('sendEmail-queue')
export class SendMailConsumer{
  constructor(
    private mailService: MailerService
  ){}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDto>){
    const {data} = job;
    await this.mailService.sendMail({
      to: data.email,
      from: "Test <test@mail.com>",
      subject: 'Welcome!',
      text: `Olá ${data.name}`
    })
  }
}