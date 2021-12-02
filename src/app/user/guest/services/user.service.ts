import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  getUserDetails(): Observable<ResultModel> {
    const route = "/api/auth/user";
    return this.apiService.get<ResultModel>(route);
  }
}
