import { Injectable } from '@angular/core';
declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Injectable({
  providedIn: 'root'
})

export class GtmserviceService {

  constructor() { window.dataLayer = window.dataLayer || [];}
  
  initializeDataLayer(): void {
    // Fetch and inject the necessary data dynamically
    // Update the data layer with the fetched data
    this.fetchAndInjectData().then((data) => {
      window.dataLayer.push(data);
      // Continue loading GTM container code after the data layer is populated
      this.loadGTMContainer();
    });
  }
  fetchAndInjectData(): Promise<any> {
    return new Promise<any>((resolve) => {
      // Implement the logic to fetch the necessary data dynamically
      const data = {
        // Define the data properties dynamically
      };
      resolve(data);
    });
  }
  loadGTMContainer(): void {
    // Load the GTM container code dynamically
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5TRMBQJ';
    script.async = true;
    document.head.appendChild(script);
  }
  
}
declare var dataLayer: any[];

