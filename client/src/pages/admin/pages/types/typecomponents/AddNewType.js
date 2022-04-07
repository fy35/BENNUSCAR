import React, { useState } from 'react';
import axios from 'axios';

//ui
import Modal from '../../../../../components/ui/Modal';
import Loader from '../../../../../components/ui/Loader';
import Message from '../../../../../components/ui/Message';

//table comps
import { IconButton } from 'rsuite';
import AddOutlineIcon from '@rsuite/icons/AddOutline';

//custom
import { Icon } from '@iconify/react';

const AddNewType = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    loading: false,
    successMsg: false,
    errorMsg: false,
  });
  const { loading, successMsg, errorMsg } = formData;
  const [typeImage, setTypeImage] = useState();

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
    setTypeImage(image);
  };

  const addTypeByAdmin = async (e) => {
    e.preventDefault();

    const { name, desc } = formData;

    const typeData = new FormData();

    typeData.append('name', name);
    typeData.append('desc', desc);
    if (!typeImage || typeImage === null || typeImage === undefined) {
      typeData.append('typeImage', '');
    } else {
      typeData.append('typeImage', typeImage);
    }

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
      const res = await axios.post(`/api/private/type/create/`, typeData, config);

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

  return (
    <div>
      <IconButton icon={<AddOutlineIcon color="green" />} onClick={(e) => setShowAddModal(true)}>
        Add new type
      </IconButton>

      <Modal showModal={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-full bg-white-100 sm:mx-0 sm:w-20">
              <div className="h-full px-2 rounded shadow-md flex flex-col font-semibold bg-emerald-700 text-white">
                <span>B</span> <span>E</span> <span>N</span> <span>N</span> <span>U</span>{' '}
                <span>S</span> <span>C</span> <span>A</span> <span>R</span>{' '}
              </div>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h4 className="text-medium text-gray-400 flex gap-1 text-center">Add New Type</h4>
              <div className="mt-2">
                {loading && <Loader />}
                <Message successMsg={successMsg} errorMsg={errorMsg} />
                <form className="grid grid-cols-1 gap-2" onSubmit={addTypeByAdmin}>
                  {/* fullname */}
                  <div className="grid grid-cols-6 items-center">
                    <div className="px-4 py-2 font-semibold col-span-2 ">Type Name</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="name"
                        id="name"
                        placeholder={'Add Type Name'}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>{' '}
                  <div className="grid grid-cols-6 items-center">
                    <div className="px-4 py-2 font-semibold col-span-2 ">Type Desc</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="desc"
                        id="desc"
                        placeholder={'Add Type Desc'}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 items-center">
                    <div className="pl-4 py-2 font-semibold col-span-2">Type Picture</div>
                    <div className="flex justify-center col-span-4">
                      <input
                        type="file"
                        name="typeImage"
                        id="typeImage"
                        onChange={imageUploadHandler}
                      />
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
    </div>
  );
};

export default AddNewType;
