import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '@/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      // Diz ao Passport como encontrar o token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        'VOCE DEVE DEFINIR UMA STRING NO .ENV PRA DAR CERTO',
    });
  }

  /**
   * Esta função é chamada pelo Passport DEPOIS que ele valida
   * a assinatura do token e que ele não expirou.
   * O 'payload' é o objeto que você colocou dentro do token no login.
   */
  async validate(payload: {
    id: string;
    email: string;
    role: string;
  }): Promise<any> {
    const user = await this.userService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não existe.');
    }

    // O que você retornar aqui será anexado ao objeto 'request' -> como 'req.user'
    return user;
  }
}
