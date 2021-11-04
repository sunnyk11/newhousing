import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlansPageService {

  constructor(
    private apiService: ApiService
  ) { }

  getRentPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_rent_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getRentFeatures(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_rent_features";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getLetOutPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_letout_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getLetOutFeatures(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_letout_features";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
