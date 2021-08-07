import {Presenter} from '../sharedKernel/Presenter';

export class TodoListPresenter extends Presenter {
  constructor({loadTodos, toggleDone, addEmptyTodo}) {
    super({
      viewModel: {
        todos: [],
        doneCount: 0,
        ongoingCount: 0,
        clickCount: 0,
      },
    });

    this.useCase = {
      loadTodos,
      toggleDone,
      addEmptyTodo
    };
  }

  loadTodos() {
    this.useCase.loadTodos();
  }

  forceList(newList){ //Coming from redux for example :)
    if(this.viewModel.todos !== newList){
      this._setTodoList(newList);
    }
  }

  incrementClickCount() {
    this.update({clickCount: this.viewModel.clickCount + 1});
  }

  addEmptyTodo() {
    this.useCase.addEmptyTodo()
  }

  _setTodoList(todos) {
    this.update({
      todos,
      doneCount: todos.filter(t => t.done).length,
      ongoingCount: todos.filter(t => !t.done).length,
    });
  }


  toggleDone(index) {
    this.useCase.toggleDone(index);
  }
}
