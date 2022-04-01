import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';


@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private apiService: ApiService) { }

  login(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/login";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  mobile_otp_send(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/mobile_otp_send";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  mobile_login_verify_otp(mobile_no: any, otp: string): Observable<ResultModel> {
    const route = "/api/auth/mobile_login_verify_otp";
    return this.apiService.post<ResultModel>(route , {verification_code: otp, mobile_no: mobile_no});
  }
  
  user_otp_resend_login(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/user_otp_resend_login";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  getUserPhoneDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/verify_user_mobile";
    return this.apiService.get1<ResultModel>(route, reqModel);
  }
  store_fixed_appointment(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/store_fixed_appointment";
    return this.apiService.post1<ResultModel>(route, reqModel);
  }
}
