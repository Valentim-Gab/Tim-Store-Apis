import { Controller, Post } from '@nestjs/common'
import { StripeService } from './stripe.service'

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async pay() {
    return await this.stripeService.pay()
  }
}
