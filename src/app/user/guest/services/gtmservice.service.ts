import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GtmserviceService {

  constructor() { }
  pushToDataLayer(data: any) {
    dataLayer.push(data);
  }
  
}
declare var dataLayer: any[];

