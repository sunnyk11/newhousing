import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getAverage'
})
export class GetAveragePipe implements PipeTransform {
  public totalVal:number=0;
  public percentage:any;
  public average:any;

  transform(value: number, args?: any): any {
    return this.getAverage(value);
  }
  
  getAverage(review: any) {
    for(let i=0; i< review.length; i++) {
      this.totalVal += Number(review[i].stars);
    }
    this.average=this.totalVal/review.length;
    this.percentage=(this.average*100)/this.totalVal;
    return this.percentage*this.totalVal/100;
    }

}
