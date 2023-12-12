import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { MODULE_OPTIONS_TOKEN } from './stripe.module.builder'
import { StripeModuleOptions } from './stripe.interface'
import { ConfigService } from '@nestjs/config'

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
      line_items: [{ price: 'price_1OMWeVJZmap0pLS4wmGBQRF4', quantity: 3 }],
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      customer: 'cus_PAsGx3bWajmYMI',
      success_url: `${defaultApiUrl}/pay/success/checkout/session?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${defaultApiUrl}/pay/failed/checkout/session`,
    })
  }
}
