import {useEffect, useMemo, useState} from 'react';
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

  //2. useMemo's callback will only be called when the dependency (todos) changes 
  const ongoingCount = useMemo(() => todos.filter(t => t.done).length, [todos]);
  const doneCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

  const [clickCount, setClickCount] = useState(0);

  // 2 conclusions: 
  // - Avoid using useEffect "in cascade". If you only use "useEffect" to set a value to a local state and nobody else uses the setState, then you probably should consider "useMemo" instead
  // - Use "useMemo" for heavy computation or when you have a lot of re-rendering

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
