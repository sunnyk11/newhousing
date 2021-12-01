import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlansServiceService {

  constructor(
    private apiService: ApiService
    ) { }

  getUserInvoices(reqModel:any): Observable<ResultModel> {
    const route = "/api/auth/get_user_invoices/"; 
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  getLetOutPlans(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_letout_plans";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getLetOutPlans_Features(reqModel: any): Observable<ResultModel> {
    const route = "/api/getLetOutPlans_Features";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  getLetOutFeatures(reqModel: any): Observable<ResultModel> {
    const route = "/api/get_letout_features";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  postSelectedPlan(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/post_selected_plan";
    return this.apiService.post1<ResultModel>(route, reqModel);
  }
  getOrderDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_order_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  proceedToPayment(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/plans_payment/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  getInvoiceDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_invoice_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  product_invoice_Details(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/product_invoice_Details";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
  generateInvoice(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/generate_invoice";
    return this.apiService.post<ResultModel>(route,reqModel);
  }
  getRentOrderDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_rent_order_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  getPropertyDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/get_property_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  updatePropertyDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/update_property_details/";
    return this.apiService.get<ResultModel>(route + reqModel);
  }
  updateInvoiceDetails(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/update_invoice_details";
    return this.apiService.get<ResultModel>(route ,reqModel);
  }
}
