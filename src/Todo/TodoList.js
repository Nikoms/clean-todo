import {useState} from 'react';

function createTodo(title, done) {
  return {title, done};
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
      <td rowSpan={2}>My todos <button onClick={addEmptyTodo}>Add</button></td>
      </thead>
      <tbody>
      {todos.map((row) => (
        <tr>
          <td>{row.title}</td>
          <td><input type="checkbox" value="1" checked={row.done} disabled={true}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export default TodoList;
