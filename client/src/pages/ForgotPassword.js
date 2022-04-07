import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//ui
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

//validator
import isEmpty from 'validator/lib/isEmpty';

//customization
import { AiOutlineCar } from 'react-icons/ai';
import { Icon } from '@iconify/react';

const ForgotPassword = () => {
  /***************************
   ****** COMP STATES *****
   ***************************/

  const [formData, setFormData] = useState({
    email: '',
    loading: false,
    successMsg: false,
    errorMsg: false,
  });

  const { email, loading, successMsg, errorMsg } = formData;

  /***************************
   ****** EVENT HANDLERS *****
   ***************************/
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      successMsg: '',
      errorMsg: '',
    });
  };

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    if (isEmpty(email)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: 'All fields are required',
      });
    } else {
      const { email } = formData;
      const data = { email };

      setFormData({
        ...formData,
        loading: true,
        successMsg: '',
        errorMsg: '',
      });

      try {
        const res = await axios.post('/api/auth/forgotpassword', data, config);
        setFormData({
          ...formData,
          loading: false,
          successMsg: res.data.data,
        });
      } catch (error) {
        setFormData({
          ...formData,
          loading: false,
          email: '',
          errorMsg: error.response.data.error,
        });
      }
    }
  };

  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-emerald-900 to-emerald-700 justify-center items-center hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(/assets/bg-forgot.jpg)`,
        }}
      >
        <Link to="/" className="flex items-center relative">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-white flex items-center justify-center z-10 absolute -left-8">
            <AiOutlineCar className="text-3xl text-emerald-700 dark:text-emerald-700" />
          </div>
          <div className=" bg-white dark:bg-white rounded-tr-full rounded-br-full">
            <span className="ml-2 self-center text-xl font-semibold text-emerald-700 dark:text-emerald-700 pr-2 ">
              BENNUSCAR.
            </span>
          </div>
        </Link>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white" onSubmit={forgotPasswordHandler}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Don't worry</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Enter a valid email</p>
          {loading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          <Message successMsg={successMsg} errorMsg={errorMsg} />
          {/* email */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <Icon className="text-gray-400" icon="teenyicons:at-solid" width="20" />
            <input
              className="pl-2 border-none focus:ring-0"
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              required
              autoComplete="off"
              onChange={changeHandler}
            />
          </div>
          <button
            type="submit"
            className="block w-full bg-emerald-600 hover:bg-emerald-500 transition-colors mt-4 py-2 rounded-2xl text-white font-semibold mb-2 text-center"
          >
            Login
          </button>
          <Link to="/login" className="text-sm ml-2 hover:text-emerald-500 ">
            Remembered password?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
