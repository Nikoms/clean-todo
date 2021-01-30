import {useMemo, useState} from 'react';
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

class TodoListPresenter {
  constructor() {
    // Someone outside will be able to listen to modification of the viewModel
    this.viewModelListener = (viewModel) => null;
    this.viewModel = {
      todos: [
        createTodo('Frozen yoghurt', false),
        createTodo('Ice cream sandwich', false),
        createTodo('Eclair', false),
        createTodo('Cupcake', false),
        createTodo('Gingerbread', false),
      ],
    };
  }

  // This is how we set the listener of the presenter
  onViewModelChange(callback) {
    this.viewModelListener = callback;
  }
  // This method will be called by the view
  setTodoList(todos) {
    this.viewModel.todos = todos;
    //Calling the listener with a copy of the viewModel ("immutable" style)
    this.viewModelListener({...this.viewModel});
  }
}

const TodoList = ({presenter, viewModel}) => {
  // We don't need state anymore, because the todos from the viewModel will always be updated
  const todos = viewModel.todos;

  const ongoingCount = useMemo(() => todos.filter(t => t.done).length, [todos]);
  const doneCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

  const [clickCount, setClickCount] = useState(0);

  // Really simple refac: We call a "setTodoList" instead of the local one
  const addEmptyTodo = () => presenter.setTodoList([createTodo('Relax! Edition will come...', false), ...todos]);
  const toggleDone = (index) => presenter.setTodoList([...todos.slice(0, index), {
    ...todos[index],
    done: !todos[index].done,
  }, ...todos.slice(index + 1)]);

  return <>
    <table>
      <thead>
      <tr>
        <th rowSpan={2} align="left">My todos ({ongoingCount} ongoing /{doneCount} done/ {clickCount} clicks)
          <button onClick={addEmptyTodo}>Add</button>
        </th>
      </tr>
      </thead>
      <tbody>
      {todos.map((todo, index) => (
        <tr key={todo.id}>
          <td onClick={() => setClickCount(() => clickCount + 1)}>{todo.title}</td>
          <td><input type="checkbox" value="1" checked={todo.done} onChange={() => toggleDone(index)}/></td>
        </tr>
      ))}
      </tbody>
    </table>
  </>;
};

export const withMVP = (Wrapped) =>
  function WithTodoPresenter() {
    // The purpose of this viewModel is to keep the last version of the presenter's viewModel 
    // AND it will also help us to re-render the Component thanks to "setViewModel".
    const [viewModel, setViewModel] = useState();

    const presenter = useMemo(() => {
      const presenter = new TodoListPresenter();
      // When the viewModel changes, give it to "setViewModel" to reload the component with the new value
      presenter.onViewModelChange(setViewModel);
      return presenter;
    }, []);

    // The first time, viewModel will be undefined. When "onViewModelChange" will be called, viewModel will have the last value
    return <Wrapped presenter={presenter} viewModel={viewModel || presenter.viewModel}/>;
  };


export default withMVP(TodoList);
