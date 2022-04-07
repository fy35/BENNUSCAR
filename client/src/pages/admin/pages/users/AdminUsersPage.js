import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../../../components/ui/Loader';

//customCells
import NameCell from './tablecustomcells/NameCell';
import ImageCell from './tablecustomcells/ImageCell';
import CheckCell from './tablecustomcells/CheckCell';
import ActionCell from './tablecustomcells/ActionCell';

//table comps
import { Table, Pagination, Checkbox } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const AdminUsersPage = ({ history }) => {
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchUsers = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      setLoading(true);

      try {
        const res = await axios.get(
          `/api/private/admin/users?sort=desc&skip=${page}&limit=${limit}}`,
          config
        );
        setUsers(res.data.data.users);
        setTotalPage(res.data.data.total);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('authToken');
        history.push('/login');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [history, page, limit]);

  //check handle
  const [checkedKeys, setCheckedKeys] = useState([]);
  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === users?.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < users?.length) {
    indeterminate = true;
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? users.map((item) => item._id) : [];
    setCheckedKeys(keys);
  };

  const handleCheck = (value, checked) => {
    const keys = checked ? [...checkedKeys, value] : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
  };

  return (
    <div className="w-full md:mx-1 ">
      <div className="bg-white p-3 shadow hover:shadow-md rounded-sm">
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {users ? (
              <>
                <Table autoHeight data={users} id="table">
                  <Column width={50} align="center">
                    <HeaderCell style={{ padding: 0 }}>
                      <div style={{ lineHeight: '40px' }}>
                        <Checkbox
                          inline
                          checked={checked}
                          indeterminate={indeterminate}
                          onChange={handleCheckAll}
                        />
                      </div>
                    </HeaderCell>
                    <CheckCell dataKey="_id" checkedKeys={checkedKeys} onChange={handleCheck} />
                  </Column>
                  <Column width={80} align="center">
                    <HeaderCell>Picture</HeaderCell>
                    <ImageCell dataKey="image" />
                  </Column>

                  <Column width={160}>
                    <HeaderCell>First Name</HeaderCell>
                    <NameCell dataKey="fullname" />
                  </Column>
                  <Column width={160}>
                    <HeaderCell>Username</HeaderCell>
                    <Cell dataKey="username" />
                  </Column>
                  <Column width={220}>
                    <HeaderCell>Email</HeaderCell>
                    <Cell>
                      {(rowData) => <a href={`mailto:${rowData.email}`}>{rowData.email}</a>}
                    </Cell>
                  </Column>
                  <Column width={220}>
                    <HeaderCell>Address</HeaderCell>
                    <Cell dataKey="address" />
                  </Column>
                  <Column width={220}>
                    <HeaderCell>Bio</HeaderCell>
                    <Cell dataKey="bio" />
                  </Column>

                  <Column width={100}>
                    <HeaderCell>Role </HeaderCell>
                    <Cell dataKey="role"></Cell>
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

export default AdminUsersPage;
