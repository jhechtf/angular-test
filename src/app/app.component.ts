import { Component } from '@angular/core';
import { CognitoService } from './cognito.service';
import { CognitoUser } from '@aws-amplify/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test';
  something: CognitoUser | null = null;
  constructor(
    private cognito: CognitoService
  ){
    this.cognito.cognitouser.subscribe(f => {
      console.info('from observer', f);
      this.something = f;
    })
  }
}
