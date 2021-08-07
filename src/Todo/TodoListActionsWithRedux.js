import {useDispatch} from 'react-redux';
import {createTodo} from './todo.service';
import {addTodo} from './store/todo.store';

const TodoListActionsWithRedux = () => {
  const dispatch = useDispatch();
  return <button onClick={() => {
    //This will add a todo in the redux list, but how to make it work with our presenter?
    dispatch(addTodo(createTodo('coool', true)));
  }}>Add</button>
}

export default TodoListActionsWithRedux
