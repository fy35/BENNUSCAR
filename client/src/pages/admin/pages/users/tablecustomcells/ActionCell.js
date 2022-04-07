import React, { useState } from 'react';
import axios from 'axios';

//ui
import Loader from '../../../../../components/ui/Loader';
import Message from '../../../../../components/ui/Message';
import Modal from '../../../../../components/ui/Modal';

//table comps
import { Table, IconButton, Divider } from 'rsuite';

//customization
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';

//customize
import { Icon } from '@iconify/react';

const { Cell } = Table;

//actionbuttons
const ActionCell = ({ rowData, dataKey, ...props }) => {
  //USER PROFILE UPDATE QUERY
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    bio: '',
    address: '',
    role: '',
    loading: false,
    successMsg: false,
    errorMsg: false,
  });

  const handleEditButton = () => {
    setShowEditModal(true);
    setEditingUserId(rowData[dataKey]);
    setFormData({
      fullname: rowData.fullname,
      username: rowData.username,
      email: rowData.email,
      bio: rowData.bio,
      address: rowData.address,
      role: rowData.role,
      loading: false,
      successMsg: '',
      errorMsg: '',
    });
    setImage(rowData.image);
  };

  const { loading, successMsg, errorMsg } = formData;
  const [image, setImage] = useState();

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      successMsg: '',
      errorMsg: '',
    });
  };

  const imageUploadHandler = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const updateUserByAdmin = async (e) => {
    e.preventDefault();

    const { fullname, username, email, bio, address, role } = formData;

    const profileData = new FormData();

    profileData.append('fullname', fullname);
    profileData.append('username', username);
    profileData.append('email', email);
    profileData.append('bio', bio);
    profileData.append('address', address);
    profileData.append('role', role);
    profileData.append('image', image);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      loading: true,
      successMsg: '',
      errorMsg: '',
    });

    try {
      const res = await axios.put(`/api/private/admin/users/${editingUserId}`, profileData, config);
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        loading: false,
        successMsg: res.data.message,
        errorMsg: '',
      });
    } catch (error) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        loading: false,
        successMsg: '',
        errorMsg: error.response.data.error,
      });
    }
  };

  //USER ACCOUNT DELETE QUERY
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState();

  const handleDeleteButton = () => {
    setShowDeleteModal(true);
    setDeletingUserId(rowData[dataKey]);
    setFormData({
      ...formData,
      loading: false,
      successMsg: '',
      errorMsg: '',
    });
  };

  const deleteUserByAdmin = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application-json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    setFormData({
      ...formData,
      loading: true,
      successMsg: '',
      errorMsg: '',
    });

    try {
      const res = await axios.delete(`/api/private/admin/users//delete/${deletingUserId}`, config);
      setFormData({
        ...formData,
        loading: false,
        successMsg: res.data.message,
        errorMsg: '',
      });
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
        successMsg: '',
        errorMsg: error.response.data.error,
      });
    }
  };

  return (
    <Cell {...props} className="link-group">
      {/* user profile change renders */}
      <IconButton
        appearance="subtle"
        onClick={handleEditButton}
        icon={<EditIcon color="green" />}
      />
      <Modal showModal={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-40 w-40 rounded-full bg-red-100 sm:mx-0 sm:h-20 sm:w-20">
              <img
                src={
                  rowData.image ? `../uploads/profiles/${rowData.image}` : '/assets/null-person.jpg'
                }
                alt=""
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h4 className="text-medium text-gray-400 flex gap-1 text-center">
                Change <p className="text-red-500">{rowData.username}'s</p> Profile
              </h4>
              <div className="mt-2">
                {loading && <Loader />}
                <Message successMsg={successMsg} errorMsg={errorMsg} />
                <form className="grid grid-cols-1 gap-2" onSubmit={updateUserByAdmin}>
                  {/* fullname */}
                  <div className="grid grid-cols-4 items-center">
                    <div className="px-4 py-2 font-semibold col-span-1 ">Fullname</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-3 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="fullname"
                        id="fullname"
                        placeholder={rowData.fullname}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  {/* username */}
                  <div className="grid grid-cols-4 items-center">
                    <div className="px-4 py-2 font-semibold col-span-1">Username</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-3 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="username"
                        id="username"
                        placeholder={rowData.username}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  {/* email */}
                  <div className="grid grid-cols-4 items-center">
                    <div className="px-4 py-2 font-semibold col-span-1">Email</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-3 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="email"
                        name="email"
                        id="email"
                        placeholder={rowData.email}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>{' '}
                  {/* bio */}
                  <div className="grid grid-cols-4 items-center">
                    <div className="px-4 py-2 font-semibold col-span-1">Bio</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-3 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="bio"
                        id="bio"
                        placeholder={rowData.bio}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  {/* address */}
                  <div className="grid grid-cols-4 items-center">
                    <div className="px-4 py-2 font-semibold col-span-1">Address</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-3 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="address"
                        id="address"
                        placeholder={rowData.address}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>{' '}
                  {/* role */}
                  <div className="grid grid-cols-5 items-center">
                    <div className="px-4 py-2 font-semibold col-span-3">
                      Role ( 0 = User, 1 = Admin )
                    </div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-2 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="role"
                        id="role"
                        placeholder={rowData.role}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 items-center">
                    <div className="pl-4 py-2 font-semibold col-span-2">Profile Picture</div>
                    <div className="flex justify-center col-span-4">
                      <input type="file" name="profile" id="image" onChange={imageUploadHandler} />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/*  */}
      <Divider vertical />
      {/*  */}
      {/* user delete renders */}
      <IconButton
        appearance="subtle"
        onClick={handleDeleteButton}
        icon={<TrashIcon color="red" />}
      />

      <Modal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-40 w-40 rounded-full bg-red-100 sm:mx-0 sm:h-20 sm:w-20">
              <img
                src={
                  rowData.image ? `../uploads/profiles/${rowData.image}` : '/assets/null-person.jpg'
                }
                alt=""
              />
            </div>
            <div className="mt-3 flex flex-col justify-center sm:mt-0 sm:ml-4 sm:text-left">
              <h4 className="text-medium text-gray-400 gap-1 flex justify-center ">
                Deleting <p className="text-red-600">{rowData.username}'s</p> account
              </h4>
              <div className="mt-2 flex flex-col justify-center">
                {loading && <Loader />}
                <Message successMsg={successMsg} errorMsg={errorMsg} />
                <div className="w-full text-center px-4 py-2 font-medium col-span-4 ">
                  You are going to delete this account if you click DELETE
                </div>
                <div className="w-full text-center px-4 py-2 font-semibold col-span-4 text-red-700 ">
                  *** Are you sure about that? ***
                </div>
                <div className="px-4 py-3 flex flex-col gap-2 sm:flex sm:flex-row sm:justify-center">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteUserByAdmin}
                  >
                    DELETE
                  </button>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Cell>
  );
};

export default ActionCell;
