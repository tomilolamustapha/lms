import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { loginUserDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { registerRes } from 'src/user/types/regRes.type';

export type User = {
  firstname: String;
  lastname: String;
  fullname: String;
  email: String;
  phoneNumber: String;
  role: String;
  Status: Boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private token: string;

  async signInUser(data: loginUserDto): Promise<registerRes> {
    const { email, password } = data;

    const findUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!findUser) {
      throw new BadRequestException('Incorrect Email or Password');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: findUser.password,
    });

    if (!isMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (findUser.Status == false) {
      throw new BadRequestException(
        'Your Account Has been Disabled, Please Contact Support',
      );
    }

    if (findUser.email) {
      delete findUser.password;
      const tokens = await this.getUserTokens(findUser.id, findUser);
      return {
        message: 'Login Successful',
        user: findUser,
        access_token: tokens.access_token,
      };
    }
  }

  async getUserTokens(userId: number, user: User) {
    const [at] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          user,
        },
        {
          secret: 'user-secret',
          expiresIn: 60 * 60,
        },
      ),
    ]);

    await this.storeUserAccessToken(userId, at);

    return {
      access_token: at,
    };
  }

  async storeUserAccessToken(userId: number, accessToken: string) {
    await this.prisma.userAccessToken.create({
      data: {
        accessToken,
        userId,
      },
    });
  }

  async signOutUser(userId: string, accessToken: string) {
    await this.prisma.userAccessToken.update({
      where: { accessToken: accessToken },
      data: { revoked: true },
    });

    return {
      message: 'signout succcessful',
    };
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}
