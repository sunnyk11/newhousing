import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MypropertiesService {

  constructor(
    private apiService: ApiService
    ) { }
    
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  
  agent_properties(): Promise<Pagination> {
    const route = "/api/product/agent_properties";
    return this.apiService.get(route).toPromise().then(
      (response) => {
        console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  draft_properties(): Promise<Pagination> {
    const route = "/api/product/draft_properties";
    return this.apiService.get(route).toPromise().then(
      (response) => {
        console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  property_delete(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/delete_product";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  
  getpagination(url: string): Promise<Pagination> {
    const route = url;
    return this.apiService.get_pagination(route).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
}
