import { Injectable } from '@angular/core';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private apiService: ApiService
    ) { }

  getLocationService():Promise<any>{
    return new Promise((resolve, reject)=>{
      navigator.geolocation.getCurrentPosition(resp=>{
        resolve({lng:resp.coords.longitude, lat: resp.coords.latitude,accuracy: resp.coords.accuracy})
       
       })
     })
  }
  get_locality(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_locality";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_search_locality(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/search_locality/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  getAmenities(reqModel:any): Observable<ResultModel> {
    const route = "/api/amenities";
    return this.apiService.get<ResultModel>(route, reqModel);
  } 
  get_pincodebyid(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_pincodebyid";
    return this.apiService.post<ResultModel>(route, {id: reqModel});
  }
  get_sub_locality(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_sub_locality";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_state(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_state";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_district_byid(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_district_byid";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  get_locality_byid(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_locality_byid";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
