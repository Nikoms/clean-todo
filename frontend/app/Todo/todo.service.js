import {v4} from 'uuid';

export function createTodo(title, done) {
  return {id: v4(), title, done};
}

export const getTodos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    createTodo('Frozen yoghurt', false),
    createTodo('Ice cream sandwich', false),
    createTodo('Eclair', false),
    createTodo('Cupcake', false),
    createTodo('Gingerbread', false),
  ];
};
