import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { property } from "@prisma/client";
// import { PropertyService } from "src/routers/property/property.service";

@Injectable()
export class PropertyGuard {//implements CanActivate {
//   constructor(private propertyService: PropertyService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const propertyId: number = Number(request.params.id);
  
//     try {
//       const property: property = await this.propertyService.findOne(propertyId);
  
//       return property.id_real_estate_agent == user.id
//     } catch (error) {
//       return false;
//     }
//   }
}
