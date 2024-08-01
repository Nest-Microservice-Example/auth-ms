import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ConfigEnum} from "../config";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get<string>(ConfigEnum.SECRET);

                return {
                    global: true,
                    secret: secret,
                    signInOptions: {expiresIn: '1d'}
                }
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
}
