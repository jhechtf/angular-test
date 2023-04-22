import { Injectable } from '@angular/core';
import { Amplify, Hub } from '@aws-amplify/core';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import config from '../config/config.json';
import { ReplaySubject } from 'rxjs';

Amplify.configure({
  Auth: {
    region: config.REGION,
    userPoolId: config.POOL_ID,
    userPoolWebClientId: config.CLIENT_ID,
    oauth: {
      domain: config.COGNITO_DOMAIN,
      scope: [
        'phone',
        'email',
        'openid'
      ],
      responseType: 'code'
    }
  },
  refreshHandlers: {
    'developer': () => {

    }
  }
})

export interface DerivedCognitoUser {
  username: string;
  idToken: string;
  refreshToken: string;
  accessToken: string;
  attributes: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  
  isLoggedIn = false;

  user = new ReplaySubject<CognitoUser>();
  expires_time = new Date();

  constructor(
  ) {
    Hub.listen('auth', a => {
      if (a.payload.event === 'signIn') {
        console.info((a.payload.data as CognitoUser).getSignInUserSession()?.getAccessToken);
      }
    })
  }

  login(username:string, password: string ) {
    return Auth.signIn(username, password)
      .then((cog: CognitoUser) => {
        this.isLoggedIn = true;
        this.user.next(cog);
        return cog;
      }).catch(
        e => {
          this.isLoggedIn = false;
          throw e;
        }
      ) as Promise<CognitoUser>;
  }

  async logout() {
    try {
      await Auth.signOut({ global: true });
      this.isLoggedIn = false;
    } catch(e) {
      console.info(e);
    }
    return Auth.signOut({ global: true }).then(() => {
      this.isLoggedIn = false;
    });
  }

}
