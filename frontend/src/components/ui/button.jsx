import React from 'react';


export const Button = ({ children, onClick, disabled }) => {
return (
<button
onClick={onClick}
disabled={disabled}
className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50`}
>
{children}
</button>
);
};