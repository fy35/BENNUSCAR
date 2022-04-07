import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

//redux
import Loader from '../../../../components/ui/Loader';
import Message from '../../../../components/ui/Message';

//customize
import { Icon } from '@iconify/react';

const ProfileChange = ({ user }) => {
  const history = useHistory();
  const token = localStorage.getItem('authToken');

  /***************************
   ******* COMP STATES *******
   ***************************/
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [fullname, setFullname] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!token) {
      history.push('/login');
    } else {
      setFullname(user.fullname);
      setBio(user.bio);
      setAddress(user.address);
      setImage(user.image);
    }
  }, [user, token, history]);

  const imageUploadHandler = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const profileSubmitHandler = async (e) => {
    e.preventDefault();

    const profileData = new FormData();

    profileData.append('fullname', fullname);
    profileData.append('bio', bio);
    profileData.append('address', address);
    profileData.append('image', image);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };
    setLoading(true);

    try {
      const res = await axios.put(`/api/private/user/updateprofile/`, profileData, config);
      setSuccessMsg(res.data.message);
      setLoading(false);

      setTimeout(() => {
        history.push('/userdashboard');
      }, 4000);
    } catch (error) {
      setErrorMsg(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
        <span className="tracking-wide">Account Settings</span>
      </div>
      <div className="text-gray-700">
        {loading && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        <Message successMsg={successMsg} errorMsg={errorMsg} />

        {user && (
          <form onSubmit={profileSubmitHandler}>
            <div className="grid md:grid-cols-2 text-sm mb-4">
              <div className="grid grid-cols-2 items-center">
                <div className="px-4 py-2 font-semibold ">Name - Surname</div>
                <div className="flex items-center border-2 px-3 rounded-2xl ">
                  <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                  <input
                    className="border-none focus:ring-0 max-h-[30px]"
                    type="text"
                    name="fullname"
                    id="fullname"
                    placeholder={fullname}
                    autoComplete="off"
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 text-sm mb-4">
              <div className="grid grid-cols-2 items-center">
                <div className="px-4 py-2 font-semibold ">Biography</div>
                <div className="flex items-center border-2 px-3 rounded-2xl ">
                  <Icon
                    className="text-gray-400"
                    icon="fluent:text-description-20-regular"
                    width="20"
                  />
                  <input
                    className="border-none focus:ring-0 max-h-[30px]"
                    type="text"
                    name="bio"
                    id="bio"
                    placeholder={bio}
                    autoComplete="off"
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 text-sm mb-4">
              <div className="grid grid-cols-2 items-center">
                <div className="px-4 py-2 font-semibold ">Address</div>
                <div className="flex items-center border-2 px-3 rounded-2xl ">
                  <Icon className="text-gray-400" icon="fa6-regular:address-book" width="20" />
                  <input
                    className="border-none focus:ring-0 max-h-[30px]"
                    type="text"
                    name="address"
                    id="address"
                    placeholder={address}
                    autoComplete="off"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 text-sm mb-4">
              <div className="grid grid-cols-2 items-center">
                <div className="px-4 py-2 font-semibold ">Profile Picture</div>
                <div className="flex justify-center">
                  <input type="file" name="image" id="image" onChange={imageUploadHandler} />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 text-sm mb-4">
              <div className="grid grid-cols-2 items-center">
                <div className="px-4 py-2 font-semibold "></div>
                <div className="flex items-center px-3 rounded-2xl ">
                  <button
                    className="bg-[#f6f8fa] hover:bg-[#f3f4f6] border border-[rgba(27,31,36,0.15)] rounded-md w-[100%] shadow-sm"
                    tabIndex="4"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProfileChange;
