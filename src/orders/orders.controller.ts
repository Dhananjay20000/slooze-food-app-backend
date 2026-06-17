import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // Protects routes with authentication and role authorization
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Admin + Manager + Member (With Country Isolation)
  @Get()
  // @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  getOrders(@Req() req: any) {
    const user = req.user; 
    return this.ordersService.getOrders(user);
  }

  // Admin + Manager + Member
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  createOrder(@Body() body: any, @Req() req: any) {
    const user = req.user;
    return this.ordersService.createOrder(body, user);
  }

  // Admin + Manager only
  @Patch(':id/checkout')
  @Roles(Role.ADMIN, Role.MANAGER)
  checkoutOrder(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.ordersService.checkoutOrder(id, user);
  }

  // Admin + Manager only
  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.MANAGER)
  cancelOrder(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.ordersService.cancelOrder(id, user);
  }
}