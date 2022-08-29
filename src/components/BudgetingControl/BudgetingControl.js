import React, { useEffect, useState } from 'react';
import RangeInput from '../RangeInput/RangeInput';

function BudgetingControl(props) {
  const { control, onUpdate } = props;
  const [isOverBy, setIsOverBy] = useState(0);

  useEffect(() => {
    if (Number(control.value) > Number(control.max)) {
      setIsOverBy(Number(control.value) - Number(control.max));
    }
  });

  return (
    <div className='budget-plan-control-container'>
      <h3 className='budget-control-title'>
        {control.title +
          ` (max. ${control.max}) | linked to: ${[
            ...control.linkedCategories,
          ]}`}
        {isOverBy > 0 && (
          <span
            style={{ marginLeft: '0.4rem' }}
            className='error'>{`| Over by ${isOverBy.toFixed(2)} RON`}</span>
        )}
      </h3>
      <div className='budget-plan-control'>
        <RangeInput
          disabled={props.disableSlider}
          range={[control.min, control.max]}
          step={10 % control.max}
          handleChange={(value) => onUpdate(value, props.index)}
          value={control.value || 0}
          type={control.title}
        />
        <input
          type='text'
          disabled={props.disableInput}
          value={control.value}
          onChange={(e) => onUpdate(e.target.value, props.index)}
        />
      </div>
    </div>
  );
}

export default BudgetingControl;
