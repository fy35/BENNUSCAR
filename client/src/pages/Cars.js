import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

//ui
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import DateSelector from '../components/ui/DateSelector';

//customization
import { Icon } from '@iconify/react';

const Cars = ({ history }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/');
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    const fetchCars = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/private/car/getcars`, config);
        setCars(res.data.data.cars);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('authToken');
        history.push('/login');
        setLoading(false);
      }
    };

    fetchCars();
  }, [history]);

  //set filtered cars

  useEffect(() => {
    setTotalCars(cars);
  }, [cars]);

  const [totalCars, setTotalCars] = useState([]);
  const setFilter = (values) => {
    var selectedFrom = moment(values[0]).format('MMM DD yyyy HH:mm');
    var selectedTo = moment(values[1]).format('MMM DD yyyy HH:mm');

    var filteredCars = [];

    for (var car of cars) {
      if (car.bookedTimeSlots.length === 0) {
        filteredCars.push(car);
      } else {
        for (var booking of car.bookedTimeSlots) {
          if (
            moment(selectedFrom).isBetween(booking.from, booking.to) ||
            moment(selectedTo).isBetween(booking.from, booking.to) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo) ||
            moment(booking.to).isBetween(selectedFrom, selectedTo)
          ) {
          } else {
            filteredCars.push(car);
          }
        }
      }
    }
    setTotalCars(filteredCars);
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

  return (
    <>
      <div className="container min-h-screen my-2 mx-auto overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <DateSelector onChange={setFilter} />
          </div>
        </div>
        {loading && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {totalCars?.map((car) => (
            <Card key={car._id} car={car} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Cars;
