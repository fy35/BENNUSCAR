import React from 'react';

const Message = ({ successMsg, errorMsg }) => {
  return (
    <>
      {successMsg && (
        <div className="features flex flex-row justify-center mb-4 ">
          <p className="text-white bg-emerald-600 w-full text-center rounded-full px-4 shadow-sm">
            {successMsg}
          </p>
        </div>
      )}
      {errorMsg && (
        <div className="features flex flex-row justify-center mb-4">
          <p className="text-white bg-red-600 w-full text-center rounded-full px-4 shadow">
            {errorMsg}
          </p>
        </div>
      )}
    </>
  );
};

export default Message;
