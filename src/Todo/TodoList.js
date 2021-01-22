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

  //2. And we have a state for 2 counter
  const [ongoingCount, setOngoingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  // 3. But what if the setter are in a async method ?
  useEffect(function refreshCounters() {
    (async () => {
      new Promise(resolve => setTimeout(() => {
        setDoneCount(todos.filter(t => t.done).length);
        setOngoingCount(todos.filter(t => !t.done).length);
        resolve();
      }, 1));
    })();
  }, [todos]);

  //4. See how many render ?
  console.log('render with', {total: todos.length, ongoingCount, doneCount});
  // When I set one of the todos as "done", it re-renders 3 times
  // render with { total: 5, ongoingCount: 5, doneCount: 0 } ==> when setTodoList is called
  // render with { total: 5, ongoingCount: 5, doneCount: 1 } ==> when setDoneCount is called
  // render with { total: 5, ongoingCount: 4, doneCount: 1 } ==> when setOngoingCount is called

  //2 conclusions: 
  // - We still have too many render!
  // - Once you are outside the "useEffect" thread, you have as many render as "setter"

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
