import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport";
import { ExtractJwt } from "passport-jwt";
import { jwtConstant } from './constants';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secret: jwtConstant.secret
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;    
    } 
}