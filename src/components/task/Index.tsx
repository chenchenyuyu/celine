import { useReducer } from 'react';
import AddTask from './AddTask';
import TaskList, { ITaskItem } from "./TaskList";

let nextId = 3;

const initialTasks = [
    { id: 0, text: 'Philosopher’s Path', done: true },
    { id: 1, text: 'Visit the temple', done: false },
    { id: 2, text: 'Drink matcha', done: false },
];

// onChangeTask 更新task数据
// onDeleteTask 删除task

// onAddText 更新text
const TaskListView = () => {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
    const handleAddTask = (text: string) => {
        dispatch({
            type: 'added',
            id: nextId++,
            text,
        });
    }

    const onChangeTask = (v: ITaskItem) => {
        dispatch({
            type: 'changed',
            task: v,
        });
    }

    const onDeleteTask = (id: number) => {
        dispatch({
            type: 'delete',
            id,
        });
    }

    return(
        <div className='task-list-view'>
           <h1>react useReducer taskList</h1>
            <AddTask onAddText={handleAddTask}/>
            <TaskList tasks={tasks} onChangeTask={onChangeTask} onDeleteTask={onDeleteTask}/>
        </div>
    );
}

const tasksReducer = (tasks: ITaskItem[], action: any) => {
    switch(action.type){
        case 'added': { // 新增
            return [
                ...tasks,
                {
                    id: action.id,
                    text: action.text,
                    done: false,
                }
            ]
        }
        case 'changed': { // 更新
            return tasks.map((item:any) => {
                if(item.id === action.task.id) {
                    return action.task;
                } else {
                    return item;
                }
            })
        }
        case 'delete': { // 删除
            return tasks.filter((item: any) => item.id !== action.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
          }
    };
}

export default TaskListView;
