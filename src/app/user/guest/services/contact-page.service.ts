import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContactPageService {

  constructor(private apiService: ApiService) { }

  saveContact(reqModel: any): Observable<ResultModel> {
    const route = "/api/contact-form";
    return this.apiService.post1<ResultModel>(route, reqModel);
  }
}
