import {useMemo, useState} from 'react';
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
  constructor() {
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

const TodoList = ({presenter, viewModel }) => {
  const [todos, setTodoList] = useState(viewModel.todos);

  const ongoingCount = useMemo(() => todos.filter(t => t.done).length, [todos]);
  const doneCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

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
          <td onClick={() => setClickCount(() => clickCount + 1)}>{todo.title}</td>
          <td><input type="checkbox" value="1" checked={todo.done} onChange={() => toggleDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export const withMVP = (Wrapped) =>
  function WithTodoPresenter() {
    const presenter = useMemo(() => {
      return new TodoListPresenter();
    }, []);

    return <Wrapped presenter={presenter} viewModel={presenter.viewModel}/>;
  };


export default withMVP(TodoList);
