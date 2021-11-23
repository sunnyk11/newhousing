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
    const route = "/api/auth/get_areas";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getAmenities(reqModel:any): Observable<ResultModel> {
    const route = "/api/amenities";
    return this.apiService.get<ResultModel>(route, reqModel);
  } 
  get_pincodebyid(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_pincodebyid";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
