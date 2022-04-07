import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

//ui
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const Home = ({ history }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState([]);

  //getting newest 6 cars
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      history.push('/cars');
    }

    const fetchCars = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/private/car/new?new=true`);
        setCars(res.data.data);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('authToken');
        history.push('/login');
        setLoading(false);
      }
    };

    fetchCars();
  }, [history]);

  return (
    <>
      <div className="container min-h-screen my-2 mx-auto overflow-hidden">
        <div className="bg-emerald-50 mb-3">
          <div className="container mx-auto flex flex-col items-center py-12 sm:py-24">
            <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col  mb-5 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-gray-800 font-black leading-7 md:leading-10">
                The Freedom to Rent the
                <span className="text-emeralds-700"> Car </span>
                You Want
              </h1>
              <p className="mt-5 sm:mt-10 lg:w-10/12 text-gray-400 font-normal text-center text-sm sm:text-lg">
                Login to continue
              </p>
            </div>
            <div className="flex justify-center items-center">
              <Link
                to="/login"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 bg-emerald-700 transition duration-150 ease-in-out hover:bg-emerald-600 hover:no-underline text-white hover:text-white lg:text-xl lg:font-bold  rounded  px-4 sm:px-10 border border-emerald-700 py-2 sm:py-4 text-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars?.map((car) => (
            <Card key={car._id} car={car} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
