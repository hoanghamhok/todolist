import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma:PrismaService,
        private mailService:MailService
    ) {}

    async register(email: string, password: string,username:string) {
        const user = await this.usersService.createUser(email, password,username);
        const accessToken = await this.jwtService.signAsync({ 
            sub: user.id, 
            role: user.role 
        });
        return { user, accessToken };
    }

    async login(identifier: string, password: string) {
        const user = await this.usersService.findOneByEmailOrUsername(identifier);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
        throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const publicUser = await this.usersService.getUserById(user.id);
        const accessToken = await this.jwtService.signAsync({ 
            sub: user.id, 
            role: user.role 
        });
        
        return { user: publicUser, accessToken };
    }

    async registerAdmin(email: string, password: string,username:string) {
        const user = await this.usersService.createAdmin(email, password,username);
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
        });
        return { user, accessToken };
    }

    async forgotPassword(email:string){
        const user = await this.prisma.user.findUnique({
            where:{email},
        });

        if(!user || user.provider !== 'LOCAL'){
            return;
        }

        const resetToken = randomUUID();

        await this.prisma.user.update({
            where:{id:user.id},
            data:{
                resetPasswordToken:resetToken,
                resetPasswordExpires:new Date(Date.now() +15*60*1000)
            }
        })

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await this.mailService.sendResetPassword(user.email,resetLink);
    }

    async resetPassword(token:string,newPassword:string){
        const user = await this.prisma.user.findFirst({
            where:{
                resetPasswordToken:token,
                resetPasswordExpires:{gt:new Date()}
            }
        })

        if(!user) throw new BadRequestException('Invalid Token')

        const hashed = await bcrypt.hash(newPassword,10);

        await this.prisma.user.update({
            where:{id:user.id},
            data:{
                password:hashed,
                resetPasswordExpires:null,
                resetPasswordToken:null,
            }
        })
    }
}