import { Component, OnInit } from '@angular/core';
import { Todo, TodosService } from '../todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  constructor(public todosService: TodosService) {
  }
  ngOnInit(): void {
    this.todosService.fetch().subscribe(f => this.todos = f);
  }
}
