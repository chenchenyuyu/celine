// 传递context数据
// tasks, dispatch组件树全局共享
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null); // 全局共享状态
export const TasksDispatchContext = createContext(null); // 全局共享方法

const initialTasks = [
    { id: 0, text: 'Philosopher’s Path', done: true },
    { id: 1, text: 'Visit the temple', done: false },
    { id: 2, text: 'Drink matcha', done: false },
];

const TasksProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
    return (
        <TasksContext.Provider value={tasks as any}>
            <TasksDispatchContext.Provider value={dispatch as any}>
                {children}
            </TasksDispatchContext.Provider>
        </TasksContext.Provider>
    )
};
const tasksReducer = (tasks: any[], action: any) => {
    switch (action.type) {
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
            return tasks.map((item: any) => {
                if (item.id === action.task.id) {
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

export default TasksProvider;
