import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const ReqUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    let request = context.switchToHttp().getRequest<Request>()

    return request.user
  },
)
