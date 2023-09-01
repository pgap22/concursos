import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button
      className="bg-black text-white w-full md:w-[auto] px-4 py-2 rounded-lg shadow-md hover:bg-opacity-80 transition duration-300 ease-in-out focus:outline-none"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export { Button };