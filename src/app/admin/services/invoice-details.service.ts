import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDetailsService {

  apiUrl = environment.apiUrl;
  constructor(private apiService: ApiService,
    private http: HttpClient) { }

  getInvoiceDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/admin_get_invoice_data/";
    return this.apiService.admin_get<ResultModel>(route + reqModel);
  }
  getInvoiceData(): Observable<ResultModel> {
    const route = "/api/get_invoice_data";
    return this.http.get<ResultModel>(this.apiUrl + route);
  }
  
  property_rent_slip(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/admin_property_rent_slip";
    return this.apiService.admin_get<ResultModel>(route, reqModel);
  }
  
}
