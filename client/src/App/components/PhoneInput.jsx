import { useState, useEffect, useRef } from 'react';

const splitString = (str, index) => {
  return [str.slice(0, index), str.slice(index)];
}

const formatPhoneStr = str => {
  let p1 = str, p2 = '', p3 = '';
  if (p1.length > 3) {
    [p1, p2] = splitString(p1, 3);
  }
  if (p2.length > 3) {
    [p2, p3] = splitString(p2, 3);
  }

  return [p1,p2,p3].join(' ').trim();
}

export default function PhoneInput(props) {
  const [ visibleVal, setVisibleVal ] = useState(props.value);
  const inputEl = useRef();

  useEffect(() => {
    setVisibleVal(formatPhoneStr(props.value))
  },[props.value]);
  
  const handleChange = (ev) => {
    const value = ev.target.value.replace(/\s+/g,'');
    ev.target.value = value;
    props.onChange(ev);
    setVisibleVal(formatPhoneStr(value));
  }

  return (
    <>
      <input
        type='hidden'
        ref={inputEl}
        value={props.value}
      />
      <input
        type='tel'
        value={visibleVal}
        className={props.className}
        placeholder={props.placeholder}
        onChange={handleChange}
      />
    </>
  )
}