import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';

import { RolesGuard } from './guards/roles.guard';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    RestaurantsModule,
    PaymentsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}