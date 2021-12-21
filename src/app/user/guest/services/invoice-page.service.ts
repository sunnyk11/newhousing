import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicePageService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  getInvoiceData(): Observable<ResultModel> {
    const route = "/api/get_invoice_data";
    return this.http.get<ResultModel>(this.apiUrl + route);
  }

  getUserName(email: any): Observable<ResultModel> {
    console.log(email);
    const route = "/api/get_username/";
    return this.apiService.get1<ResultModel>(route + email);
  }
}
