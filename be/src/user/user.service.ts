import { SystemRole } from './../../node_modules/.prisma/client/index.d';
import { Injectable,ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async createUser(email: string, password: string,username:string) {
        const existemail = await this.prisma.user.findUnique({ where: { email } });
        const existusername = await this.prisma.user.findUnique({ where: { username } });
        if (existemail) {
            throw new ConflictException('Email already in use');
        }
        if (existusername) {
            throw new ConflictException('Username already in use');
        }
        const hash = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                username,
                password: hash,
                role: 'USER',
            },
        });
    }

    async findOneByEmailOrUsername(identifier: string) {
    return this.prisma.user.findFirst({
        where: {
        OR: [
            { email: identifier },
            { username: identifier },
        ],
        },
    });
    }
    
    async findUserByEmail(email:string){
        return this.prisma.user.findUnique({where:{email}});
    }

    async findUserByusername(username:string){
        return this.prisma.user.findUnique({where:{username}});
    }

    async getUserById(id:string){
        return this.prisma.user.findUnique({where:{id},select:{id:true,email:true,role:true,createdAt:true,username:true}});
    }

    async findAllUsers(){
        return this.prisma.user.findMany({select:{id:true,email:true,role:true,createdAt:true}});
    }

    async createAdmin(email: string, password: string,username:string) {
        const existemail = await this.prisma.user.findUnique({ where: { email } });
        const existusername = await this.prisma.user.findUnique({ where: { username } });
        if (existemail) {
            throw new ConflictException('Email already in use');
        }
        if (existusername) {
            throw new ConflictException('Username already in use');
        }
        const hash = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password: hash,
                username: username,
                role: 'SUPER_ADMIN',
            },
        });
    }
}

