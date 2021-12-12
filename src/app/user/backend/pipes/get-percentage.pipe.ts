import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getPercentage'
})
export class GetPercentagePipe implements PipeTransform {
  public percentage:any;
  transform(value: number, length?:number): any {
    return this.getPercentage(value,length);
  }
  getPercentage(value: any,length:any) {
    return this.percentage= (value*100)/length;
  }
}
