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
  public clicked = false;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  }); 

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private router: Router,
    private contactService: ContactPageService) { }

  ngOnInit(): void {
    this.showLoadingIndicator = false;
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
        this.clicked = false;
        this.response = res;
        this.showLoadingIndicator = false;
        this.toastr.success('Your Query Succesfully Mail');
        this.contactForm.patchValue({
          name:'',
          email:'',
          phone:'',
          subject:'',
          message:''
        });    
        let data:any=res;
        // if(data.status==201){
          this.router.navigate(['/contact/form-submitted']);   
        // }
      },
      err => {
        this.errorMessage = err.error.message;
        this.showLoadingIndicator = false;
        //console.log(err);
      }
    );
  }
  
  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
