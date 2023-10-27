import { Module } from '@nestjs/common'
import { ViacepService } from './viacep.service'

@Module({
  providers: [ViacepService],
  exports: [ViacepService],
})
export class SupabaseModule {}
