import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {configuration} from "./config/index";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        AuthModule
    ],
})
export class AppModule {
}
