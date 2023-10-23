import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
