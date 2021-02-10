import {createTodo, getTodos} from './todo.service';
import {TodoListPresenter} from './TodoListPresenter';

jest.mock('./todo.service', () => ({
  ...jest.requireActual('./todo.service'),
  getTodos: jest.fn(),
}));

test('it fetches todos from api', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false), createTodo('My second todo', true)]);
  const presenter = new TodoListPresenter(getTodos);
  
  await presenter.loadTodos();
  
  const todos = presenter.immutableViewModel().todos;
  expect(todos).toHaveLength(2);
  expect(todos.find(t => t.title === 'My first todo').done).toBe(false);
  expect(todos.find(t => t.title === 'My second todo').done).toBe(true);
});

test('a todo can be set as done', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false)]);
  const presenter = new TodoListPresenter(getTodos);
  await presenter.loadTodos();
  
  expect(presenter.immutableViewModel().ongoingCount).toBe(1);
  expect(presenter.immutableViewModel().doneCount).toBe(0);

  presenter.toggleDone(0);

  expect(presenter.immutableViewModel().ongoingCount).toBe(0);
  expect(presenter.immutableViewModel().doneCount).toBe(1);
});

test('a todo can be set as ongoing', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', true)]);
  const presenter = new TodoListPresenter(getTodos);
  await presenter.loadTodos();

  expect(presenter.immutableViewModel().ongoingCount).toBe(0);
  expect(presenter.immutableViewModel().doneCount).toBe(1);

  presenter.toggleDone(0);

  expect(presenter.immutableViewModel().ongoingCount).toBe(1);
  expect(presenter.immutableViewModel().doneCount).toBe(0);
});

test('a todo can be added', async () => {
  getTodos.mockResolvedValue([]);
  const presenter = new TodoListPresenter(getTodos);
  await presenter.loadTodos();
  expect(presenter.immutableViewModel().todos).toHaveLength(0);
  
  presenter.addEmptyTodo();
  
  const newTodos = presenter.immutableViewModel().todos;
  expect(newTodos).toHaveLength(1);
  expect(newTodos[0].done).toBe(false);
});
