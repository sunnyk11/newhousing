import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private apiService: ApiService) { }

  getPostDetails(slug: any): Observable<ResultModel> {
    const route = "/api/posts/";
    return this.apiService.get<ResultModel>(route + slug);
  }
}
