// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    // Nạp biến môi trường từ file .env
    ConfigModule.forRoot({isGlobal: true, }),
    PrismaModule,
    UsersModule,
    AuthModule,
    TasksModule,
    ProjectsModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
