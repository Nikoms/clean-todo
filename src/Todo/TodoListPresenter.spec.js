import {createTodo, getTodos} from './todo.service';
import {TodoListPresenter} from './TodoListPresenter';

jest.mock('./todo.service', () => ({
  ...jest.requireActual('./todo.service'),
  getTodos: jest.fn(),
}));

test('it fetches todos from api', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false), createTodo('My second todo', true)]);
  const presenter = new TodoListPresenter({getTodos});
  let viewModel = {};
  presenter.onViewModelChange((vm) => viewModel = vm);

  await presenter.loadTodos();

  expect(viewModel.todos).toHaveLength(2);
  expect(viewModel.todos.find(t => t.title === 'My first todo').done).toBe(false);
  expect(viewModel.todos.find(t => t.title === 'My second todo').done).toBe(true);
});

test('a todo can be set as done', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false)]);
  const presenter = new TodoListPresenter({getTodos});
  let viewModel = {};
  presenter.onViewModelChange((vm) => viewModel = vm);
  await presenter.loadTodos();

  expect(viewModel.ongoingCount).toBe(1);
  expect(viewModel.doneCount).toBe(0);

  presenter.toggleDone(0);

  expect(presenter.immutableViewModel().ongoingCount).toBe(0);
  expect(presenter.immutableViewModel().doneCount).toBe(1);
});

test('a todo can be set as ongoing', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', true)]);
  const presenter = new TodoListPresenter({getTodos});
  let viewModel = {};
  presenter.onViewModelChange((vm) => viewModel = vm);
  await presenter.loadTodos();

  expect(viewModel.ongoingCount).toBe(0);
  expect(viewModel.doneCount).toBe(1);

  presenter.toggleDone(0);

  expect(viewModel.ongoingCount).toBe(1);
  expect(viewModel.doneCount).toBe(0);
});

test('a todo can be added', async () => {
  getTodos.mockResolvedValue([]);
  const presenter = new TodoListPresenter({getTodos});
  let viewModel = {};
  presenter.onViewModelChange((vm) => viewModel = vm);
  await presenter.loadTodos();
  expect(viewModel.todos).toHaveLength(0);

  presenter.addEmptyTodo();

  expect(viewModel.todos).toHaveLength(1);
  expect((viewModel.todos)[0].done).toBe(false);
});
  
