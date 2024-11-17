import { CreateUserDto } from './user.dto';

import { CreateUserUseCase } from '@application/use-cases/user/create-user';
import { FindAllUserUseCase } from '@application/use-cases/user/find-all-user';
import { FindOneUserUseCase } from '@application/use-cases/user/find-one-user';
import { Body, Controller, Get, Module, Param, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUseCase: FindAllUserUseCase,
    private readonly findOneUseCase: FindOneUserUseCase,
    private readonly createUserUserCase: CreateUserUseCase,
  ) {}

  @Get()
  findAllUser() {
    return this.findAllUseCase.process();
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.findOneUseCase.process(id);
  }

  @ApiBody({ type: CreateUserDto })
  @Post()
  createUser(@Body('item') item: CreateUserDto) {
    return this.createUserUserCase.process(item);
  }
}

@Module({
  imports: [],
  controllers: [UserController],
  providers: [FindAllUserUseCase, FindOneUserUseCase, CreateUserUseCase],
})
export class UserRestApiModule {}
