import {useMemo, useState} from 'react';
import {createTodo} from './todo.service';

// The presenter will contain the viewModel and some public method that the view will use
class TodoListPresenter {
  constructor() {
    // For the moment, the view model only contain the list of the todos that will be asynchronously loaded
    this.viewModel = {
      todos: [
        createTodo('Frozen yoghurt', false),
        createTodo('Ice cream sandwich', false),
        createTodo('Eclair', false),
        createTodo('Cupcake', false),
        createTodo('Gingerbread', false),
      ],
    };
  }
}

const TodoList = ({presenter /* TodoListPresenter */, viewModel /* The viewModel inside TodoListPresenter */}) => {
  // The todos come from the viewModel
  const [todos, setTodoList] = useState(viewModel.todos);

  const ongoingCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);
  const doneCount = useMemo(() => todos.filter(t => t.done).length, [todos]);

  const [clickCount, setClickCount] = useState(0);

  const addEmptyTodo = () => setTodoList([createTodo('Relax! Edition will come...', false), ...todos]);
  const toggleDone = (index) => setTodoList([...todos.slice(0, index), {
    ...todos[index],
    done: !todos[index].done,
  }, ...todos.slice(index + 1)]);

  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos ({ongoingCount} ongoing /{doneCount} done/ {clickCount} clicks)
          <button onClick={addEmptyTodo}>Add</button>
        </th>
      </tr>
      </thead>
      <tbody>
      {todos.map((todo, index) => (
        <tr key={todo.id}>
          <td onClick={() => setClickCount(() => clickCount + 1)}><label htmlFor={`done-${todo.id}`}>{todo.title}</label></td>
          <td><input type="checkbox" value="1" id={`done-${todo.id}`} checked={todo.done} onChange={() => toggleDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

// We will make a "HOC" to wrap the original component. This will allow us to easily pass a presenter and its viewModel
export const withMVP = (Wrapped) =>
  function WithTodoPresenter() {
    // We just make sure that the presenter will be instantiated only the first time
    const presenter = useMemo(() => {
      return new TodoListPresenter();
    }, []);

    return <Wrapped presenter={presenter} viewModel={presenter.viewModel}/>;
  };


export default withMVP(TodoList);
