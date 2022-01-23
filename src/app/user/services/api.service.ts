import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Authorization": "NA"
    };
    const authToken = this.jwtService.getToken();
    if (authToken.length > 0) {
      headersConfig['Authorization'] = 'Bearer ' + authToken;
    }
    return new HttpHeaders(headersConfig);
  }

  private setHeaders1(): HttpHeaders {
    const headersConfig = {
      Accept: "application/json",
      "Authorization": "NA"
    };
    const authToken = this.jwtService.getToken();
    if (authToken.length > 0) {
      headersConfig['Authorization'] = 'Bearer ' + authToken;
    }
    return new HttpHeaders(headersConfig);
  }

  /* For Admin API calls - Start */

  private setAdminHeaders(): HttpHeaders {
    const headersConfig = {
      Accept: "application/json",
      "Authorization": "NA"
    };
    const authToken = this.jwtService.getAdminToken();
    if (authToken.length > 0) {
      headersConfig['Authorization'] = 'Bearer ' + authToken;
    }
    return new HttpHeaders(headersConfig);
  }

  /* For Admin API calls - End */

  private formatErrors(error: any) {
    return throwError(error);
  }

  get<ResultModel>(
    path: string,
    searchParams: HttpParams = new HttpParams()): Observable<ResultModel> {
    if (searchParams) {
      const activatedRoute = this.router.url.split("/");
      //console.log(activatedRoute);
      Object.assign(searchParams, {
        Route: activatedRoute[activatedRoute.length - 1]
      });
    }

    return this.http.get<ResultModel>(`${environment.apiUrl}${path}`, {
      headers: this.setHeaders(),
      params: searchParams
    }).pipe(catchError(this.formatErrors))
  }

  admin_get<ResultModel>(
    path: string,
    searchParams: HttpParams = new HttpParams()): Observable<ResultModel> {
    if (searchParams) {
      const activatedRoute = this.router.url.split("/");
      //console.log(activatedRoute);
      Object.assign(searchParams, {
        Route: activatedRoute[activatedRoute.length - 1]
      });
    }

    return this.http.get<ResultModel>(`${environment.apiUrl}${path}`, {
      headers: this.setAdminHeaders(),
      params: searchParams
    }).pipe(catchError(this.formatErrors))
  }


  get1<ResultModel>(
    path: string,
    searchParams: HttpParams = new HttpParams()
  ): Observable<ResultModel> {
    return this.http.get<ResultModel>(`${environment.apiUrl}${path}`, {
      headers: this.setHeaders(),
      params: searchParams
    }).pipe(catchError(this.formatErrors))
  }

  get_pagination<ResultModel>(
    path: string,
    searchParams: HttpParams = new HttpParams()
  ): Observable<ResultModel> {
    return this.http.get<ResultModel>(`${path}`, {
      headers: this.setHeaders(),
      params: searchParams
    }).pipe(catchError(this.formatErrors))
  }

  get_admin_pagination<ResultModel>(
    path: string,
    searchParams: HttpParams = new HttpParams()
  ): Observable<ResultModel> {
    return this.http.get<ResultModel>(`${path}`, {
      headers: this.setAdminHeaders(),
      params: searchParams
    }).pipe(catchError(this.formatErrors))
  }
  post_pagination<ResultModel>(
    path: string,
    searchParams: HttpParams = new HttpParams()
  ): Observable<ResultModel> {
    return this.http.get<ResultModel>(`${path}`, {
      headers: this.setAdminHeaders(),
      params: searchParams
    }).pipe(catchError(this.formatErrors))
  }

  put<ResultModel>(path: string, body: object = {}): Observable<ResultModel> {

    return this.http
      .put<ResultModel>(`${environment.apiUrl}${path}`, JSON.stringify(body), {
        headers: this.setHeaders()
      })
      .pipe(catchError(this.formatErrors));
  }

  post<ResultModel>(path: string, body: Object = {}): Observable<ResultModel> {

    return this.http
      .post<ResultModel>(`${environment.apiUrl}${path}`, body, {
        headers: this.setHeaders()
      })
      .pipe(catchError(this.formatErrors));
  }

  /* For Admin API calls - Start */

  admin_post<ResultModel>(path: string, body: Object = {}): Observable<ResultModel> {

    return this.http
      .post<ResultModel>(`${environment.apiUrl}${path}`, body, {
        headers: this.setAdminHeaders()
      })
      .pipe(catchError(this.formatErrors));
  }

  /* For Admin API calls - End */

  post1<ResultModel>(path: string, body: any): Observable<ResultModel> {

    return this.http
      .post<ResultModel>(`${environment.apiUrl}${path}`, body, {
        headers: this.setHeaders1()
      })
      .pipe(catchError(this.formatErrors));
  }


  patch<ResultModel>(path: string, body: Object = {}): Observable<ResultModel> {
    return this.http
      .patch<ResultModel>(`${environment.apiUrl}${path}`, body, {
        headers: this.setHeaders()
      })
      .pipe(catchError(this.formatErrors));
  }

  /*delete<ResultModel>(path: string): Observable<ResultModel> {
    return this.http.delete<ResultModel>(`${environment.apiUrl}${path}`, { headers: this.setHeaders() })
      .pipe(catchError(this.formatErrors));
  }*/

  delete<ResultModel>(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<ResultModel> {

    return this.http
      .delete<ResultModel>(`${environment.apiUrl}${path}`, {
        headers: this.setHeaders(),
        params: params
      })
      .pipe(catchError(this.formatErrors));
  }
}
