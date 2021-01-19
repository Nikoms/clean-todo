import {useState} from 'react';

function createData(title, done) {
  return {title, done};
}

const TodoList = () => {
  const [todos, setTodoList] = useState(() => [
    createData('Frozen yoghurt', false),
    createData('Ice cream sandwich', false),
    createData('Eclair', false),
    createData('Cupcake', false),
    createData('Gingerbread', false),
  ]);

  const addTodos = () => setTodoList([createData('Relax! Edition will come...', false), ...todos]);

  return <>
    <table>
      <thead>
      <td rowSpan={2}>My todos <button onClick={addTodos}>Add</button></td>
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
