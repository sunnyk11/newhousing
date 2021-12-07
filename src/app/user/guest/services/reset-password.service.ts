import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private apiService: ApiService) { }

  verify_email(reqModel: any): Observable<ResultModel> {
    const route = "/api/check_email/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  verify_mobile(reqModel: any): Observable<ResultModel> {
    const route = "/api/reset_password_send_otp";
    return this.apiService.post<ResultModel>(route, {phone_number: reqModel});
  }

  verify_otp(mobile: any, otp: string): Observable<ResultModel> {
    const route = "/api/reset_password_verify_otp";
    return this.apiService.post<ResultModel>(route , {verification_code: otp, phone_number: mobile});
  }

  reset_password(password: any, cpassword: any, email: any): Observable<ResultModel> {
    const route = "/api/reset_password";
    return this.apiService.post<ResultModel>(route , {new_password: password, confirm_password: cpassword, email: email});
  }

  send_otp_email(email: any): Observable<ResultModel> {
    const route = "/api/reset_send_otp_email";
    return this.apiService.post<ResultModel>(route , {email: email});
  }

  verify_otp_email(email: any, otp: string): Observable<ResultModel> {
    const route = "/api/rp_verify_otp_email";
    return this.apiService.post<ResultModel>(route , {verification_code: otp, email: email});
  }
}
