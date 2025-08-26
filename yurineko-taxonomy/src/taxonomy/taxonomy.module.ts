import { Module } from '@nestjs/common';
import { TaxonomyController } from './taxonomy.controller';
import { TaxonomyService } from './taxonomy.service';
import { TaxonomyResolver } from './taxonomy.resolver';

@Module({
  controllers: [TaxonomyController],
  providers: [TaxonomyService, TaxonomyResolver]
})
export class TaxonomyModule {}
