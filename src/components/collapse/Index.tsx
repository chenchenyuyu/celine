import React, { useState } from 'react';
import './style.scss';

interface ICollapseArray {
    id: string,
    title: string,
    children: React.ReactNode,
}

interface ICollapse {
    items: ICollapseArray[],
    defaultActiveKey: string | number | Array<string> | Array<number>,
    onChange: (id: string, active: boolean) => void,
}

interface ICollapseItem {
  activeId: string | number | undefined, // 单条激活数据
  // key: string, key is not a prop
  id: string,
  title: string,
  children: React.ReactNode,
  onChange: (id: string, active: boolean) => void,
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const initData = [
  {
      id: '1',
      title: 'This is panel header 1',
      children: <div>{text}</div>
  },
  {
      id: '2',
      title: 'This is panel header 2',
      children: <div>{text}</div>
  },
  {
      id: '3',
      title: 'This is panel header 3',
      children: <div>{text}</div>
  }
]

const CollapseItem = ({ activeId, id, title, children, onChange}: ICollapseItem) => {
    //const [itemId, setItemId] = useState(activeId);
    const [active, setActive] = useState(activeId === id);
    return(
      <div className="cs-collapse-item">
          <div className='cs-collapse-item-header'>
              <div className={active ? 'cs-collapse-item-arrow-down': 'cs-collapse-item-arrow-right'}
              onClick={() => {setActive(!active); onChange(id, active)}}/>
              <div className='cs-collapse-item-title'>
               {title}
              </div>
          </div>
          {
            active && <div className='cs-collapse-item-body'>{children}</div>
          }
      </div>
    );
};

const Collapse = ({items = initData, defaultActiveKey = ['1', '2'], onChange = (id, active) => {console.log('id', id, active)}}: ICollapse) => {
    return(
        <div className="cs-collapse">
           {
             items.map(({id, title, children}, index) => (
                <CollapseItem
                  activeId={Array.isArray(defaultActiveKey) ? defaultActiveKey[index]: defaultActiveKey}
                  key={`${id}${index}`}
                  title={title}
                  onChange={onChange}
                  id={id}>
                  {children}
                </CollapseItem>
                ))
           }
        </div>
    )
}

export default Collapse;