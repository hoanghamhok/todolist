import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(email: string, password: string,username:string) {
        const user = await this.usersService.createUser(email, password,username);
        const accessToken = await this.jwtService.signAsync({ 
            sub: user.id, 
            role: user.role 
        });
        return { user, accessToken };
    }

    async login(email: string, password: string) {
        const useremail = await this.usersService.findUserByEmail(email);
        const userusername = await this.usersService.findUserByusername(email);
        const user = useremail || userusername;
        if (!user) {
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
}