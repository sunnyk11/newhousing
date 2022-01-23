import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProductListingPageService {

  constructor(
    private apiService: ApiService
    ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  getpagination(url: string,reqModel:any): Promise<Pagination> {
    const route = url;
    return this.apiService.post_pagination(route,reqModel).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
  getProperty_listing(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_list_featured";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  login_product_details(reqModel: any): Promise<Pagination> {
    const route = "/api/product/product_searching_login";
    return this.apiService.post(route,reqModel).toPromise().then(
      (response) => {
        return response as Pagination
      })
      .catch(this.handleError);
  }
  product_details(reqModel: any): Promise<Pagination> {
    const route = "/api/product/productsearching";
    return this.apiService.post(route,reqModel).toPromise().then(
      (response) => {
        return response as Pagination
      })
      .catch(this.handleError);
  }
}
