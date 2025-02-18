import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DrinksModule } from './drinks/drinks.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    DrinksModule,
    PassportModule.register({ session: true }),
  ],
  exports: [PrismaService],
  providers: [PrismaService],
})
export class AppModule {}
