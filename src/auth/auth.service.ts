import {HttpStatus, Injectable, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {PrismaClient, User} from '@prisma/client';
import {LoginUserDto, RegisterUserDto} from "./dto";
import {RpcException} from "@nestjs/microservices";
import {hash, compare} from 'bcrypt';
import {JWTPayload} from "./interface";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    constructor(
        private readonly jwtService: JwtService,
    ) {
        super();
    }

    onModuleInit() {
        this.$connect()
    }

    async register(registerUserDto: RegisterUserDto) {
        const {name, email} = registerUserDto;

        try {
            const userExists = await this.user.findUnique({
                where: {email}
            });

            if (userExists) {
                throw new RpcException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: `User already exists: ${name} (${email})`
                });
            }

            const password = await hash(registerUserDto.password, 10);

            const newUser = await this.user.create({
                data: {
                    name, email, password
                }
            });

            const {password: _, ...user} = newUser;

            const token = await this.signJwt(user);

            return {
                user,
                token
            }
        } catch (err) {
            throw new RpcException(err);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const {email, password} = loginUserDto;

        try {
            const userExists = await this.user.findUnique({
                where: {email}
            });

            if (!userExists) {
                throw new RpcException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: `User with email (${email}) not found`
                });
            }

            const isMatch = await compare(password, userExists.password);

            if (!isMatch) {
                throw new RpcException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: `Invalid credentials`
                });
            }

            const {password: _, ...user} = userExists;

            const token = await this.signJwt(user);

            return {
                user,
                token
            }
        } catch (err) {
            throw new RpcException(err);
        }
    }

    async verify(token: string) {
        return 'Auth User Verify'
    }

    private async signJwt(user: JWTPayload) {
        return this.jwtService.signAsync(user)
    }
}
