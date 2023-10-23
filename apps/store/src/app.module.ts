import { Module } from '@nestjs/common'
import { UserModule } from './routers/user/user.module'
import { AuthModule } from './security/auth/auth.module'
import { PrismaModule } from 'nestjs-prisma'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
// import { PropertyModule } from './routers/property/property.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule.forRoot() /* PropertyModule */,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}
