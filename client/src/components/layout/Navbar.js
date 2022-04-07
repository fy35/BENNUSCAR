import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory, withRouter } from 'react-router-dom';

//customization
import { Menu, Transition } from '@headlessui/react';
import { AiOutlineCar } from 'react-icons/ai';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    history.push('/login');
  };

  //move to top
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  //getting user info
  const [user, setUser] = useState([]);

  const token = localStorage.getItem('authToken');
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
    } else {
      const fetchUser = async () => {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ownertype: `header`,
          },
        };

        try {
          const res = await axios.get(`/api/private/user`, config);
          setUser(res.data.user);
        } catch (error) {
          localStorage.removeItem('authToken');
          history.push('/login');
        }
      };
      fetchUser();
    }
  }, [history, token]);

  return (
    <div className="h-[70px] w-full">
      <nav className="fixed left-0 right-0 top-0 bg-white border-b-[1px] border-gray-200 px-10 sm:px-4 py-2.5 dark:bg-gray-800 z-10">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" className="flex items-center relative  ">
            <div className="w-10 h-10 rounded-full bg-emerald-700 dark:bg-white   flex items-center justify-center z-10">
              <AiOutlineCar className="text-3xl text-white dark:text-emerald-700 " />
            </div>
            <div className=" bg-emerald-700 dark:bg-white rounded-tr-full rounded-br-full absolute left-8 z-0">
              <span className=" ml-2 self-center text-xl font-semibold whitespace-nowrap text-white dark:text-emerald-700 pr-2 ">
                BENNUSCAR.
              </span>
            </div>
          </Link>
          <div className="flex items-center md:order-2">
            {token && (
              <>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="w-[50px] h-[50px] relative overflow-hidden rounded-full border-[3px]">
                      <img
                        className="inline mx-auto h-auto w-auto"
                        src={
                          user.image
                            ? `../uploads/profiles/${user.image}`
                            : '/assets/null-person.jpg'
                        }
                        alt="user"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          <span className="block text-sm px-4 py-2 text-gray-900 dark:text-white ">
                            {user.fullname ? user.fullname : 'BENNUSCAR.'}
                          </span>
                        </Menu.Item>
                        <Menu.Item>
                          <span className="block text-sm font-medium px-4 py-2  text-gray-500 truncate dark:text-gray-400">
                            {user.email ? user.email : 'BENNUSCAR.'}
                          </span>
                        </Menu.Item>
                      </div>
                      {user.role === 1 && (
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admindashboard"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Admin Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                      )}
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/userdashboard"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/userdashboard/settings`}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="submit"
                              onClick={logoutHandler}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block w-full text-left px-4 py-2 text-sm'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            )}

            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              {token && (
                <>
                  <li>
                    <Link
                      to="/cars"
                      className="block py-2 pr-4 pl-3 text-white bg-emerald-700 rounded md:bg-transparent md:text-emerald-700 md:p-0 dark:text-white"
                      aria-current="page"
                    >
                      Cars
                    </Link>
                  </li>
                </>
              )}
              {!token && (
                <>
                  <li>
                    <Link
                      to="/"
                      className="block py-2 pr-4 pl-3 text-white bg-emerald-700 rounded md:bg-transparent md:text-emerald-700 md:p-0 dark:text-white"
                      aria-current="page"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/contact"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default withRouter(Navbar);
