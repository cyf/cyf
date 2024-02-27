import { Test, TestingModule } from '@nestjs/testing'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { jwtConstants } from '@/common/constants'
import { UserModule } from '@/modules/user'
import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
import * as yaml from 'js-yaml'
import { readFileSync } from 'fs'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return yaml.load(
                readFileSync(
                  join(__dirname, '../../..', 'config.yaml'),
                  'utf8',
                ),
              ) as Record<string, any>
            },
          ],
        }),
        CacheModule.registerAsync({
          isGlobal: true,
          useFactory: async () => {
            const store = await redisStore({
              socket: {
                host: process.env.KV_HOST,
                port: +process.env.KV_PORT,
                tls: true,
              },
              username: process.env.KV_USERNAME,
              password: process.env.KV_PASSWORD,
              ttl: 60,
            })
            return {
              store: store as unknown as CacheStore,
            }
          },
        }),
        I18nModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            fallbackLanguage: configService.getOrThrow('fallback_language'),
            loaderOptions: {
              path: join(__dirname, '../../..', 'i18n/'),
              watch: true,
            },
          }),
          resolvers: [
            { use: QueryResolver, options: ['x-locale'] },
            new HeaderResolver(['x-locale']),
            new CookieResolver(),
            AcceptLanguageResolver,
          ],
          inject: [ConfigService],
        }),
        UserModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: 24 * 60 * 60 },
          verifyOptions: {
            ignoreExpiration: false,
          },
        }),
      ],
      providers: [AuthService, JwtService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
