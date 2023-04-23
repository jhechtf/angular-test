import { Component, OnInit, OnDestroy } from '@angular/core';
import { CognitoService, DerivedCognitoUser } from '../cognito.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: DerivedCognitoUser = { username: '' } as DerivedCognitoUser;
  sub: Subscription | null = null;
  constructor(private cognito: CognitoService) {}

  ngOnInit(): void {
    this.sub = this.cognito.user.subscribe(f => this.user = f);
  }

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

}
