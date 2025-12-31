import { useState } from "react";

interface IAddTask {
    onAddText: (v: string) => void,
}

const AddTask = ({ onAddText }: IAddTask) => {
    const [text, setText] = useState('');
    return (
        <>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)} />
            <button onClick={() => { setText('');onAddText(text);}}>add</button>
        </>
    )
};

export default AddTask;