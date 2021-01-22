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

  // 3. We will update the counters when the list changes
  useEffect(function refreshCounters() {
    setDoneCount(todos.filter(t => t.done).length);
    setOngoingCount(todos.filter(t => !t.done).length);
  }, [todos]);

  //4. See how many render ?
  console.log('render with', {total: todos.length, ongoingCount, doneCount});
  // On first load it renders 3 times:
  // render with { total: 0, ongoingCount: 0, doneCount: 0 } ==> Before "callApi"
  // render with { total: 5, ongoingCount: 0, doneCount: 0 } ==> After "callApi"
  // render with { total: 5, ongoingCount: 5, doneCount: 0 } ==> After "refreshCounters". React is smart an only re-render when the value really changes. Here "doneCount" is "updated" from 0 to 0, so it does not re-render

  // When I set one of the todos as "done", it re-renders only 2 times (but 3 things changed: todos, ongoingCount and doneCount, do you know why?)
  // render with { total: 5, ongoingCount: 5, doneCount: 0 } ==> when setTodoList is called
  // render with { total: 5, ongoingCount: 4, doneCount: 1 } ==> when setDoneCount/setOngoingCount is called (after useEffect)
  
  //2 conclusions: 
  // - We have too many render!
  // - React seems to wait the end of the useEffect to re-render the component (smart!)

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
