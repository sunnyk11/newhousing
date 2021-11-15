import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyMobileService {

  constructor(private apiService: ApiService) { }

  mobile_verify(data: any, id: any): Observable<ResultModel> {
    const route = "/api/auth/verify_mobile";
    return this.apiService.post<ResultModel>(route, {other_mobile_number: data, user_id: id});
  }

  mobile_verify_otp(data: any, otp: string, id: number): Observable<ResultModel> {
    let name = "" + data;
    const route = "/api/auth/verify_mob";
    return this.apiService.post<ResultModel>(route, {other_mobile_number: name, verification_code: otp, user_id: id});
  }
}
