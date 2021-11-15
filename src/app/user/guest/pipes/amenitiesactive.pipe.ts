import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amenitiesactive'
})
export class AmenitiesactivePipe implements PipeTransform {
  public result:any=true;

  transform(value: any, length?:any): unknown {
    return this.amenties(value,length);
  }
  
  amenties(value: any,length:any) {
    for (let i = 0; i < length?.length; i++) {
        if(value==length[i]){
          this.result==true;
          return this.result;
        }
        
    }
  }

}
