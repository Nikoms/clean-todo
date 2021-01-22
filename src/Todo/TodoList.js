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

  //2. One solution would be to recalculate the counters on each render
  const ongoingCount = todos.filter(t => t.done).length;
  const doneCount = todos.filter(t => !t.done).length;


  //4. See how many render ?
  console.log('render with', {total: todos.length, ongoingCount, doneCount});
  // On first load it renders only 2 times (perfect!):
  // render with { total: 0, ongoingCount: 0, doneCount: 0 }
  // render with { total: 5, ongoingCount: 0, doneCount: 5 }

  // When I set one of the todos as "done", it re-renders only 1 time
  // render with { total: 5, ongoingCount: 1, doneCount: 4 }

  //2 conclusions: 
  // - We have the perfect render count...
  // - ...But there is a but... (see next commit) 

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
