interface ITodoListItem {
    id: number,
    name: string,
    isDone: boolean,
}

interface ITodoList {
    list: ITodoListItem[],
    isAll: boolean,
    onChange: (id: number) => void,
    onDelete: (id: number) => void,
    allChange: (checked: boolean) => void,
}

const TodoList = ({ list, onChange, onDelete, isAll, allChange }: ITodoList) => {
    return (
        <section className="main">
            <input type="checkbox"
                className='toggle-all'
                id="toggle-all"
                checked={isAll}
                onChange={(e) => { allChange(e.target.checked) }}
            />
            <label htmlFor="toggle-all"></label>
            <ul className="todo-list">
                {
                    list.map((item) => (
                        <li className={`todo ${item.isDone ? 'completed' : ''}`} key={item.id}>
                            <div className="view">
                                <input type="checkbox"
                                    className='toggle'
                                    checked={item.isDone}
                                    onChange={() => onChange(item.id)}
                                />
                                <label htmlFor="">{item.name}</label>
                                <button className='destroy' onClick={() => onDelete(item.id)}></button>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
};

export default TodoList;