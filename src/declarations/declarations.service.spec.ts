import { Test, TestingModule } from '@nestjs/testing';
import { DeclarationsService } from './declarations.service';

describe('DeclarationsService', () => {
  let service: DeclarationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeclarationsService],
    }).compile();

    service = module.get<DeclarationsService>(DeclarationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
