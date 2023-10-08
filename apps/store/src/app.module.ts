import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './routers/user/user.module'
import { AuthModule } from './security/auth/auth.module'
import { PrismaModule } from 'nestjs-prisma'
// import { PropertyModule } from './routers/property/property.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule.forRoot(), /* PropertyModule */],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
