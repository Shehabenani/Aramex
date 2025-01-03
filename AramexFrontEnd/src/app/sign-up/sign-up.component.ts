import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  phone_number: string = '';
  role: string = ''; //adding role attribute
  orders: any[]=[];
  isSignedUp: boolean = false;
  errorMsg: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ////////////////function that sends data to the HTTP /////////////////
  sendDataToServer(userData: any): Observable<any> {
    console.log('Payload:', JSON.stringify(userData));
    return this.http.post('http://127.0.0.1:8000/postUser', userData, {
      headers: { 'Content-Type': 'application/json' }, // transforming the data to json format
    }); // Sending POST request
  }

  //////// function for the click button ////////////
  onSubmit(signupForm: NgForm) {
    if (signupForm.valid) {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        phone_number: this.phone_number,
        role: this.role,
        orders: this.orders,
        
      };
      this.isSignedUp = true;

      this.errorMsg = ''; ///////reset the previous err msg

      this.sendDataToServer(userData).subscribe({
        next: (response) => {
          console.log('Server response:', response);
          this.isSignedUp = true;
          this.errorMsg = '';
          console.log('SignUp successfully', userData);
          this.userService.setUsername(this.name);

          if (this.role === 'user') {
            this.router.navigate(['/user']);
          } else if (this.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/courier']);
          }
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.isSignedUp = false;
          this.errorMsg = 'Sign-Up Failed! ';
        },
      });
    } else {
      console.log('Form is invalid');
      this.isSignedUp = false;
      this.errorMsg = 'Sign-Up Failed! ';
    }
  }
}
