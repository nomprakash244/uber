import React from 'react';


export const Input = ({ type = 'text', placeholder, value, onChange, onKeyDown }) => {
return (
<input
type={type}
placeholder={placeholder}
value={value}
onChange={onChange}
onKeyDown={onKeyDown}
className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
);
};