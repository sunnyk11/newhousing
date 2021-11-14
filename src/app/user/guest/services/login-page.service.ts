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

  getUserPhoneDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/verify_user_mobile";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
