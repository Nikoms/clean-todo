import TodoList from './Todo/TodoList';
import TodoListActionsWithRedux from './Todo/TodoListActionsWithRedux';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TodoListActionsWithRedux />
        <TodoList/>
      </header>
    </div>
  );
}

export default App;
