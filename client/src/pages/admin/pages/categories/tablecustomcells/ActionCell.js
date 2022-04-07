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

const ActionCell = ({ rowData, dataKey, ...props }) => {
  //CATEGORY UPDATE QUERY
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState();

  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    loading: false,
    successMsg: false,
    errorMsg: false,
  });

  const handleEditButton = () => {
    setShowEditModal(true);
    setEditingCategoryId(rowData[dataKey]);
    setFormData({
      name: rowData.name,
      desc: rowData.desc,
      loading: false,
      successMsg: '',
      errorMsg: '',
    });
    setCategoryImage(rowData.categoryImage);
  };

  const { loading, successMsg, errorMsg } = formData;
  const [categoryImage, setCategoryImage] = useState();

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      successMsg: '',
      errorMsg: '',
    });
  };

  const imageUploadHandler = (e) => {
    const categoryImage = e.target.files[0];
    setCategoryImage(categoryImage);
  };

  const updateCategoryByAdmin = async (e) => {
    e.preventDefault();

    const { name, desc } = formData;

    const categoryData = new FormData();

    categoryData.append('name', name);
    categoryData.append('desc', desc);
    if (!categoryImage || categoryImage === null || categoryImage === undefined) {
      categoryData.append('categoryImage', '');
    } else {
      categoryData.append('categoryImage', categoryImage);
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
      const res = await axios.put(
        `/api/private/category/update/${editingCategoryId}`,
        categoryData,
        config
      );
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
  const [deletingCategoryId, setDeletingCategorId] = useState();

  const handleDeleteButton = () => {
    setShowDeleteModal(true);
    setDeletingCategorId(rowData[dataKey]);
    setFormData({
      ...formData,
      loading: false,
      successMsg: '',
      errorMsg: '',
    });
  };

  const deleteCategoryByAdmin = async (e) => {
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
      const res = await axios.delete(`/api/private/category/delete/${deletingCategoryId}`, config);
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
      {/* type change renders */}
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
                  rowData.categoryImage
                    ? `../uploads/categories/${rowData.categoryImage}`
                    : '/assets/null.png'
                }
                alt=""
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h4 className="text-medium text-gray-400 flex gap-1 text-center">
                Changing <p className="text-red-500">{rowData.name}</p> Category
              </h4>
              <div className="mt-2">
                {loading && <Loader />}
                <Message successMsg={successMsg} errorMsg={errorMsg} />
                <form className="grid grid-cols-1 gap-2" onSubmit={updateCategoryByAdmin}>
                  {/* fullname */}
                  <div className="grid grid-cols-7 items-center">
                    <div className="px-4 py-2 font-semibold col-span-3 ">Category Name</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="name"
                        id="name"
                        placeholder={rowData.name}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>{' '}
                  <div className="grid grid-cols-7 items-center">
                    <div className="px-4 py-2 font-semibold col-span-3 ">Category Desc</div>
                    <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                      <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                      <input
                        className="border-none focus:ring-0 max-h-[30px] w-full"
                        type="text"
                        name="desc"
                        id="desc"
                        placeholder={rowData.desc}
                        autoComplete="off"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 items-center">
                    <div className="pl-4 py-2 font-semibold col-span-3">Category Picture</div>
                    <div className="flex justify-center col-span-4">
                      <input
                        type="file"
                        name="categoryImage"
                        id="categoryImage"
                        onChange={imageUploadHandler}
                      />
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
      {/* category delete renders */}
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
                  rowData.categoryImage
                    ? `../uploads/categories/${rowData.categoryImage}`
                    : '/assets/null.png'
                }
                alt=""
              />
            </div>
            <div className="mt-3 flex flex-col justify-center sm:mt-0 sm:ml-4 sm:text-left">
              <h4 className="text-medium text-gray-400 gap-1 flex justify-center ">
                Deleting <p className="text-red-600">{rowData.name}</p> Category
              </h4>
              <div className="mt-2 flex flex-col justify-center">
                {loading && <Loader />}
                <Message successMsg={successMsg} errorMsg={errorMsg} />
                <div className="w-full text-center px-4 py-2 font-medium col-span-4 ">
                  You are going to delete this CATEGORY if you click DELETE
                </div>
                <div className="w-full text-center px-4 py-2 font-semibold col-span-4 shadow-lg rounded text-white bg-emerald-500 hover:bg-red-700 hover:text-white">
                  ??? Are you sure about that? ???
                </div>
                <div className="px-4 py-3 flex flex-col gap-2 sm:flex sm:flex-row sm:justify-center">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteCategoryByAdmin}
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
