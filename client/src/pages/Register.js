import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//ui
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

//validator
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';

//customization
import { AiOutlineCar } from 'react-icons/ai';
import { Icon } from '@iconify/react';

const Register = ({ history }) => {
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      history.push('/');
    }
  }, [history]);

  /***************************
   ****** COMP STATES *****
   ***************************/

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    loading: false,
    successMsg: false,
    errorMsg: false,
  });

  const { fullname, username, email, password, password2, loading, successMsg, errorMsg } =
    formData;

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

  const registerSubmitHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    if (
      isEmpty(fullname) ||
      isEmpty(username) ||
      isEmpty(email) ||
      isEmpty(password) | isEmpty(password2)
    ) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: 'All fields are required !',
      });
    } else if (!username.match(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: 'Username must be valid!',
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: 'Email must be valid !',
      });
    } else if (!equals(password, password2)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: 'Passwords do not match !',
      });
    } else {
      const { fullname, username, email, password } = formData;
      const newUserData = { fullname, username, email, password };

      setFormData({
        ...formData,
        loading: true,
        successMsg: '',
        errorMsg: '',
      });

      try {
        const res = await axios.post('/api/auth/register', newUserData, config);
        setFormData({
          ...formData,
          loading: false,
          successMsg: 'Succesfully registered. Redirecting to homepage...',
        });
        localStorage.setItem('authToken', res.data.token);
        setTimeout(() => {
          history.push('/');
        }, 1000);
      } catch (error) {
        setFormData({
          ...formData,
          loading: false,
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(/assets/bg-register.jpg)`,
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
        <form className="bg-white" onSubmit={registerSubmitHandler}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hi !</h1>
          {loading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          <Message successMsg={successMsg} errorMsg={errorMsg} />
          {/* fullname*/}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 ">
            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
            <input
              className="pl-2 border-none focus:ring-0 "
              type="text"
              name="fullname"
              id="fullname"
              required
              placeholder="Full name"
              autoComplete="off"
              value={fullname}
              onChange={changeHandler}
            />
          </div>
          {/* username */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <Icon className="text-gray-400" icon="fluent:fingerprint-20-regular" width="20" />
            <input
              className="pl-2 border-none focus:ring-0"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              required
              minLength={6}
              maxLength={20}
              autoComplete="off"
              value={username}
              onChange={changeHandler}
            />
          </div>
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
              value={email}
              onChange={changeHandler}
            />
          </div>
          {/* password */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <Icon className="text-gray-400" icon="bxs:lock-alt" width="20" />
            <input
              className="pl-2 border-none focus:ring-0"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              autoComplete="off"
              value={password}
              onChange={changeHandler}
            />
          </div>
          {/* password2 */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <Icon className="text-gray-400" icon="bxs:lock-alt" width="20" />
            <input
              className="pl-2 border-none focus:ring-0"
              type="password"
              name="password2"
              id="password2"
              placeholder="Confirm Password"
              required
              autoComplete="off"
              value={password2}
              onChange={changeHandler}
            />
          </div>

          <button
            type="submit"
            className="block w-full bg-emerald-600 hover:bg-emerald-500 transition-colors mt-4 py-2 rounded-2xl text-white font-semibold mb-2 text-center"
          >
            Register
          </button>
          <Link to="/login" className="text-sm ml-2 hover:text-emerald-500 ">
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
