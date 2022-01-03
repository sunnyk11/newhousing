import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private apiService: ApiService) { }

  login(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/admin_login";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
