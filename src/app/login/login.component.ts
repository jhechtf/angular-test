import { Component, OnInit, OnDestroy } from '@angular/core';
import { CognitoService } from '../cognito.service';
import { FormControl } from '@angular/forms';
import { CognitoUser } from '@aws-amplify/auth';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: CognitoUser | null = null;

  username = new FormControl<string>('');
  password = new FormControl<string>('');
  sub:  Subscription | null = null;

  constructor(private cognito: CognitoService, private activeRoute: ActivatedRoute, private router: Router ) {}

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (this.username.value && this.password.value) 
      this.cognito.login(this.username.value, this.password.value)
        .then(res => {this.user = res; this.router.navigate(['/']) });
  }

  ngOnInit(): void {
    this.sub = this.cognito.cognitouser.subscribe(user => {
      this.user = user
    });
  }
  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
