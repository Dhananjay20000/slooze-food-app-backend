import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { OrderStatus } from '@prisma/client'; 

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getOrders(user: any) {
    if (user.role === 'ADMIN') {
      return this.prisma.order.findMany();
    }

    // Cast the where block to 'any' to stop the country property error
    return this.prisma.order.findMany({
      where: {
        country: user.country, 
      } as any,
    });
  }

  async createOrder(body: any, user: any) {
    const newOrder = await this.prisma.order.create({
      data: {
        ...body,
        country: user.country, 
        userId: user.id,
      },
    });

    return {
      message: 'Order created successfully',
      data: newOrder,
    };
  }

  async checkoutOrder(id: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: id }, 
    }) as any;

    if (!order) {
      throw new Error('Order not found');
    }

    if (user.role !== 'ADMIN' && order.country !== user.country) {
      throw new ForbiddenException(
        `Access Denied: You cannot modify orders associated with ${order.country}.`
      );
    }

    // Changed OrderStatus.COMPLETED to OrderStatus.PAID to perfectly match your database schema enum
    const updatedOrder = await this.prisma.order.update({
      where: { id: id },
      data: { status: OrderStatus.PAID },
    });

    return {
      message: `Order ${id} checked out successfully`,
      data: updatedOrder,
    };
  }

  async cancelOrder(id: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
    }) as any;

    if (!order) {
      throw new Error('Order not found');
    }

    if (user.role !== 'ADMIN' && order.country !== user.country) {
      throw new ForbiddenException(
        `Access Denied: You cannot modify orders associated with ${order.country}.`
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: id },
      data: { status: OrderStatus.CANCELLED },
    });

    return {
      message: `Order ${id} cancelled successfully`,
      data: updatedOrder,
    };
  }
}