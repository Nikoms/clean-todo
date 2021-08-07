import {useEffect, useMemo, useState} from 'react';
import {getTodos} from './todo.service';
import {TodoListPresenter} from './TodoListPresenter';
import {connect} from 'react-redux';


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
  function WithTodoPresenter({reduxTodos}) {
    //How to link"reduxTodos" to the presenter?
    console.log({reduxTodos})
    const [viewModel, setViewModel] = useState();

    const presenter = useMemo(() => {
      const presenter = new TodoListPresenter({getTodos});
      presenter.onViewModelChange(setViewModel);
      return presenter;
    }, []);

    return <Wrapped presenter={presenter} viewModel={viewModel || presenter.immutableViewModel()}/>;
  };


const mapStateToProps = (state) => ({  reduxTodos: state.todo.list })
export default connect(mapStateToProps)(withMVP(TodoList));
