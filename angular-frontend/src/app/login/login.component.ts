import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  loginForm: FormGroup;
  role: string = '';
  returnUrl: string = '';
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.fb.group({
      
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // onSubmit(): void {
  //   const { role } = this.loginForm.value;
  //   if (role === 'Admin') {
  //     this.router.navigate(['/admin-dashboard']);
  //   } else {
  //     this.router.navigate(['/user-dashboard']);
  //   }
  // }

  onSubmit(): void {
    this.authService.login();
    this.router.navigateByUrl(this.returnUrl);
  }

  registration():void{
  this.router.navigate(['/registeration']);
  }
}
