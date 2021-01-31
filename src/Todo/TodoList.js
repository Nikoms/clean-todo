import {useEffect, useState} from 'react';
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

const TodoList = () => {
  const [todos, setTodoList] = useState([]);
  useEffect(function callApi() {
    fetchTodosFromApi().then(list => setTodoList(list));
  }, []);

  const [ongoingCount, setOngoingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(function refreshCounters() {
    setDoneCount(todos.filter(t => t.done).length);
    setOngoingCount(todos.filter(t => !t.done).length);
  }, [todos]);

  console.log('render with', {total: todos.length, ongoingCount, doneCount});

  const addEmptyTodo = () => setTodoList([createTodo('Relax! Edition will come...', false), ...todos]);
  const markAsDone = (index) => setTodoList([...todos.slice(0, index), {
    ...todos[index],
    done: true,
  }, ...todos.slice(index + 1)]);


  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos ({ongoingCount} ongoing /{doneCount} done)
          <button onClick={addEmptyTodo}>Add</button>
        </th>
      </tr>
      </thead>
      <tbody>
      {todos.map((todo, index) => (
        <tr key={todo.id}>
          <td>{todo.title}</td>
          <td><input type="checkbox" value="1" checked={todo.done} onChange={() => markAsDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export default TodoList;
