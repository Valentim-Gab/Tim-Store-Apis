import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    console.log(request.cookies.access_token)

    return data ? request.cookies?.[data] : request.cookies
  },
)
