import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)], // forwardRef para usar AuthModule dentro de UserModule e evitar dependecia circular
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
