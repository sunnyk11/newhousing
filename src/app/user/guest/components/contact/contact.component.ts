import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ContactPageService } from '../../services/contact-page.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public response: any;
  public showLoadingIndicator: boolean =false;
  public errorMessage: any;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
    private contactService: ContactPageService) { }

  ngOnInit(): void {
  }
  onSubmit(){
    console.log(this.contactForm.value);
    var formData: any = new FormData();
    formData.append('name', this.contactForm.value.name);
    formData.append('email', this.contactForm.value.email);
    formData.append('phone', this.contactForm.value.phone);
    formData.append('subject', this.contactForm.value.subject);
    formData.append('message', this.contactForm.value.message);
    this.contactService.saveContact(formData).subscribe(
      res => {
        //console.log(res);
        this.response = res;
        this.showLoadingIndicator = false;
        this.contactForm.reset({});
      },
      err => {
        this.errorMessage = err.error.message;
        this.showLoadingIndicator = false;
        //console.log(err);
      }
    );
  }

}
