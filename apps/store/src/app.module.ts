import { Module } from '@nestjs/common'
import { UserModule } from './routers/user/user.module'
import { AuthModule } from './security/auth/auth.module'
import { PrismaModule } from 'nestjs-prisma'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { SupabaseModule } from './connections/supabase/supabase.module'
import { UserAddressModule } from './routers/user-address/user-address.module';

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
  ],
})
export class AppModule {}
