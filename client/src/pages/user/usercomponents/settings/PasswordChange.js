import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

//ui
import Loader from '../../../../components/ui/Loader';
import Message from '../../../../components/ui/Message';

//customization
import { Icon } from '@iconify/react';

const PasswordChange = () => {
  const history = useHistory();

  /***************************
   ******* COMP STATES *******
   ***************************/
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldpassword: '',
    newpassword: '',
    newpassword2: '',
  });

  const { oldpassword, newpassword, newpassword2 } = passwordData;

  const changeHandler = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const newPasswordSubmitHandler = async (e) => {
    e.preventDefault();

    if (isEmpty(oldpassword) || isEmpty(newpassword) || isEmpty(newpassword2)) {
      setErrorMsg('All fields are required');
    } else {
      const { oldpassword, newpassword, newpassword2 } = passwordData;

      const data = { oldpassword, newpassword, newpassword2 };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      setLoading(true);
      try {
        const res = await axios.put(`/api/private/user/updatepassword/`, data, config);

        setSuccessMsg(res.data.message);
        setLoading(false);

        setTimeout(() => {
          localStorage.removeItem('authToken');
          history.push('/login');
        }, 5000);
      } catch (error) {
        setErrorMsg(error.response.data.error);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
        <span className="tracking-wide">Change Password</span>
      </div>
      <div className="text-gray-700">
        {loading && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        <Message successMsg={successMsg} errorMsg={errorMsg} />
        <form onSubmit={newPasswordSubmitHandler}>
          <div className="grid md:grid-cols-2 text-sm mb-4">
            <div className="grid grid-cols-2 items-center">
              <div className="px-4 py-2 font-semibold ">Old password</div>
              <div className="flex items-center border-2 px-3 rounded-2xl ">
                <Icon className="text-gray-400" icon="bxs:lock-alt" width="20" />
                <input
                  className="border-none focus:ring-0 max-h-[30px]"
                  type="password"
                  name="oldpassword"
                  id="oldpassword"
                  placeholder="Old Password"
                  required
                  autoComplete="off"
                  onChange={changeHandler}
                  tabIndex="1"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 text-sm">
            <div className="grid grid-cols-2 mb-4 items-center">
              <div className="px-4 py-2 font-semibold">New password</div>
              <div className="flex items-center border-2 px-3 rounded-2xl ">
                <Icon className="text-gray-400" icon="bxs:lock-alt" width="20" />
                <input
                  className="border-none focus:ring-0 max-h-[30px]"
                  type="password"
                  name="newpassword"
                  id="newpassword"
                  placeholder="New Password"
                  required
                  autoComplete="off"
                  onChange={changeHandler}
                  tabIndex="2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 mb-4 items-center">
              <div className="px-4 py-2 font-semibold">Confirm password</div>
              <div className="flex items-center border-2 px-3 rounded-2xl ">
                <Icon className="text-gray-400" icon="bxs:lock-alt" width="20" />
                <input
                  className="border-none focus:ring-0 max-h-[30px]"
                  type="password"
                  name="newpassword2"
                  id="newpassword2"
                  placeholder="Confirm password"
                  required
                  autoComplete="off"
                  onChange={changeHandler}
                  tabIndex="2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 mb-4 items-center">
              <div className="px-4 py-2 font-semibold"></div>
              <div className="px-4 py-2 font-semibold">
                <button
                  className="bg-[#f6f8fa] hover:bg-[#f3f4f6] border border-[rgba(27,31,36,0.15)] rounded-md w-[100%] shadow-sm"
                  tabIndex="4"
                >
                  Send password
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PasswordChange;
