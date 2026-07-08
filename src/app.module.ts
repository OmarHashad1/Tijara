import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './core/database';
import { CommonModule } from './common/services';
import { validateEnv } from './common/utils/env.utils';
import tokenConfig from './configs/token.config';
import { UserModule } from './modules/user/user.module';
import { CustomerModule as UserCustomerModule } from './modules/user/customer/customer.module';
import { AdminModule as UserAdminModule } from './modules/user/admin/admin.module';
import { AdminModule as CategoryAdminModule } from './modules/category/admin/admin.module';
import { GuestModule as CategoryGuestModule } from './modules/category/guest/guest.module';
import { AdminModule as BrandAdminModule } from './modules/brand/admin/admin.module';
import { GuestModule as BrandGuestModule } from './modules/brand/guest/guest.module';
import { AdminModule as ProductAdminModule } from './modules/product/admin/admin.module';
import { GuestModule as ProductGuestModule } from './modules/product/guest/guest.module';
import { CustomerModule as CartCustomerModule } from './modules/cart/customer/customer.module';
import { CustomerModule as WishlistCustomerModule } from './modules/wishlist/customer/customer.module';
import { CustomerModule as OrderCustomerModule } from './modules/order/customer/customer.module';
import { AdminModule as OrderAdminModule } from './modules/order/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
      validate: validateEnv,
      load: [tokenConfig],
    }),
    CommonModule,
    AuthModule,
    DatabaseModule,
    UserCustomerModule,
    UserAdminModule,
    CategoryAdminModule,
    CategoryGuestModule,
    BrandAdminModule,
    BrandGuestModule,
    ProductAdminModule,
    ProductGuestModule,
    CartCustomerModule,
    WishlistCustomerModule,
    OrderCustomerModule,
    OrderAdminModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
