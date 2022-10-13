import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-blog-post',
  templateUrl: './create-blog-post.component.html',
  styleUrls: ['./create-blog-post.component.css']
})
export class CreateBlogPostComponent implements OnInit {

  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  private selectedFile: any;
  private user_id: any;
  private files: any;
  private imagePath: any;
  public imgURL: any;
  public clicked = false;
  public isAddMode: boolean = false;
  private parsedData: any = {};
  public ftpstring: string = environment.ftpURL;
  private slug: string = '';
  private response: any;

  categories = [
    { id: 1, name: "Construction" },
    { id: 2, name: "Real Estate" },
    { id: 3, name: "Luxury" },
    { id: 4, name: "Loans" }
  ];

  public blogForm: any;

  constructor(private fb: FormBuilder,
    private blogService: BlogService,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      postImage: ['', Validators.required],
      category: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.user_id = this.jwtService.getAdminId();
    this.route.paramMap.subscribe(params => {
      const slugPost = params.get('slug');
      this.isAddMode = !slugPost;
      //console.log(this.isAddMode);
      
      if (slugPost) {
        this.getSelectedPost(slugPost);
      }
    });
  }

  getSelectedPost(slug: any) {
    this.blogService.getPostDetails(slug).subscribe(
      (returnedPost) => this.editPost(returnedPost),
      (err: any) => console.log(err)
    );
  }

  editPost(returnedPost: any) {
    //console.log(returnedPost);
    this.parsedData = returnedPost;
    //console.log(this.parsedData);
    this.imgURL = this.ftpstring + "images/" + this.parsedData[0].image_path;
    //console.log(this.imgURL);
    this.blogForm.patchValue({
      title: this.parsedData[0].title,
      description: this.parsedData[0].description,
      //postImage: this.parsedData[0].image_path,
      category: this.parsedData[0].category
    });
    //console.log(this.blogForm.controls);
  }

  get g() {
    return this.blogForm.controls;
  }

  onFileChange(event:any) {
    let files:any = event.target.files;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.error("Only Image (jpg,jpeg,png) Supported");
      this.blogForm.patchValue({ postImage:''});
      return;
    }
    this.selectedFile = event.target.files[0];
    //console.log(this.selectedFile);
    this.files = event.target.files;
    /*if (event.target.files && event.target.files.length > 0) {
      const file = (event.target.files[0] as File);
      console.log(file);
      this.blogForm.get('post_image').patchValue(file);
      console.log(this.blogForm.get('post_image').value);*/
    const reader = new FileReader();
    //console.log(reader);
    this.imagePath = this.files;
    //console.log(this.imagePath);
    reader.readAsDataURL(this.files[0]);
    reader.onload = (event) => {
      this.imgURL = event.target?.result;
    }
  }


  onSubmit() {
    if (this.isAddMode) {
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  private createPost() {
    this.submitted = true;
    this.showLoadingIndicator = true;
    if (this.blogForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }

    var formData: any = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('description', this.blogForm.value.description);
    formData.append('postImage', this.selectedFile, this.selectedFile.name);
    formData.append('category', this.blogForm.value.category);
    formData.append('created_by', this.user_id);

    this.blogService.create_post(formData).subscribe(
      res => {
        //console.log(res);
        this.showLoadingIndicator = false;
        this.toastr.success('Blog Post created successfully');
        this.blogForm.reset({});
        this.imgURL = null;
        this.selectedFile = null;
        this.router.navigate(['/admin/view-blog-posts']);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  private updatePost() {
    this.showLoadingIndicator = true;
    var updateFormData: any = new FormData();
    this.slug = this.route.snapshot.params['slug'];

    updateFormData.append('title', this.blogForm.value.title);
    updateFormData.append('description', this.blogForm.value.description);
    if (this.selectedFile) {
      updateFormData.append('postImage', this.selectedFile, this.selectedFile.name);
      //console.log(this.selectedFile);
    }
    updateFormData.append('category', this.blogForm.value.category);
    updateFormData.append('created_by', this.user_id);

    this.blogService.updatePostDetails(updateFormData, this.slug).subscribe(
      res => {
        this.response = res;
        this.toastr.success('Blog Post updated successfully');
        this.blogForm.reset({});
        this.showLoadingIndicator = false;
        this.imgURL = null;
        this.selectedFile = null;
        this.router.navigate(['/admin/view-blog-posts']);
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
}
