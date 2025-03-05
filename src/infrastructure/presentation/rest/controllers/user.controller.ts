import { CreateUserInput } from '@application/dtos/users/create-user.dto';
import { FindAllUserResponse } from '@application/dtos/users/get-all-user.dto';
import { UserDetailResponse } from '@application/dtos/users/get-one-user.dto';
import { CreateUserUseCase } from '@application/use-cases/users/create-user';
import { FindAllUserUseCase } from '@application/use-cases/users/get-all-user';
import { GetUserDetailUseCase } from '@application/use-cases/users/get-user-detail';
import { Body, Controller, Get, Module, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUseCase: FindAllUserUseCase,
    private readonly findOneUseCase: GetUserDetailUseCase,
    private readonly createUserUserCase: CreateUserUseCase,
  ) {}

  @Get()
  @ApiResponse({ type: FindAllUserResponse })
  findAllUser(): Promise<FindAllUserResponse> {
    return this.findAllUseCase.process();
  }

  @Get(':id')
  @ApiResponse({ type: UserDetailResponse })
  findUserById(@Param('id') id: string): Promise<UserDetailResponse> {
    return this.findOneUseCase.process(id);
  }

  @Post()
  @ApiBody({ type: CreateUserInput })
  @ApiResponse({ type: UserDetailResponse })
  createUser(@Body('item') item: CreateUserInput) {
    return this.createUserUserCase.process(item);
  }
}

@Module({
  imports: [],
  controllers: [UserController],
  providers: [FindAllUserUseCase, GetUserDetailUseCase, CreateUserUseCase],
})
export class UserRestApiModule {}
