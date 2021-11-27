import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MyPlansPageService {

  constructor(private apiService: ApiService) { }

  getAllUserInvoices(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_all_user_invoices/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
}
