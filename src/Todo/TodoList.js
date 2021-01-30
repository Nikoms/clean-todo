import {useEffect, useMemo, useState} from 'react';
import {v4} from 'uuid';

function createTodo(title, done) {
  return {id: v4(), title, done};
}

const fetchTodosFromApi = async () => {
  return [
    createTodo('Frozen yoghurt', false),
    createTodo('Ice cream sandwich', false),
    createTodo('Eclair', false),
    createTodo('Cupcake', false),
    createTodo('Gingerbread', false),
  ];
};

class TodoListPresenter {
  constructor(getTodos) {
    this.useCase = {
      getTodos,
    };
    this.viewModelListener = (viewModel) => null;
    this.viewModel = {
      todos: [],
      doneCount: 0,
      ongoingCount: 0,
      clickCount: 0,
    };
  }

  loadTodos() {
    this.useCase.getTodos().then(todos => this._setTodoList(todos));
  }

  incrementClickCount() {
    this.viewModel.clickCount += 1;
    this.viewModelListener({...this.viewModel});
  }

  onViewModelChange(callback) {
    this.viewModelListener = callback;
  }

  addEmptyTodo() {
    this._setTodoList([createTodo('Relax! Edition will come...', false), ...this.viewModel.todos]);
  }

  _setTodoList(todos) {
    this.viewModel.todos = todos;
    this.viewModel.doneCount = todos.filter(t => t.done).length;
    this.viewModel.ongoingCount = todos.filter(t => !t.done).length;

    this.viewModelListener({...this.viewModel});
  }

  toggleDone(index) {
    this._setTodoList([
      ...this.viewModel.todos.slice(0, index),
      {...this.viewModel.todos[index], done: !this.viewModel.todos[index].done},
      ...this.viewModel.todos.slice(index + 1)]);
  }
}

const TodoList = ({presenter, viewModel}) => {
  useEffect(() => {
    presenter.loadTodos();
  }, [presenter]);

  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos ({viewModel.ongoingCount} ongoing
          /{viewModel.doneCount} done/ {viewModel.clickCount} clicks)
          <button onClick={() => presenter.addEmptyTodo()}>Add</button>
        </th>
      </tr>
      </thead>
      <tbody>
      {viewModel.todos.map((todo, index) => (
        <tr key={todo.id}>
          <td onClick={() => presenter.incrementClickCount()}>{todo.title}</td>
          <td><input type="checkbox" value="1" checked={todo.done} onChange={() => presenter.toggleDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export const withMVP = (Wrapped) =>
  function WithTodoPresenter() {
    const [viewModel, setViewModel] = useState();

    const presenter = useMemo(() => {
      const presenter = new TodoListPresenter(fetchTodosFromApi);
      presenter.onViewModelChange(setViewModel);
      return presenter;
    }, []);

    return <Wrapped presenter={presenter} viewModel={viewModel || presenter.viewModel}/>;
  };


export default withMVP(TodoList);
