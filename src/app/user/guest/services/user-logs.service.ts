import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserLogsService {

  ip_address:any;
  url:any; 

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private apiService: ApiService
    ) {
      this.loadScript('../assets/resources/js/clientInfo.js'); 
     }
    public getDeviceInfo(): any {
      return this.deviceDetectorService.deviceType;
    }
    public getbrowserInfo(): any {
      return this.deviceDetectorService.browser;
    }
    public getIpAddress(): any {
      this.ip_address=localStorage.getItem('ipAddress');
      return this.ip_address;
    }
    loadScript(url: string) {
      const body = <HTMLDivElement>document.body;
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = url;
      script.async = false;
      script.defer = true;
      body.appendChild(script);
    }
    
    user_logs(reqModel: any): Observable<ResultModel> {
    const route = "/api/auth/user_logs";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
}
