import { CreatePersonInput } from '@application/dtos/persons/create-person.dto';
import { FindAllPersonResponse } from '@application/dtos/persons/get-all-person.dto';
import { PersonDetailResponse } from '@application/dtos/persons/get-one-person.dto';
import { CreatePersonUseCase } from '@application/use-cases/persons/create-person.use-case';
import { FindAllPersonUseCase } from '@application/use-cases/persons/get-all-person.use-case';
import { GetPersonDetailUseCase } from '@application/use-cases/persons/get-person-detail.use-case';
import { Body, Controller, Get, Module, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('persons')
export class PersonController {
  constructor(
    private readonly findAllUseCase: FindAllPersonUseCase,
    private readonly findOneUseCase: GetPersonDetailUseCase,
    private readonly createPersonPersonCase: CreatePersonUseCase,
  ) {}

  @Get()
  @ApiResponse({ type: FindAllPersonResponse })
  findAllPerson(): Promise<FindAllPersonResponse> {
    return this.findAllUseCase.process();
  }

  @Get(':id')
  @ApiResponse({ type: PersonDetailResponse })
  findPersonById(@Param('id') id: string): Promise<PersonDetailResponse> {
    return this.findOneUseCase.process(id);
  }

  @Post()
  @ApiBody({ type: CreatePersonInput })
  @ApiResponse({ type: PersonDetailResponse })
  createPerson(@Body('item') item: CreatePersonInput) {
    return this.createPersonPersonCase.process(item);
  }
}

@Module({
  imports: [],
  controllers: [PersonController],
  providers: [FindAllPersonUseCase, GetPersonDetailUseCase, CreatePersonUseCase],
})
export class PersonRestApiModule {}
