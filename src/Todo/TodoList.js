import {useEffect, useMemo, useState} from 'react';
import {createTodo, getTodos} from './todo.service';

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
    };
  }

  loadTodos() {
    this.useCase.getTodos().then(todos => this._setTodoList(todos));
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
  const [clickCount, setClickCount] = useState(0);
  useEffect(() => {
    presenter.loadTodos();
  }, [presenter]);

  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos ({viewModel.ongoingCount} ongoing
          /{viewModel.doneCount} done/ {clickCount} clicks)
          <button onClick={() => presenter.addEmptyTodo()}>Add</button>
        </th>
      </tr>
      </thead>
      <tbody>
      {viewModel.todos.map((todo, index) => (
        <tr key={todo.id}>
          <td onClick={() => setClickCount(() => clickCount + 1)}><label htmlFor={`done-${todo.id}`}>{todo.title}</label></td>
          <td><input type="checkbox" value="1" id={`done-${todo.id}`} checked={todo.done} onChange={() => presenter.toggleDone(index)}/></td>
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
      const presenter = new TodoListPresenter(getTodos);
      presenter.onViewModelChange(setViewModel);
      return presenter;
    }, []);

    return <Wrapped presenter={presenter} viewModel={viewModel || presenter.viewModel}/>;
  };


export default withMVP(TodoList);
