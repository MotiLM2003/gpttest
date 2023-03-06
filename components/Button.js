import React from 'react';

const Button = ({ value, onClick }) => {
	return (
		<input
			type='button'
			value={value}
			onClick={onClick}
			className='bg-white p-1 rounded shadow shadow-white hover:shadow-xl cursor-pointer  transtion duration-700 hover:bg-red-200  '
		/>
	);
};

export default Button;
