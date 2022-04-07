import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../../../components/ui/Loader';

//comps
import AddNewCar from './carcomponents/AddNewCar';

//customCells
import ImageCell from './tablecustomcells/ImageCell';
import ActionCell from './tablecustomcells/ActionCell';

//table comps
import { Table, Pagination } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const AdminCarsPage = ({ history }) => {
  /***************************
   ****** COMP STATES *****
   ***************************/

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  /***************************
   ****** FETCH USERS *****
   ***************************/
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

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
      setLoading(true);

      try {
        const res = await axios.get(
          `/api/private/car/getcars?sort=desc&skip=${page}&limit=${limit}}`,
          config
        );
        setCars(res.data.data.cars);
        setTotalPage(res.data.data.total);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('authToken');
        history.push('/login');
        setLoading(false);
      }
    };

    fetchCategories();
  }, [history, page, limit]);

  return (
    <div className="w-full md:mx-1 ">
      <div className="bg-white p-3 shadow hover:shadow-md rounded-sm">
        {loading ? (
          <div className="flex justify-items-stretch">
            <Loader />
          </div>
        ) : (
          <>
            {cars ? (
              <>
                {' '}
                <div className="p-[20px] flex">
                  <AddNewCar />
                </div>
                <Table autoHeight data={cars} id="table">
                  <Column width={80} align="center">
                    <HeaderCell>Image</HeaderCell>
                    <ImageCell dataKey="image" />
                  </Column>
                  <Column width={160}>
                    <HeaderCell>Category Name</HeaderCell>
                    <Cell dataKey="name" />
                  </Column>{' '}
                  <Column width={160}>
                    <HeaderCell>Category Desc</HeaderCell>
                    <Cell dataKey="desc" />
                  </Column>
                  <Column width={200}>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell dataKey="_id" />
                  </Column>
                </Table>{' '}
                <div style={{ padding: 20 }}>
                  <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="xs"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={totalPage}
                    limitOptions={[15, 30]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                  />
                </div>
              </>
            ) : (
              <p> Loading</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCarsPage;
