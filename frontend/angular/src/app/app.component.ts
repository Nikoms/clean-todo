import { Component } from '@angular/core';
import { TodoListPresenter } from '@frontend/app/Todo/TodoListPresenter';
import { getTodos } from '@frontend/app/Todo/todo.service';
import { TodoListViewModel } from '@frontend/app/Todo/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  presenter:TodoListPresenter;
  viewModel: TodoListViewModel;

  constructor(){
    this.presenter = new TodoListPresenter({getTodos});
    this.viewModel = this.presenter.immutableViewModel();
    this.presenter.onViewModelChange((viewModel)=>{
      this.viewModel = viewModel;
    })
  }

  ngOnInit() {
    this.presenter.loadTodos().catch(e=>console.error(e));
  }
}
