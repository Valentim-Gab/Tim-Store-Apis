import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { MODULE_OPTIONS_TOKEN } from './stripe.module.builder'
import { StripeModuleOptions } from './stripe.interface'
import { ConfigService } from '@nestjs/config'
import { Cart } from './cart.interface'

@Injectable()
export class StripeService {
  public readonly stripe: Stripe

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: StripeModuleOptions,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(options.apiKey, options.options)
  }

  async pay() {
    const defaultApiUrl = this.config.get('defaultApiUrl')

    return await this.stripe.checkout.sessions.create({
      line_items: [{ price: 'price_1OMsdHJZmap0pLS49Yv1Erwz', quantity: 3 }],
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      customer: 'cus_PBF0VDAuacukea',
      success_url: `${defaultApiUrl}/pay/success/checkout/session?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${defaultApiUrl}/pay/failed/checkout/session`,
    })
  }

  async successSession(session) {
    console.log(session)
  }

  checkout(cartList: Cart[]) {
    const totalPrice = cartList.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    )

    return this.stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: 'brl',
      payment_method_types: ['card'],
    })
  }
}
