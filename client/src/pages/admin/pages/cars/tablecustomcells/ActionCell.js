import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  //TYPE UPDATE QUERY
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState();

  const [formData, setFormData] = useState({
    name: '',
    carVIN: '',
    carImage: '',
    capacity: '',
    bagCapacity: '',
    passengerAirbag: false,
    fuelType: '',
    gearType: '',
    brakeABS: false,
    rentPerDay: '',
    monthlyCost: '',
    category: '',
    type: '',
    driverConditions: {
      driverAge: '',
      driverLicense: '',
      creditCard: false,
    },

    loading: false,
    successMsg: false,
    errorMsg: false,
  });

  const handleEditButton = () => {
    setFormData({
      ...formData,
      loading: true,
    });
    setShowEditModal(true);
    setEditingCarId(rowData[dataKey]);
    setFormData({
      ...formData,
      name: rowData.name,
      carVIN: rowData.carVIN,
      carImage: rowData.carImage,
      capacity: rowData.capacity,
      bagCapacity: rowData.bagCapacity,
      passengerAirbag: rowData.passengerAirbag,
      fuelType: rowData.fuelType,
      gearType: rowData.gearType,
      brakeABS: rowData.brakeABS,
      rentPerDay: rowData.rentPerDay,
      monthlyCost: rowData.monthlyCost,
      category: rowData.category,
      type: rowData.type,
      driverConditions: {
        driverAge: rowData.driverConditions.driverAge,
        driverLicense: rowData.driverConditions.driverLicense,
        creditCard: rowData.driverConditions.creditCard,
      },
      loading: false,
    });
  };

  const { loading, successMsg, errorMsg } = formData;

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      successMsg: '',
      errorMsg: '',
    });
  };

  const imageUploadHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
      successMsg: '',
      errorMsg: '',
    });
  };

  const checkHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
      successMsg: '',
      errorMsg: '',
    });
  };

  const driverConditionChangeHandler = (e) => {
    setFormData({
      ...formData,
      driverConditions: {
        ...formData.driverConditions,
        [e.target.name]: e.target.value,
      },
      successMsg: '',
      errorMsg: '',
    });
  };

  const driverConditionCheckHandler = (e) => {
    setFormData({
      ...formData,
      driverConditions: {
        ...formData.driverConditions,
        [e.target.name]: e.target.checked,
      },
      successMsg: '',
      errorMsg: '',
    });
  };

  //fetch categories
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchCategories = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const res = await axios.get(`/api/private/category/getcategories?sort=desc`, config);
        setCategories(res.data.data.categories);
      } catch (error) {
        localStorage.removeItem('authToken');
        history.push('/login');
      }
    };

    fetchCategories();
  }, [history]);

  //fetch types
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchTypes = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const res = await axios.get(`/api/private/type/gettypes?sort=desc`, config);
        setTypes(res.data.data.types);
      } catch (error) {
        localStorage.removeItem('authToken');
        history.push('/login');
      }
    };

    fetchTypes();
  }, [history]);

  const updateCarByAdmin = async (e) => {
    e.preventDefault();

    const {
      name,
      carVIN,
      carImage,
      capacity,
      bagCapacity,
      passengerAirbag,
      fuelType,
      gearType,
      brakeABS,
      rentPerDay,
      monthlyCost,
      category,
      type,
      driverConditions,
    } = formData;

    const { driverAge, driverLicense, creditCard } = driverConditions;

    let carData = new FormData();

    carData.append('name', name);
    carData.append('carVIN', carVIN);
    carData.append('capacity', capacity);
    carData.append('bagCapacity', bagCapacity);
    carData.append('passengerAirbag', passengerAirbag);
    carData.append('fuelType', fuelType);
    carData.append('gearType', gearType);
    carData.append('brakeABS', brakeABS);
    carData.append('rentPerDay', rentPerDay);
    carData.append('monthlyCost', monthlyCost);
    carData.append('category', category);
    carData.append('type', type);
    carData.append(`driverConditions[driverAge]`, driverAge);
    carData.append(`driverConditions[driverLicense]`, driverLicense);
    carData.append(`driverConditions[creditCard]`, creditCard);

    if (!carImage || carImage === null || carImage === undefined) {
      carData.append('carImage', '');
    } else {
      carData.append('carImage', carImage);
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
      const res = await axios.put(`/api/private/car/update/${editingCarId}`, carData, config);
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
  const [deletingCarId, setDeletingCarId] = useState();

  const handleDeleteButton = () => {
    setShowDeleteModal(true);
    setDeletingCarId(rowData[dataKey]);
    setFormData({
      ...formData,
      loading: false,
      successMsg: '',
      errorMsg: '',
    });
  };

  const deleteCarByAdmin = async (e) => {
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
      const res = await axios.delete(`/api/private/car/delete/${deletingCarId}`, config);
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
      <IconButton
        appearance="subtle"
        onClick={handleEditButton}
        icon={<EditIcon color="green" />}
      />
      {/* type change renders */}
      <Modal showModal={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          {loading ? (
            <div className="flex justify-items-stretch">
              <Loader />
            </div>
          ) : (
            <>
              <div className="sm:flex sm:items-start">
                {/* LOGO */}
                <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-full bg-white-100 sm:mx-0 sm:w-20">
                  <div className="h-full px-2 rounded shadow-md flex flex-row sm:flex-col font-semibold bg-emerald-700 text-white">
                    <span>B</span> <span>E</span> <span>N</span> <span>N</span> <span>U</span>{' '}
                    <span>S</span> <span>C</span> <span>A</span> <span>R</span>{' '}
                  </div>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h4 className="text-medium text-gray-400 flex gap-1 text-center">Add New Car</h4>
                  <div className="mt-2">
                    {loading && <Loader />}
                    <Message successMsg={successMsg} errorMsg={errorMsg} />
                    <form className="grid grid-cols-1" onSubmit={updateCarByAdmin}>
                      <div className="grid md:grid-cols-2">
                        {/* Car Name */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Car Name</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="text"
                              name="name"
                              id="name"
                              placeholder={formData.name}
                              autoComplete="off"
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                        {/* Car VIN */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Car VIN</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="text"
                              name="carVIN"
                              id="carVIN"
                              placeholder={formData.carVIN}
                              autoComplete="off"
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2">
                        {/* Category Type */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Category</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <select
                              className="border-none focus:ring-0 max-h-[30px] w-full px-2 py-1"
                              name="category"
                              id="category"
                              value={formData.category}
                              onChange={changeHandler}
                            >
                              {categories &&
                                categories.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        {/* Car Type */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Car Type</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <select
                              className="border-none focus:ring-0 max-h-[30px] w-full px-2 py-1"
                              name="type"
                              id="type"
                              value={formData.type}
                              onChange={changeHandler}
                            >
                              {types &&
                                types.map((type) => (
                                  <option key={type._id} value={type._id}>
                                    {type.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2">
                        {/* Fuel Type */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Fuel Type</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <select
                              className="border-none focus:ring-0 max-h-[30px] w-full px-2 py-1"
                              type="number"
                              name="fuelType"
                              id="fuelType"
                              value={formData.fuelType}
                              onChange={changeHandler}
                            >
                              <option value="Gasoline">Gasoline</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Electric">Electric</option>
                              <option value="Biodiesel">Biodiesel</option>
                              <option value="Hydrogen">Hydrogen</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>
                        </div>{' '}
                        {/* Gear Type */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Gear Type</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <select
                              className="border-none focus:ring-0 max-h-[30px] w-full px-2 py-1"
                              type="number"
                              name="gearType"
                              id="gearType"
                              value={formData.gearType}
                              onChange={changeHandler}
                            >
                              <option value="">Choose one...</option>
                              <option value="Manuel">Manuel</option>
                              <option value="Automatic">Automatic</option>
                              <option value="Semi-Automatic">Semi-Automatic</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2">
                        {/* Person Capacity */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Person Capacity</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="number"
                              name="capacity"
                              id="capacity"
                              min="1"
                              max="10"
                              placeholder={formData.capacity}
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                        {/* Bag Capacity */}
                        <div className="grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">Bag Capacity</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="number"
                              name="bagCapacity"
                              id="bagCapacity"
                              min="1"
                              max="10"
                              placeholder={formData.bagCapacity}
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 md:grid-cols-2 items-center">
                        {/* Passenger Airbag */}
                        <div className="col-span-3 grid grid-cols-5 md:col-span-1 md:grid-cols-5 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3">Passenger Airbag</div>
                          <input
                            type="checkbox"
                            className="col-span-2"
                            name="passengerAirbag"
                            id="passengerAirbag"
                            checked={formData.passengerAirbag}
                            onChange={checkHandler}
                          ></input>
                        </div>
                        {/* ABS Brake*/}
                        <div className="col-span-2 grid grid-cols-5 md:col-span-1 md:grid-cols-5 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3">ABS Brake</div>
                          <input
                            type="checkbox"
                            className="col-span-2"
                            name="brakeABS"
                            id="brakeABS"
                            checked={formData.brakeABS}
                            onChange={checkHandler}
                          ></input>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2">
                        {/* Rent Per Day*/}
                        <div className="grid grid-cols-12 items-center">
                          <div className="pl-4 pr-1 py-2 font-semibold col-span-6 ">
                            Rent Per Day
                          </div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-6 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="number"
                              name="rentPerDay"
                              id="rentPerDay"
                              min="1"
                              placeholder={formData.rentPerDay}
                              onChange={changeHandler}
                            />
                          </div>
                        </div>{' '}
                        {/* Monthly Cost*/}
                        <div className="grid grid-cols-12 items-center">
                          <div className="pl-4 pr-1 py-2 font-semibold col-span-6 ">
                            Monthly Expenses
                          </div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-6 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="number"
                              name="monthlyCost"
                              id="monthlyCost"
                              min="1"
                              placeholder={formData.monthlyCost}
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Driver Conditions */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
                        <div className="col-span-1 md:col-span-12 text-center font-semibold underline underline-offset-4 w-full text-red-700">
                          Driver Requirements
                        </div>
                        {/* Driver AGE */}
                        <div className="md:col-span-4 grid grid-cols-7 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 md:col-span-2 ">
                            Age
                          </div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 md:col-span-5 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="number"
                              name="driverAge"
                              id="driverAge"
                              min="20"
                              max="1000"
                              placeholder={formData.driverConditions.driverAge}
                              onChange={driverConditionChangeHandler}
                            />
                          </div>
                        </div>
                        {/* Driver License Age */}
                        <div className="md:col-span-5 grid grid-cols-7 md:grid-cols-6 items-center">
                          <div className="px-4 py-2 font-semibold col-span-3 ">License Age</div>
                          <div className="flex items-center border-2 px-3 rounded-2xl col-span-4 md:col-span-3 ">
                            <Icon className="text-gray-400" icon="bi:person-fill" width="20" />
                            <input
                              className="border-none focus:ring-0 max-h-[30px] w-full"
                              type="number"
                              name="driverLicense"
                              id="driverLicense"
                              min="2"
                              max="100"
                              placeholder={formData.driverConditions.driverLicense}
                              onChange={driverConditionChangeHandler}
                            />
                          </div>
                        </div>
                        {/* Driver Credit card */}
                        <div className="md:col-span-3 grid grid-cols-5 items-center">
                          <div className="grid grid-cols-5 col-span-5 items-center">
                            <div className="px-4 py-2 font-semibold col-span-2 md:col-span-4">
                              Credit Card
                            </div>
                            <input
                              type="checkbox"
                              className="col-span-1"
                              name="creditCard"
                              id="creditCard"
                              checked={formData.driverConditions.driverLicense}
                              onChange={driverConditionCheckHandler}
                            ></input>
                          </div>
                        </div>
                      </div>

                      {/* car picture */}
                      <div className="grid grid-cols-7 items-center">
                        <div className="pl-4 py-2 font-semibold col-span-2">Car Picture</div>
                        <div className="flex justify-center col-span-5 border p-2 rounded-lg">
                          <input
                            type="file"
                            name="carImage"
                            id="carImage"
                            onChange={imageUploadHandler}
                          />
                        </div>
                      </div>
                      {/* Add button */}
                      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          ADD
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
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
                    onClick={deleteCarByAdmin}
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
