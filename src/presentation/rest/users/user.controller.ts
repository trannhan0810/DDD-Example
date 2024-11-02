import { GetAllUseCase } from '@application/use-cases/user/get-all-user';
import { GetOneUseCase } from '@application/use-cases/user/get-one-user';
import { Controller, Get, Module, Param, Query } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly getAllUseCase: GetAllUseCase, private readonly getOneUseCase: GetOneUseCase) {}

  @Get()
  findAll(@Query('q') q: string) {
    return this.getAllUseCase.process(q);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.getOneUseCase.process(id);
  }
}

@Module({
  imports: [],
  controllers: [UserController],
  providers: [GetAllUseCase, GetOneUseCase],
})
export class RestUserApiModule {}
