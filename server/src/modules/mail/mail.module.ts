import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { join } from 'path'
import { MailService } from './mail.service'
import { PrismaModule } from '@/modules/prisma'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_SERVER_USER,
          pass: process.env.SMTP_SERVER_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_SERVER_FROM,
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new PugAdapter({
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    }),
    PrismaModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
