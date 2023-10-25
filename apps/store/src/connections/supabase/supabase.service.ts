import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  constructor(private config: ConfigService) {}

  createClientSupabase() {
    const supabaseURL = this.config.get('supabaseURL')
    const supabaseKEY = this.config.get('supabaseKEY')

    return createClient(supabaseURL, supabaseKEY, {
      auth: {
        persistSession: false,
      },
    })
  }
}
