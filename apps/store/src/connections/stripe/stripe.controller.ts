import { Controller, Post, Get, Res } from '@nestjs/common'
import { StripeService } from './stripe.service'

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async pay() {
    return await this.stripeService.pay()
  }

  @Get('pay/success/checkout/session')
  paymentSuccess(@Res({ passthrough: true }) res) {
    return this.stripeService.successSession(res)
  }
}
