import { Controller, Post, Get, Res, Body, Param } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { Cart } from './cart.interface'

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async pay() {
    return await this.stripeService.pay()
  }

  @Post('checkout')
  async checkout(@Body() body: { cart_list: Cart[] }) {
    return this.stripeService.checkout(body.cart_list)
  }

  @Get('pay/success/checkout/session')
  paymentSuccess(@Res({ passthrough: true }) res) {
    return this.stripeService.successSession(res)
  }

  @Get('pay/:id')
  getPayment(@Param('id') id: string) {
    return this.stripeService.getPayment(id)
  }
}
