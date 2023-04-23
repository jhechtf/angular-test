import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoService, DerivedCognitoUser } from './cognito.service';
import { Config, ConfigService } from './config.service';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  user: DerivedCognitoUser = {username: ''} as DerivedCognitoUser;
  config = {} as Config;
  todos: Todo[] = [];

  constructor(private http: HttpClient, cognito: CognitoService, private configService: ConfigService) {
    cognito.user.subscribe(f => this.user = f);
    configService.config.subscribe(conf => this.config = conf);
  }

  fetch() {
    return this.http.get<Todo[]>(
      this.config.API,
      {
        headers: {
          authorization: `Bearer ${this.user.idToken}`
        }
      }
    ).pipe(f => {
      f.subscribe(aa => this.todos = aa);
      return f;
    });
  }

  add(title: string, description: string, done = false) {
    
    return this.http.put(this.config.API, {
      title,
      description,
      done,
    });
  }

}
