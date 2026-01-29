import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthTokensDto } from '../common/swagger/models/auth-tokens.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.', type: AuthTokensDto })
  @ApiResponse({ status: 400, description: 'User already exists.' })
  signup(@Body() createUserDto: CreateUserDto): Promise<AuthTokensDto> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 200, description: 'Login successful.', type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() data: AuthDto): Promise<AuthTokensDto> {
    return this.authService.login(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.', type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Access Denied.' })
  refreshTokens(@Req() req: any): Promise<AuthTokensDto> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
