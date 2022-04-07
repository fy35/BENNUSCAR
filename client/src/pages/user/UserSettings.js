import { useState, useEffect } from 'react';
import axios from 'axios';

//ui
import Loader from '../../components/ui/Loader';

//components
import PasswordChange from './usercomponents/settings/PasswordChange';
import SettingsLeftSide from './usercomponents/settings/SettingsLeftSide';
import ProfileChange from './usercomponents/settings/ProfileChange';

const UserSettings = ({ history }) => {
  /***************************
   ****** LIFECYCYLE *****
   ***************************/
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const token = localStorage.getItem('authToken');

  //getting user data
  useEffect(() => {
    if (!token) {
      history.push('/login');
    } else {
      const fetchUser = async () => {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ownertype: `user`,
          },
        };
        setLoading(true);
        try {
          const res = await axios.get(`/api/private/user`, config);
          setUser(res.data.user);
          setLoading(false);
        } catch (error) {
          localStorage.removeItem('authToken');
          history.push('/login');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [history, token]);

  return (
    <div className="bg-gray-100 min-w-screen">
      <div className="container m-auto overflow-hidden">
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-rows-2 gap-4 my-2">
            <div className="md:flex no-wrap md:mx-2 bg-white rounded border p-2 gap-2 md:divide-x">
              <SettingsLeftSide user={user} />
              <div className="w-full md:w-9/12 md:mx-2 pl-4">
                <PasswordChange />
                <ProfileChange user={user} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
