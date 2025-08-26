import { Controller, HttpStatus } from '@nestjs/common';
import { TaxonomyCreateRequest, TaxonomyCreateResponse, TaxonomyDeleteRequest, TaxonomyDeleteResponse, TaxonomyGetByIdsRequest, TaxonomyGetByIdsResponse, TaxonomyServiceController, TaxonomyUpdateRequest, TaxonomyUpdateResponse } from './taxonomy.pb';
import { TaxonomyService } from './taxonomy.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('taxonomy')
export class TaxonomyController implements TaxonomyServiceController {
  constructor(
    private readonly taxonomyService: TaxonomyService
  ) { }

  @GrpcMethod('TaxonomyService', 'GetByIds')
  async getByIds(request: TaxonomyGetByIdsRequest): Promise<TaxonomyGetByIdsResponse> {
    const data = await this.taxonomyService.findByIds(request.mIds);
    return {
      status: HttpStatus.OK,
      error: [],
      data
    }
  }

  @GrpcMethod('TaxonomyService', 'Create')
  async create(request: TaxonomyCreateRequest): Promise<TaxonomyCreateResponse> {
    const createdTaxonomy = await this.taxonomyService.create(request);
    return {
      mId: createdTaxonomy.mId,
      status: HttpStatus.OK,
      error: []
    }
  }

  @GrpcMethod('TaxonomyService', 'Update')
  async update(request: TaxonomyUpdateRequest): Promise<TaxonomyUpdateResponse> {
    await this.taxonomyService.update(request);
    return {
      status: HttpStatus.OK,
      error: []
    }
  }

  @GrpcMethod('TaxonomyService', 'Delete')
  async delete(request: TaxonomyDeleteRequest): Promise<TaxonomyDeleteResponse> {
    await this.taxonomyService.delete(request.mId);
    return {
      status: HttpStatus.OK,
      error: []
    }
  }
}
