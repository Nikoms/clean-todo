<template>
  <table>
    <thead>
    <tr>
      <th rowspan="2">My todos ({{viewModel.ongoingCount}}} ongoing
        /{{viewModel.doneCount}}} done/ {{viewModel.clickCount}}} clicks)
        <button @click="presenter.addEmptyTodo()">Add</button>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(todo, i) in viewModel.todos" :key="i">
      <td @click="presenter.incrementClickCount()">
        <label :for="'done' + todo.id">{{todo.title}}</label>
      </td>
      <td>
        <input type="checkbox" 
               value="1" 
               :id="'done' + todo.id" 
               :checked="todo.done"
               @change="presenter.toggleDone(i)"/>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {TodoListPresenter} from '@frontend/app/Todo/TodoListPresenter';
import {getTodos} from '@frontend/app/Todo/todo.service';

export default {
  name: 'TodoList',
  setup() {
    return { presenter: new TodoListPresenter({getTodos}) }
  },
  data() {
    return {
      viewModel: this.presenter.viewModel
    }
  },
  created() {
    this.presenter.onViewModelChange(vm => this.viewModel = vm);
    this.presenter.loadTodos();
  }
}
</script>
