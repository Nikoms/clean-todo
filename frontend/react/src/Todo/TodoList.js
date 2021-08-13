import {useEffect, useMemo, useState} from 'react';
import {getTodos} from '@/frontend/app/Todo/todo.service';
import {TodoListPresenter} from '@/frontend/app/Todo/TodoListPresenter';


const TodoList = ({presenter, viewModel}) => {
  useEffect(() => {
    presenter.loadTodos();
  }, [presenter]);

  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos ({viewModel.ongoingCount} ongoing
          /{viewModel.doneCount} done/ {viewModel.clickCount} clicks)
          <button onClick={() => presenter.addEmptyTodo()}>Add</button>
        </th>
      </tr>
      </thead>
      <tbody>
      {viewModel.todos.map((todo, index) => (
        <tr key={todo.id}>
          <td onClick={() => presenter.incrementClickCount()}><label htmlFor={`done-${todo.id}`}>{todo.title}</label>
          </td>
          <td><input type="checkbox" value="1" id={`done-${todo.id}`} checked={todo.done}
                     onChange={() => presenter.toggleDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export const withMVP = (Wrapped) =>
  function WithTodoPresenter() {
    const [viewModel, setViewModel] = useState();

    const presenter = useMemo(() => {
      const presenter = new TodoListPresenter({getTodos});
      presenter.onViewModelChange(setViewModel);
      return presenter;
    }, []);

    return <Wrapped presenter={presenter} viewModel={viewModel || presenter.immutableViewModel()}/>;
  };


export default withMVP(TodoList);
