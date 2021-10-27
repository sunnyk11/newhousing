import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class IndexPageService {

  constructor(
    private apiService: ApiService
  ) { }

  getAmenities(reqModel:any): Observable<ResultModel> {
    const route = "/api/amenities";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
