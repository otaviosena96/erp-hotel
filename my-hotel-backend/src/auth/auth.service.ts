// auth.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminExists = await this.userRepo.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const admin = this.userRepo.create({
        username: 'admin',
        password: '123456',
      });
      await this.userRepo.save(admin);
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

    async validateUser(username: string, pass: string): Promise<any> {
      const user = await this.userRepo.findOne({ where: { username } });
    
      if (user && user.password === pass) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
}