import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterPageService {

  constructor(private apiService: ApiService) { }

  register_new(data: any): Observable<ResultModel> {
    console.log(data);
    const route = "/api/auth/user_signup_new";
    return this.apiService.post<ResultModel>(route,
      {
        first_name: data.value.firstName,
        last_name: data.value.lastName,
        email: data.value.email,
        other_mobile_number: data.value.phone_number,
        password: data.value.password,
        password_confirmation: data.value.cpassword,
        gender: data.value.gender,
        selectType: data.value.select_type,
        agree_check: data.value.tnc_check
      });
  }

  verify_otp(number: any, otp: string, email_id: string, first_name: string): Observable<any> {
    console.log(number);
    console.log(otp);
    console.log(email_id);
    console.log(first_name);
    let name = "" + number;
    const route = "/api/auth/verify";
    return this.apiService.post<ResultModel>(route,
      {
        phone_number: name,
        verification_code: otp,
        email_address: email_id,
        name_first: first_name
      });
  }
}
