import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  user: CognitoUser | null = null;
  path: string = '/';
  constructor(private route: ActivatedRoute, private cognito: CognitoService, private router: Router) {

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.path = event.url;
      }
    })
  }
}
