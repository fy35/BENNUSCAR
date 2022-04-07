import React from 'react';
import Loader from '../../../../components/ui/Loader';

const SettingsLeftSide = ({ user }) => {
  return (
    <>
      {user ? (
        <div className="w-full md:w-3/12 md:mx-2 p-2 flex flex-col justify-center items-center gap-2 ">
          <div className="w-[150px] h-[150px] relative overflow-hidden rounded-full border-[3px]">
            <img
              className="block my-0 mx-auto h-auto w-auto -ml-0"
              src={user.image ? `/uploads/profiles/${user.image}` : '/assets/null-person.jpg'}
              alt=""
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="block text-2xl font-semibold tracking-wide px-4 pt-2 text-gray-700 dark:text-white ">
              {user.fullname ? user.fullname : 'BENNUSCAR.'}
            </span>
            <p className="text-sm text-gray-500 hover:text-gray-700 leading-6">
              {user.username ? user.username : 'BENNUSCAR.'}
            </p>
          </div>

          <p className="text-sm text-gray-500 hover:text-gray-700 leading-6">
            {user.email ? user.email : 'BENNUSCAR.'}
          </p>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SettingsLeftSide;
