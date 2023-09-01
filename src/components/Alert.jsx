import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const Alert = ({ type, message }) => {
  const alertClasses = {
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  const alertIcon = {
    success: <FaCheckCircle className="text-green-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    error: <FaTimesCircle className="text-red-500" />,
  };

  return (
    <div className={`rounded p-4 mb-4 ${alertClasses[type]}`}>
      <div className="flex items-center">
        <span className="mr-2 text-lg flex-shrink-0">
          {alertIcon[type]}
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Alert;