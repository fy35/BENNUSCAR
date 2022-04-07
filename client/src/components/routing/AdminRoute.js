import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Redirect, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  const allowed = useRef(false);
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchPrivateData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const res = await axios.get('/api/private/admin', config);
        allowed.current = res.data.success;
      } catch (error) {
        allowed.current = false;
        localStorage.removeItem('authToken');
        history.push('/login');
      }
    };

    fetchPrivateData();
  }, [history]);

  return (
    <Route
      {...rest}
      render={(props) => (allowed ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default AdminRoute;
