import {createTodo} from './todo.service';
import {Presenter} from '../sharedKernel/Presenter';

export class TodoListPresenter extends Presenter {
  constructor({getTodos}) {
    super({
      viewModel: {
        todos: [],
        doneCount: 0,
        ongoingCount: 0,
        clickCount: 0,
      },
    });

    this.useCase = {
      getTodos,
    };
  }

  async loadTodos() {
    try {
      this._setTodoList(await this.useCase.getTodos());
    } catch (e) {
      //Do nothing for the moment
    }
  }

  incrementClickCount() {
    this.update({clickCount: this.viewModel.clickCount + 1});
  }

  addEmptyTodo() {
    this._setTodoList([createTodo('Relax! Edition will come...', false), ...this.viewModel.todos]);
  }

  _setTodoList(todos) {
    this.update({
      todos,
      doneCount: todos.filter(t => t.done).length,
      ongoingCount: todos.filter(t => !t.done).length,
    });
  }


  toggleDone(index) {
    this._setTodoList([
      ...this.viewModel.todos.slice(0, index),
      {...this.viewModel.todos[index], done: !this.viewModel.todos[index].done},
      ...this.viewModel.todos.slice(index + 1)]);
  }
}
