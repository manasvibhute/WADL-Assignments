import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      user => {
        this.user = user;
      },
      error => {
        this.errorMessage = error.error.message || 'Failed to load user data';
      }
    );
  }
}