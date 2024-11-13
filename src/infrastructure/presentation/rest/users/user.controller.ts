import { FindAllUserUseCase } from '@application/use-cases/user/find-all-user';
import { FindOneUserUseCase } from '@application/use-cases/user/find-one-user';
import { Controller, Get, Module, Param } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUseCase: FindAllUserUseCase,
    private readonly findOneUseCase: FindOneUserUseCase,
  ) {}

  @Get()
  findAll() {
    return this.findAllUseCase.process();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.findOneUseCase.process(id);
  }
}

@Module({
  imports: [],
  controllers: [UserController],
  providers: [FindAllUserUseCase, FindOneUserUseCase],
})
export class RestUserApiModule {}
