import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserReviewsService {

  constructor(private apiService: ApiService) { }
  
  get_reviews(reqModel: any): Observable<ResultModel> {
    const route = "/api/product/get_reviews";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
