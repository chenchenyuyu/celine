import AddTask from './AddTask';
import TaskList from "./TaskList";
import TasksProvider from './TasksContext';

// onChangeTask 更新task数据
// onDeleteTask 删除task

// onAddText 更新text
const TaskListView = () => {
    return (
        <TasksProvider>
            <div className='task-list-view'>
                <h1>react createContext taskList</h1>
                {/* <AddTask onAddText={handleAddTask}/>
                <TaskList tasks={tasks} onChangeTask={onChangeTask} onDeleteTask={onDeleteTask}/> */}
                <AddTask />
                <TaskList />
            </div>
        </TasksProvider>
    );
}

export default TaskListView;
