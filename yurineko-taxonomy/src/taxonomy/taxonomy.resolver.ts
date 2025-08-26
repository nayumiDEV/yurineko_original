import { Args, Query, Resolver } from '@nestjs/graphql';
import { Taxonomy } from './model';
import { TaxonomyService } from './taxonomy.service';

@Resolver(of => Taxonomy)
export class TaxonomyResolver {
  constructor(
    private readonly taxonomyService: TaxonomyService
  ) { }

  @Query(returns => Taxonomy)
  async findTaxonomyById(@Args('mId') mId: number) {
    return this.taxonomyService.findById(mId);
  }

  @Query(returns => Taxonomy)
  async findTaxonomyBySlug(@Args('mSlug') mSlug: string) {
    return this.taxonomyService.findBySlug(mSlug);
  }

  @Query(returns => [Taxonomy])
  async findTaxonomyByName(@Args('mType') mType: string, @Args('mName', { nullable: true }) mName: string) {
    return this.taxonomyService.findByName(mType, mName);
  }
}
