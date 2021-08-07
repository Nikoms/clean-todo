import {useDispatch} from 'react-redux';
import {addEmptyTodo} from './store/todo.store';

const TodoListActionsWithRedux = () => {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(addEmptyTodo())}>Add</button>
}

export default TodoListActionsWithRedux
