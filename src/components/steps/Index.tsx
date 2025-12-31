
import React, { useState } from 'react';
import './style.scss';

interface ISteps{
    items: IStepsArray[],
    current: number,
    onChange: (index: number) => void,
    direction: "vertical" | "horizontal", // '竖直' | '水平'
}

interface IStepsArray{
    title: string,
    description: string,
    content: React.ReactNode,
}

interface IStepsItem{
  index: number,
  activeIndex: number,
  title: string,
  description: string,
  showLine: boolean,
  direction: "vertical" | "horizontal", // '竖直' | '水平'
  onChange: (index: number) => void,
}

const description = 'This is a description.';

const initData = [
    {
      title: 'Step 1',
      description,
      content: <div>111A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.
     </div>
    },
    {
      title: 'Step 2',
      description,
      content: <div>222A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.</div>
    },
    {
      title: 'Step 3',
      description,
      content: <div>333A dog is a type of domesticated animal.
      it can be found as a welcome guest in many households across the world.
      A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.</div>
    },
    {
      title: 'Step 4',
      description,
      content: <div>444A dog is a type of domesticated animal.
      it can be found as a welcome guest in many households across the world.</div>
    },
  ]

const StepsItem = ({ direction, index, title, description, showLine, onChange, activeIndex}: IStepsItem) => {
  return(
    <div className={direction === 'vertical'? "cs-steps-vertical-item": "cs-steps-item"}>
      <div className={direction === 'vertical'? "cs-steps-vertical-item-content": "cs-steps-item-content"}>
        <div className={`${direction === 'vertical'? "cs-steps-vertical-item-content-circle": "cs-steps-item-content-circle"} ${index === activeIndex ? 'cs-steps-item-content-circle-active' : (index < activeIndex ? 'cs-steps-item-content-circle-completed' : '')}`}
          onClick={() => {onChange(index)}}>{index+1}</div>
            <div>{title}</div>
            {
              showLine && <div className={`${direction === 'vertical'? "cs-steps-item-content-line-vertical": "cs-steps-item-content-line"} ${index < activeIndex ? 'cs-steps-item-content-line-active' : ''}`} />
            }
        </div>
      <div style={{marginLeft: '60px'}}>{description}</div>
    </div>
  );
}

const Steps = ({ direction = 'horizontal',items = initData, current = 1, onChange }: ISteps) => {
  const [activeIndex, setActiveIndex] = useState(current);
    return(
        <div className={direction === 'vertical'? "cs-steps-vertical": "cs-steps"}>
          <div className={direction === 'vertical'? "cs-steps-vertical-main": "cs-steps-main"}>
            {
                items.map(({title, description}, index) => (
                  <StepsItem
                    direction={direction}
                    onChange={(index: number) => {setActiveIndex(index)}}
                    index={index}
                    activeIndex={activeIndex}
                    key={`${title}${index}`}
                    title={title}
                    description={description}
                    showLine={(index+1) !== items.length}/>
                ))
            }
          </div>
          <div className='cs-steps-content'>
            {
              items[activeIndex]['content']
            }
          </div>
        </div>
    );
}

export default Steps;