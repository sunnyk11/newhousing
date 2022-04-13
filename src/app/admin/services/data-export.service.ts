import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {

  constructor(private apiService: ApiService) { }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
  
  get_invoice_data(reqModel: any): Promise<Pagination> {
    const route = "/api/admin/get_invoice_searching";
    return this.apiService.admin_get(route,reqModel).toPromise().then(
      (response) => {
        //console.log(response);
        return response as Pagination
      })
      .catch(this.handleError);
  }
  
  getpagination(url: string,reqModel:any): Promise<Pagination> {
    const route = url;
    //console.log(route);
    return this.apiService.get_admin_pagination(route,reqModel).toPromise().then(
      (response) => {
      return response as Pagination
    })
    .catch(this.handleError);
  }
}
