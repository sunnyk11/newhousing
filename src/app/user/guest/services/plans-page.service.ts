import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlansPageService {

  constructor(
    private apiService: ApiService
  ) { }

  getRentPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_enabled_rent_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getRentFeatures(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_rent_features";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getLetOutPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_enabled_letout_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  getLetOutFeatures(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_letout_features";
    return this.apiService.get<ResultModel>(route, reqModel);
  }

  postSelectedRentPlan(reqModel: any): Observable<ResultModel> {
    //console.log(reqModel);
    const route = "/api/auth/post_selected_rent_plan";
    return this.apiService.post1<ResultModel>(route, reqModel);
  }

  postSelectedPlan(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/post_selected_plan";
    return this.apiService.post1<ResultModel>(route, reqModel);
  }

  proceedToPaymentRent(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/plans_rent_payment/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  
  remaing_plans_rent_payment(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/remaing_plans_rent_payment/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  generateRentInvoice(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/generate_rent_invoice";
    return this.apiService.post<ResultModel>(route, { orderID: reqModel });
  }

  getInvoiceDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_invoice_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  getRentOrderDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_rent_order_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  getOrderDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_order_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  proceedToPayment(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/plans_payment/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }

  generateInvoice(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/generate_invoice";
    return this.apiService.post<ResultModel>(route, { orderID: reqModel });
  }

  crm_call(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/crm_api_call";
    return this.apiService.post<ResultModel>(route, { id: reqModel });
  }
  crm_call_appionment(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/crm_call_appionment";
    return this.apiService.post<ResultModel>(route, { id: reqModel });
  }
}
