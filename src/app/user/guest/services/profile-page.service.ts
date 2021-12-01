import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilePageService {

  constructor(private apiService: ApiService) { }

  uploadProfileImage(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/upload_profile_pic";
    return this.apiService.post1<ResultModel>(route, reqModel);
  }

  user_update(id:any, email: any, username: any, phone_number: any): Observable<ResultModel> {
    const route = "/api/admin/user_update_new";
    return this.apiService.post<ResultModel>(route, { id: id, email: email, name: username, other_mobile_number: phone_number });
  }

  username_update(id: any, email: any, username: any) {
    const route = "/api/admin/profile_username_update";
    return this.apiService.post<ResultModel>(route, { id: id, email: email, name: username });
  }

  phone_number_update(id: any, email: any, phone_number: any) {
    const route = "/api/admin/profile_mobile_update";
    return this.apiService.post<ResultModel>(route, { id: id, email: email, other_mobile_number: phone_number });
  }

  verify_profile_mobile(number: any, otp: string, id: number): Observable<ResultModel> {
    const route = "/api/auth/verify_profile_mob";
    return this.apiService.post<ResultModel>(route, { other_mobile_number: number, verification_code: otp, user_id: id });
  }

  password_update(old_password: any, new_password: any, confirm_password: any): Observable<ResultModel> {
    const route = "/api/auth/change_password";
    return this.apiService.post<ResultModel>(route, { old_password: old_password, new_password: new_password, confirm_password: confirm_password });
  }
}
