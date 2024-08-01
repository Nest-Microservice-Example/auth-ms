import {Controller} from '@nestjs/common';
import {AuthService} from './auth.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {LoginUserDto, RegisterUserDto} from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @MessagePattern('auth.user.register')
    register(@Payload() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @MessagePattern('auth.user.login')
    login(@Payload() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @MessagePattern('auth.user.verify')
    verify(@Payload() token: string) {
        return this.authService.verify(token);
    }
}
