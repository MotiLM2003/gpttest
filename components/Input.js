import React from 'react';

const Input = ({
	inputType = 'text',
	value,
	placeholder = 'enter text',
	onKeyDown,
	onChange = () => {},
	disabled,
}) => {
	return (
		<input
			className='rounded p-1 outline-none text-xs min-w-[300px]'
			type={inputType}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			onKeyDown={onKeyDown}
			disabled={disabled}
		/>
	);
};

export default Input;
