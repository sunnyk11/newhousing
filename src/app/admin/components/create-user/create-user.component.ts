import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/user/guest/utils/validation';
import { RolesService } from '../../services/roles.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  public UserForm: any;
  public submitted: boolean = false;
  public roles_response: any;
  public response: any;
  public dropdownList: any = [];
  public dropdownList_group: any = [];
  public selectedItems = [];
  public dropdownSettings: IDropdownSettings;
  public dropdownSettings1!: IDropdownSettings;
  public item_id: number = 0;
  public item_text: string = '';
  public showLoadingIndicator: boolean = false;

  constructor(private fb: FormBuilder,
    private rolesService: RolesService,
    private router: Router,
    private toastr: ToastrService) { 
    this.UserForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      other_mobile_number: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      cpassword: ['', [Validators.required]],
      userRole: ['', Validators.required],
      area_group: ['', Validators.required],
    },
     {
      validators: ConfirmedValidator('password', 'cpassword')
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      maxHeight: 250
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'area_id',
      textField: 'area_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      maxHeight: 250
    };
   }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.getRoles();
    this.get_area_group();
  }

  get f() {
    return this.UserForm.controls;
  }

  get_area_group() {
    this.rolesService.get_area_group({ param: null }).subscribe(
      response => {
        //console.log(response);
        this.response = response;
        let area_group_data:any;
        area_group_data = this.response.area_group;
        //console.log(this.roles_response);
        for (let i = 0; i < area_group_data.length; i++) {
          this.dropdownList_group = this.dropdownList_group.concat({ area_id: area_group_data[i].id, area_text: area_group_data[i].group_name});
        }
        this.showLoadingIndicator = false;
        //console.log(this.dropdownList);
      },
      err => {
        console.log(err);
      }
    );
  }
  getRoles() {
    this.rolesService.getRoles({ param: null }).subscribe(
      response => {
        //console.log(response);
        this.response = response;
        this.roles_response = this.response.roles;
        //console.log(this.roles_response);
        for (let i = 0; i < this.roles_response.length; i++) {
          this.dropdownList = this.dropdownList.concat({ item_id: this.roles_response[i].id, item_text: this.roles_response[i].role_name});
        }
        this.showLoadingIndicator = false;
        //console.log(this.dropdownList);
      },
      err => {
        console.log(err);
      }
    );
  }

  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }

  onSubmit() {
    this.showLoadingIndicator = true;
    this.submitted = true;
    //console.log(this.UserForm);
    if (this.UserForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }
    this.rolesService.createUser(this.UserForm.value).subscribe(
      response => {
        this.showLoadingIndicator = false;
        //console.log(response);
        this.UserForm.reset();
        this.toastr.success('Successfully created User');
        this.router.navigate(['/admin/view-internal-user']);
      },
      err => {
        this.showLoadingIndicator = false;
        if(err.error.errors.email){
          this.toastr.error(err.error.errors.email, 'Something Error', {
            timeOut: 3000,
          });
        }
        else if(err.error.errors.other_mobile_number){
          this.toastr.error(err.error.errors.other_mobile_number, 'Something Error', {
            timeOut: 3000,
          });
        }
      }
    );
  }

}
