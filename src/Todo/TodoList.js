import {useEffect, useMemo, useRef, useState} from 'react';
import {TodoListPresenter} from './TodoListPresenter';
import {connect} from 'react-redux';
import {addEmptyTodo, loadTodos, toggleDone} from './store/todo.store';


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
  function WithTodoPresenter({reduxTodos, reduxToggleDone, reduxLoadTodos, reduxAddEmptyTodo}) {
    const [, refresh] = useState(0);
    const vm = useRef();

    const presenter = useMemo(() => {
      const presenter = new TodoListPresenter({
        toggleDone: reduxToggleDone, 
        loadTodos: reduxLoadTodos,
        addEmptyTodo: reduxAddEmptyTodo
      });
      presenter.onViewModelChange((newViewModel) => {
        vm.current = newViewModel;
        refresh(i => i + 1);
      });
      return presenter;
    }, [reduxToggleDone, reduxLoadTodos, reduxAddEmptyTodo]);
    
    //The single source of truth is redux... So... We need to set the list if somebody changed the list
    presenter.forceList(reduxTodos);

    return <Wrapped presenter={presenter} viewModel={vm.current}/>;
  };



const mapStateToProps = (state) => ({reduxTodos: state.todo.list});
const mapDispatchToProps = (dispatch) => ({
  //These functions will be called by the presenter (not the template!)
  reduxToggleDone: (index) => dispatch(toggleDone(index)),
  reduxAddEmptyTodo: () => dispatch(addEmptyTodo()),
  reduxLoadTodos: () => dispatch(loadTodos)
});
export default connect(mapStateToProps, mapDispatchToProps)(withMVP(TodoList));
