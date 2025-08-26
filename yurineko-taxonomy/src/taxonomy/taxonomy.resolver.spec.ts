import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomyResolver } from './taxonomy.resolver';

describe('TaxonomyResolver', () => {
  let resolver: TaxonomyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonomyResolver],
    }).compile();

    resolver = module.get<TaxonomyResolver>(TaxonomyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
