import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// ui
import Loader from '../../../../components/ui/Loader';

//customization
import SortDownIcon from '@rsuite/icons/SortDown';
import SortUpIcon from '@rsuite/icons/SortUp';
import ConversionIcon from '@rsuite/icons/Conversion';

const AdminHomeTop = () => {
  const [income, setIncome] = useState([]);
  const [costs, setCosts] = useState([]);
  const [percRevanue, setPercRevanue] = useState(0);
  const [percDays, setPercDays] = useState(0);
  const [percCosts, setPercCosts] = useState(0);
  const [loading, setLoading] = useState(0);

  const MONTHS = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
    []
  );

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    const getIncome = async () => {
      try {
        const res = await axios.get(`/api/private/admin/userstats/tbbly?after=sixty`, config);

        res.data.data.map((item) =>
          setIncome((prev) => [
            ...prev,
            {
              name: MONTHS[item._id - 1],
              totalBookings: item.total,
              totalDays: item.totalDays,
              totalAmount: item.totalAmount,
            },
          ])
        );

        setPercRevanue((res.data.data[1].totalAmount * 100) / res.data.data[0].totalAmount - 100);
        setPercDays((res.data.data[1].totalDays * 100) / res.data.data[0].totalDays - 100);
      } catch (error) {}
    };

    getIncome();
  }, [MONTHS]);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    const date = new Date().getMonth();

    setLoading(true);
    const getCosts = async () => {
      try {
        const res = await axios.get(`/api/private/admin/userstats/coec`, config);

        res.data.data.map((item) =>
          setCosts((prev) => [
            ...prev,
            {
              name: MONTHS[item.month - 1],
              monthly: item.count,
              cumulative: item.cumulative,
            },
          ])
        );
        setPercCosts(
          (res.data.data[date - 1].cumulative * 100) / res.data.data[date - 2].cumulative - 100
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getCosts();
  }, [MONTHS]);

  return (
    <>
      {loading ? (
        <div className="md:col-span-7 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* first */}
          <div className="flex w-8/12 flex-col p-5 items-start gap-3 border shadow-md hover:shadow-lg rounded">
            <span className="tracking-wide text-2xl font-semibold">Revanue</span>
            <div className="flex items-center gap-5">
              <span className="tracking-wide font-bold text-3xl">{income[1]?.totalAmount} TL</span>
              <span className="tracking-wide flex items-center text-lg gap-1">
                {Math.floor(percRevanue * 100) / 100} %
                {percRevanue < 0 && <SortDownIcon color="red" />}
                {percRevanue > 0 && <SortUpIcon color="green" />}
                {percRevanue === 0 && <ConversionIcon color="gray" />}
              </span>
            </div>
            <span className="tracking-wide font-medium text-gray-300">
              Compared {income[1]?.name} to {income[0]?.name}
            </span>
          </div>
          {/* second */}
          <div className="flex w-8/12 flex-col  p-5 items-start gap-3 border shadow-md hover:shadow-lg rounded">
            <span className="tracking-wide text-2xl font-semibold">Total Busy Days</span>
            <div className="flex items-center gap-5">
              <span className="tracking-wide font-bold text-3xl">{income[1]?.totalDays} Days</span>
              <span className="tracking-wide flex items-center text-lg gap-1">
                {Math.floor(percDays * 100) / 100} %
                {percDays < 0 ? <SortDownIcon color="red" /> : <SortUpIcon color="green" />}
              </span>
            </div>
            <span className="tracking-wide font-medium text-gray-300">
              Compared {income[1]?.name} to {income[0]?.name}
            </span>
          </div>
          {/* third */}
          <div className="flex w-8/12 flex-col  p-5 items-start gap-3 border shadow-md hover:shadow-lg rounded">
            <span className="tracking-wide text-2xl font-semibold">Cost</span>
            <div className="flex items-center gap-5">
              <span className="tracking-wide font-bold text-3xl">
                {costs[new Date().getMonth() - 2]?.cumulative}TL
              </span>
              <span className="tracking-wide flex items-center text-lg gap-2">
                {Math.floor(percCosts * 100) / 100} %{' '}
                {percCosts < 0 && <SortDownIcon color="red" />}
                {percCosts > 0 && <SortUpIcon color="green" />}
                {percCosts === 0 && <ConversionIcon color="gray" />}
              </span>
            </div>
            <span className="tracking-wide font-medium text-gray-300">
              {' '}
              Compared {costs[new Date().getMonth() - 1]?.name} to{' '}
              {costs[new Date().getMonth() - 2]?.name}
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default AdminHomeTop;
