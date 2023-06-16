import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ip-disclaimer',
  templateUrl: './ip-disclaimer.component.html',
  styleUrls: ['./ip-disclaimer.component.css']
})
export class IpDisclaimerComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('IP Disclaimer Page');
  }

}
