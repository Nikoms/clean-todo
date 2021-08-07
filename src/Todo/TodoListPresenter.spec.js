import {createTodo} from './todo.service';
import {TodoListPresenter} from './TodoListPresenter';

jest.mock('./todo.service', () => ({
  ...jest.requireActual('./todo.service'),
  getTodos: jest.fn(),
}));

test('The list can be fully reloaded', () => {
  const presenter = new TodoListPresenter({});
  let viewModel = {};
  presenter.onViewModelChange((vm) => viewModel = vm);
  presenter.forceList([createTodo('hello', true)])

  expect(viewModel.todos).toHaveLength(1);
  expect(viewModel.todos.find(t => t.title === 'hello').done).toBe(true);
});

test('The presenter does not emit any change if the list has exactly the same pointer', () => {
  const presenter = new TodoListPresenter({});
  let changes = 0;
  presenter.onViewModelChange(() => changes = changes + 1);
  const todos = [createTodo('hello', true)];

  presenter.forceList(todos);
  expect(changes).toBe(1);

  presenter.forceList(todos);
  expect(changes).toBe(1);
});
