import React from 'react';

function RangeInput(props) {
  return (
    <div className='range-input'>
      <input
        type='range'
        min={props.range[0] || 0}
        max={props.range[1] || 1000}
        value={props.value}
        disabled={props.disabled}
        onChange={e => props.handleChange(e.target.value, props.type)}
        step={props.step || 1}
      />
    </div>
  );
}

export default RangeInput;
