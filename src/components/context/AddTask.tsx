import { useState, useContext } from "react";
import { TasksDispatchContext } from './TasksContext';

// interface IAddTask {
//     onAddText: (v: string) => void,
// }
let nextId = 3;
// { onAddText }: IAddTask
const AddTask = () => {
    const dispatch: any = useContext(TasksDispatchContext);
    const [text, setText] = useState('');
    return (
        <>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)} />
            <button
                onClick={() => { 
                setText('');
                //onAddText(text);
                dispatch({
                    type: 'added',
                    id: nextId++,
                    text: text,
                  }); 
                }}>add</button>
        </>
    )
};

export default AddTask;