import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit {

  public submitted: boolean = false;
  public permissions_data: any;
  public arrayItems:any;
  public RoleForm: any;
  private selected_permision:any=[];

  constructor(private fb: FormBuilder,
    private router: Router,
    private rolesService: RolesService,
    private toastr: ToastrService) {
      this.RoleForm = this.fb.group({
        role_name: ['', Validators.required],
        roleDesc: [''],
        permissionsArray: this.fb.group([])
      });
     }

  ngOnInit(): void {
    this.get_permissions();
    this.selected_permision = new Array<string>();
  }

  get g() {
    return this.RoleForm.controls;
  }

  get f() {
    return this.RoleForm.controls.permissionsArray;
  }


  get_permissions() {
    this.rolesService.getPermissions({ param:null }).subscribe(
      response => {
        // console.log(response);
        this.permissions_data = response;
        const group: any = {};
        this.permissions_data.data.forEach((obj:any,index:any) => {
          //group[obj.permission_name] = new FormControl(false);
          this.f.addControl(obj.permission_name, new FormControl(false));
        });
        //console.log(group);
      },
      err => {
        console.log(err);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.RoleForm.invalid) {
      return;
    }
    //console.log(this.RoleForm);
    //console.log(this.f);
    this.rolesService.createRole(this.RoleForm.value).subscribe(
      response => {
        // console.log(response.);
        let data:any=response;
        // console.log(data);
        if(data.message == 'FAIL'){
          this.toastr.error('Atleast One Selected Permission', 'Something Error', {
            timeOut: 3000,
          });
        }
        if(data.message == 'SUCCESS'){
          this.toastr.success('Successfully created Role');
          this.router.navigate(['/admin/view-role']);
          this.RoleForm.reset();
        }
      },
      err => {
        // console.log(err.error.errors.role_name);
        this.toastr.error(err.error.errors.role_name, 'Something Error', {
          timeOut: 3000,
        });
      }
    );
  }

}
