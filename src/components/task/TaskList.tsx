import { useState } from "react";

export interface ITask {
    task: {
        id: number,
        text: string,
        done: boolean,
    },
    onChange: (v: ITaskItem) => void,
    onDelete: (id: number) => void,
}

export interface ITaskItem {
    id: number,
    text: string,
    done: boolean,
}

export interface ITaskList {
    tasks: ITaskItem[],
    onChangeTask: (v: ITaskItem) => void,
    onDeleteTask: (id: number) => void,
}

const Task = ({ task, onChange, onDelete }: ITask) => {
    // 是否可编辑
    const [isEditing, setIsEditing] = useState(false);
    let editingContent;
        if (isEditing) {
            editingContent = (
                <>
                    <input type="text" value={task.text} onChange={(e) => {
                        onChange({
                            ...task,
                            text: e.target.value,
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
                onChange({
                    ...task,
                    done: e.target.checked
                })
            }} />
            {editingContent}
            <button onClick={() => { onDelete(task.id) }}>Delete</button>
        </div>
    );
}

const TaskList = ({ tasks, onChangeTask, onDeleteTask }: ITaskList) => {
    return(
        <div className="task-list">
            {
                tasks.map((task) =>(
                    <Task key={task.id} task={task} onChange={onChangeTask} onDelete={onDeleteTask}/>
                ))
            }
        </div>
    );
};

export default TaskList;