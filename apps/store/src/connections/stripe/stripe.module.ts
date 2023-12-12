import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './stripe.module.builder'
import { StripeService } from './stripe.service'
import { ConfigModule } from '@nestjs/config'
import { StripeController } from './stripe.controller'

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
  imports: [ConfigModule],
})
export class StripeModule extends ConfigurableModuleClass {}
