import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private apiService: ApiService) { }

  getAllRentPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_all_rent_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getAllLetOutPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_all_letout_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  update_property_plans(reqModel: any): Observable<ResultModel> {
    const route = "/api/update_property_plans";
    return this.apiService.post<ResultModel>(route, reqModel);
  }

  add_property_plan(reqModel: any): Observable<ResultModel> {
    const route = "/api/add_property_plan";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
