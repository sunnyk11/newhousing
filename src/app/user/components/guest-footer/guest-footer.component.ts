import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-guest-footer',
  templateUrl: './guest-footer.component.html',
  styleUrls: ['./guest-footer.component.css']
})
export class GuestFooterComponent implements OnInit {

  public toll_free=environment.toll_free;
  public App_version=environment.App_version;
  constructor() { }

  ngOnInit(): void {
  }

}
