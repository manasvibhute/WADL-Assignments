import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  onSubmit() {
    this.userService.login(this.credentials).subscribe(
      response => {
        // Handle success, e.g., store token, navigate to profile
        console.log('Login successful', response);
      },
      error => {
        this.errorMessage = error.error.message || 'Login failed';
      }
    );
  }
}