import { useState, useContext } from "react";
import { TasksContext, TasksDispatchContext } from './TasksContext';

export interface ITask {
    task: {
        id: number,
        text: string,
        done: boolean,
    },
    onChange?: (v: ITaskItem) => void,
    onDelete?: (id: number) => void,
}

export interface ITaskItem {
    id: number,
    text: string,
    done: boolean,
}

export interface ITaskList {
    tasks: ITaskItem[],
    onChangeTask?: (v: ITaskItem) => void,
    onDeleteTask?: (id: number) => void,
}

const Task = ({ task }: ITask) => {
    // 是否可编辑
    const [isEditing, setIsEditing] = useState(false);
    const  dispatch: any = useContext(TasksDispatchContext);
    let editingContent;
        if (isEditing) {
            editingContent = (
                <>
                    <input type="text" value={task.text} onChange={(e) => {
                        // onChange({
                        //     ...task,
                        //     text: e.target.value,
                        // });
                        dispatch({
                            type: 'changed',
                            task: {
                                ...task,
                            text: e.target.value,
                            }
                        });
                    }} />
                    <button onClick={() => { setIsEditing(false); }}>Save</button>
                </>
            );
        } else {
            editingContent = (
            <>
                <span>{task.text}</span>
                <button onClick={() => { setIsEditing(true); }}>Edit</button>
            </>
           );
        }


    return (
        <div className="task">
            <input type="checkbox" checked={task.done} onChange={(e) => {
                // onChange({
                //     ...task,
                //     done: e.target.checked
                // })
                dispatch({
                    type: 'changed',
                    task: {
                        ...task,
                    done: e.target.checked
                    }
                });
            }} />
            {editingContent}
            <button onClick={() => { 
                //onDelete(task.id) 
                dispatch({
                    type: 'delete',
                    id: task.id,
                });
                }}>Delete</button>
        </div>
    );
}

const TaskList = () => {
    const tasks: any= useContext(TasksContext);
    return(
        <div className="task-list">
            {
                tasks.map((task: any) =>(
                    <Task key={task.id} task={task}/>
                ))
            }
        </div>
    );
};

export default TaskList;