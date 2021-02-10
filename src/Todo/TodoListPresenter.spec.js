import {createTodo, getTodos} from './todo.service';
import {TodoListPresenter} from './TodoListPresenter';

jest.mock('./todo.service', () => ({
  ...jest.requireActual('./todo.service'),
  getTodos: jest.fn(),
}));

// ndlr: These are the same tests as "TodoList.spec.js", but in a "presenter style"
// FYI: Presenter tests take from 3 to 6ms. The component tests take from 285 to 425ms (average of 300 I would say).

test('it fetches todos from api', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false), createTodo('My second todo', true)]);
  
  // render(<TodoList/>);
  const presenter = new TodoListPresenter(getTodos);
  
  // expect(await screen.findByText('My first todo')).toBeInTheDocument();
  await presenter.loadTodos();

  const todos = presenter.immutableViewModel().todos;
  
  // expectTodoListCount(2);
  expect(todos).toHaveLength(2);
  
  // expect(screen.getByRole('checkbox', {name: 'My first todo'})).not.toBeChecked();
  expect(todos.find(t => t.title === 'My first todo').done).toBe(false);
  
  // expect(screen.getByRole('checkbox', {name: 'My second todo'})).toBeChecked();
  expect(todos.find(t => t.title === 'My second todo').done).toBe(true);
});

test('a todo can be set as done', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false)]);
  
  // render(<TodoList/>);
  const presenter = new TodoListPresenter(getTodos);
  
  // expect(await screen.findByText('My first todo')).toBeInTheDocument();
  await presenter.loadTodos();
  
  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 ongoing');
  expect(presenter.immutableViewModel().ongoingCount).toBe(1);
  
  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 done');
  expect(presenter.immutableViewModel().doneCount).toBe(0);
  
  // fireEvent.click(await screen.findByText('My first todo'));
  presenter.toggleDone(0);
  
  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 ongoing');
  expect(presenter.immutableViewModel().ongoingCount).toBe(0);
  
  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 done');
  expect(presenter.immutableViewModel().doneCount).toBe(1);
});

test('a todo can be set as ongoing', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', true)]);
  
  // render(<TodoList/>);
  const presenter = new TodoListPresenter(getTodos);

  // expect(await screen.findByText('My first todo')).toBeInTheDocument();
  await presenter.loadTodos();

  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 ongoing');
  expect(presenter.immutableViewModel().ongoingCount).toBe(0);
  
  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 done');
  expect(presenter.immutableViewModel().doneCount).toBe(1);

  // fireEvent.click(await screen.findByText('My first todo'));
  presenter.toggleDone(0);

  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 ongoing');
  expect(presenter.immutableViewModel().ongoingCount).toBe(1);
  
  // expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 done');
  expect(presenter.immutableViewModel().doneCount).toBe(0);
});

test('a todo can be added', async () => {
  getTodos.mockResolvedValue([]);
  
  // render(<TodoList/>);
  const presenter = new TodoListPresenter(getTodos);
  
  // await waitFor(() => expect(getTodos).toHaveBeenCalledTimes(1));
  await presenter.loadTodos();

  // expectTodoListCount(0);
  expect(presenter.immutableViewModel().todos).toHaveLength(0);
  
  // fireEvent.click(screen.getByRole('button'));
  presenter.addEmptyTodo();
  
  const newTodos = presenter.immutableViewModel().todos;
  
  // expectTodoListCount(1);
  expect(newTodos).toHaveLength(1);
  
  //expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(newTodos[0].done).toBe(false);
});
