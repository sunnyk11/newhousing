import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MypropertiesService {

  constructor(
    private apiService: ApiService
    ) { }

  agent_properties(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/agent_properties";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  draft_properties(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/draft_properties";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  property_delete(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/delete_product";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
