
import { useState } from 'react';
import { observer } from 'mobx-react';
// import { trace } from 'mobx';
import TodoList from "./TodoList";
import { useStore } from '../../store/Todo.mobx.index';

import './todo.scss';

const Todo = () => {
    //trace(true);
    const [text, setText] = useState('');
    const { taskStore } = useStore();

    const addTodoItem = (e: React.KeyboardEvent<Element>) => {
        if(e.keyCode == 13) {
            taskStore.addItem({
              id: taskStore.list[taskStore.list.length-1].id + 1,
              name: text, 
              isDone: false,
            })
            setText('');
          }
    }

    return (
        <section className='todoapp'>
            <header className="header">
                <h1>todos</h1>
                <input type="text"
                    className='new-todo'
                    placeholder='What needs to be done ?'
                    autoFocus
                    autoComplete='off'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyUp={addTodoItem}
                />
            </header>
            <TodoList 
                list={taskStore.list}
                onChange={(id) => {taskStore.checkItem(id)}}
                onDelete={(id) => {taskStore.deleteItem(id)}}
                isAll={taskStore.isAll}
                allChange={(checked) => {taskStore.allCheck(checked)}} />
            <footer className='footer'>
                <span className="todo-count">
                    任务总数：{taskStore.allTask}，已完成 :{taskStore.completed}
                </span>
            </footer>
        </section>
    )
};

export default observer(Todo);