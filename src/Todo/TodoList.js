import {useState} from 'react';
import {v4} from 'uuid';

function createTodo(title, done) {
  return {id: v4(), title, done};
}

const TodoList = () => {
  const [todos, setTodoList] = useState(() => [
    createTodo('Frozen yoghurt', false),
    createTodo('Ice cream sandwich', false),
    createTodo('Eclair', false),
    createTodo('Cupcake', false),
    createTodo('Gingerbread', false),
  ]);

  const addEmptyTodo = () => setTodoList([createTodo('Relax! Edition will come...', false), ...todos]);

  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos <button onClick={addEmptyTodo}>Add</button></th>
      </tr>
      </thead>
      <tbody>
      {todos.map((todo) => (
        <tr key={todo.id}>
          <td>{todo.title}</td>
          <td><input type="checkbox" value="1" checked={todo.done} disabled={true}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export default TodoList;
