import { Injectable } from '@angular/core';
import { Amplify, Hub } from '@aws-amplify/core';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import config from '../config/config.json';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

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
});

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
  user = new BehaviorSubject<DerivedCognitoUser>({
    accessToken: '',
    attributes: {},
    idToken: '',
    refreshToken: '',
    username: ''
  });
  cognitouser = new ReplaySubject<CognitoUser>();
  expires_time = new Date();

  constructor(
  ) { }

  login(username:string, password: string ) {
    return Auth.signIn(username, password)
      .then((cog: CognitoUser) => {
        this.isLoggedIn = true;
        this.cognitouser.next(cog);
        const session = cog.getSignInUserSession();
        if(session) {
          const de: DerivedCognitoUser = {
            accessToken: session.getAccessToken().getJwtToken(),
            attributes: {},
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
            username: cog.getUsername(),
          }
          cog.getUserData((err, data) => {
            if (err) {
              return;
            }
            if(data) {
              for(let op of data.UserAttributes) {
                de.attributes[op.Name] = op.Value
              }
            }
            this.user.next(de);
            return ;
          })
        }
        
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
