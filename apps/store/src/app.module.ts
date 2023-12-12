import { Module } from '@nestjs/common'
import { UserModule } from './routers/user/user.module'
import { AuthModule } from './security/auth/auth.module'
import { PrismaModule } from 'nestjs-prisma'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { SupabaseModule } from './connections/supabase/supabase.module'
import { UserAddressModule } from './routers/user-address/user-address.module'
import { StripeModule } from './connections/stripe/stripe.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SupabaseModule,
    UserAddressModule,
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('stripeApiKey'),
        options: {
          apiVersion: '2023-10-16',
        },
      }),
    }),
  ],
})
export class AppModule {}
