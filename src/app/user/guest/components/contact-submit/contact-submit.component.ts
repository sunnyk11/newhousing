import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-submit',
  templateUrl: './contact-submit.component.html',
  styleUrls: ['./contact-submit.component.css']
})
export class ContactSubmitComponent implements OnInit {

  constructor(
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Contact-Submit');
  }

}
