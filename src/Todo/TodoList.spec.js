import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import TodoList from './TodoList';
import {createTodo, getTodos} from './todo.service';
import {Provider} from 'react-redux';
import {buildNewStore} from '../store';

jest.mock('./todo.service', () => ({
  ...jest.requireActual('./todo.service'),
  getTodos: jest.fn(),
}));

// ndlr: I wouldn't write these tests like that :) I just want to have a lot of tests to compare speed :)

const renderWithRedux = (ui) => {
  return render(
    <Provider store={buildNewStore()}>{ui}</Provider>
  )
}

const expectTodoListCount = (total) => expect(screen.queryAllByRole('checkbox')).toHaveLength(total);

test('it fetches todos from api', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false), createTodo('My second todo', true)]);
  renderWithRedux(<TodoList/>);

  expect(await screen.findByText('My first todo')).toBeInTheDocument();
  expectTodoListCount(2);
  expect(screen.getByRole('checkbox', {name: 'My first todo'})).not.toBeChecked();
  expect(screen.getByRole('checkbox', {name: 'My second todo'})).toBeChecked();
});

test('a todo can be set as done', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', false)]);
  renderWithRedux(<TodoList/>);
  expect(await screen.findByText('My first todo')).toBeInTheDocument();

  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 ongoing');
  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 done');

  fireEvent.click(await screen.findByText('My first todo'));
  expect(screen.getByRole('checkbox', {name: 'My first todo'})).toBeChecked();

  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 ongoing');
  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 done');
});

test('a todo can be set as ongoing', async () => {
  getTodos.mockResolvedValue([createTodo('My first todo', true)]);
  renderWithRedux(<TodoList/>);
  expect(await screen.findByText('My first todo')).toBeInTheDocument();

  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 ongoing');
  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 done');

  fireEvent.click(await screen.findByText('My first todo'));
  expect(screen.getByRole('checkbox', {name: 'My first todo'})).not.toBeChecked();

  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('1 ongoing');
  expect(screen.getByText('My todos', {exact: false})).toHaveTextContent('0 done');
});

test('a todo can be added', async () => {
  getTodos.mockResolvedValue([]);
  renderWithRedux(<TodoList/>);
  await waitFor(() => expect(getTodos).toHaveBeenCalledTimes(1));
  expectTodoListCount(0);
  fireEvent.click(screen.getByRole('button'));
  expectTodoListCount(1);
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
