import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs'; 

@Pipe({
  name: 'timezone'
})
export class TimezonePipe implements PipeTransform {
  public time_zone:any;

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.get_time_zone(value);
  }
  
  get_time_zone(value: any) {
    let current:any= dayjs(value).add(330, 'minutes').format('DD MMM, YYYY hh:mm:ss a');
    return current;
  }

}
