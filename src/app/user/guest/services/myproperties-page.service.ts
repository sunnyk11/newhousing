import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MypropertiesPageService {

  constructor(private apiService: ApiService) { }

  get_rent_properties(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_rented_properties/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
}
