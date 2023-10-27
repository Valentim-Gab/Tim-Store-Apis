import { Injectable } from '@nestjs/common'

@Injectable()
export class ViacepService {
  async isValidCep(zipCode: string) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)

      if (response.ok && response.status === 200) {
        const data = await response.json()

        return !data.erro
      }

      return false
    } catch (error) {
      return false
    }
  }
}
