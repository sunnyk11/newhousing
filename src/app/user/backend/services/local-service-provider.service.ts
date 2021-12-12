import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LocalServiceProviderService {

  constructor(private apiService: ApiService) { }

  searching_area(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/local_service";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getarea_user_details(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/getarea_user_details";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getlocalArea(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/getlocalArea";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_service_id(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/get_service_id";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_localareaby_id(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/get_localareaby_id";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  star_ratingbyId(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/star_ratingbyId";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  service_user_reviews(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/service_user_reviews";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  // service page 
  service_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/service_created";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  getarea_service(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/getarea_service";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  sevice_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/update_service_id"; 
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  service_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/service_update";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  delete_service(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/delete_service";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  // user services list functionalty 
  service_user_create(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/service_user_create";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  service_user_update(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/service_user_update";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  getservice_user(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/service_user_list";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  delete_service_user(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/delete_service_user";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  sevice_user_get_id(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/sevice_user_get_id"; 
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
