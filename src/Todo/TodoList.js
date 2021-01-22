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
    //1. Imagine that we are calling an api to get todos 
    fetchTodosFromApi().then(list => setTodoList(list));
  }, []);

  //2. We still have our counters that are recalculate on every render
  const ongoingCount = todos.filter(t => t.done).length;
  const doneCount = todos.filter(t => !t.done).length;

  // 3. And we have a new cool feature that count the number of time we click on titles (best feature ever asked by the CEO)
  const [clickCount, setClickCount] = useState(0);

  //Conclusion: 
  // - Calling "setClickCount" will re-render the component and our "ongoingCount" and "doneCount" will be recalculate everytime... It's fine for this example, but it can be problematic if the computation is heavy and can block your main thread

  const addEmptyTodo = () => setTodoList([createTodo('Relax! Edition will come...', false), ...todos]);
  const markAsDone = (index) => setTodoList([...todos.slice(0, index), {
    ...todos[index],
    done: true,
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
          <td><input type="checkbox" value="1" checked={todo.done} onChange={() => markAsDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export default TodoList;
