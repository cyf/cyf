import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import { join } from 'path'
import { AppModule } from './app.module'

const RENDER_GIT_BRANCH = process.env.RENDER_GIT_BRANCH
const RENDER_GIT_COMMIT = process.env.RENDER_GIT_COMMIT
const RENDER_GIT_REPO_SLUG = process.env.RENDER_GIT_REPO_SLUG

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser('cookie-parser-secret'))
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax', //csrf security
      },
    }),
  )

  // Use compression
  app.use(compression())
  // Use Helmet
  app.use(helmet())
  // Enable Cors
  app.enableCors({
    origin: [/chenyifaer\.com/, /localhost:3000/],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setGlobalPrefix('/api')

  const config = new DocumentBuilder()
    .setTitle('CYF')
    .setDescription('Api Server for CYF.')
    .setContact('kjxbyz', 'https://kjxbyz.com', 'kjxbyz@163.com')
    .addGlobalParameters(
      {
        name: 'x-sign',
        in: 'header',
      },
      {
        name: 'x-token',
        in: 'header',
      },
      {
        name: 'x-version',
        in: 'header',
      },
      {
        name: 'x-locale',
        in: 'header',
      },
      {
        name: 'nonce',
        in: 'query',
      },
      {
        name: 'timestamp',
        in: 'query',
      },
    )

  if (RENDER_GIT_REPO_SLUG && RENDER_GIT_BRANCH) {
    config
      .setLicense(
        'MIT',
        `https://github.com/${RENDER_GIT_REPO_SLUG}/blob/${RENDER_GIT_BRANCH}/LICENSE`,
      )
      .setExternalDoc(
        `${RENDER_GIT_BRANCH}`,
        `https://github.com/${RENDER_GIT_REPO_SLUG}/commit/${RENDER_GIT_COMMIT}`,
      )
  }

  const document = SwaggerModule.createDocument(app, config.build(), {})
  SwaggerModule.setup('api', app, document)

  await app.listen(3001)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
