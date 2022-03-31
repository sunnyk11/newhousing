import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ContactPageService } from '../../services/contact-page.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public response: any;
  public showLoadingIndicator: boolean =false;
  public errorMessage: any;
  public submitted: boolean = false;
  public toll_free=environment.toll_free;
  public returnUrl:any;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private router: Router,
    private contactService: ContactPageService) { }

  ngOnInit(): void {
    if(this.jwtService.getToken()){
      this.returnUrl = this.router.url;
      this.jwtService.saveReturnURL(this.returnUrl);
    }
  }

  get f() {
    return this.contactForm.controls;
  }
  onSubmit(){
    this.submitted = true;
    if (this.contactForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }
    this.showLoadingIndicator = true;
    //console.log(this.contactForm.value);
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
        this.toastr.success('Contact Details Saved');
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
