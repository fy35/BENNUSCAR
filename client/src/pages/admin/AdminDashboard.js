import { BrowserRouter, Switch, withRouter } from 'react-router-dom';
import AdminRoute from '../../components/routing/AdminRoute';

//components
import AdminDashboardLeft from './sidebar/AdminDashboardLeftSide';
import AdminHome from './pages/dashboard/AdminHome';
import AdminUsersPage from './pages/users/AdminUsersPage';
import AdminAnalyticsPage from './pages/analytics/AdminAnalyticsPage';
import AdminBookingsPage from './pages/bookings/AdminBookingsPage';
import AdminTypesPage from './pages/types/AdminTypesPage';
import AdminCategoryPage from './pages/categories/AdminCategoryPage';
import AdminCarsPage from './pages/cars/AdminCarsPage';

const AdminDashboard = () => {
  return (
    <BrowserRouter basename="/admindashboard">
      <div className="bg-gray-100 min-w-screen">
        <div className="container-fluid m-auto overflow-hidden">
          <div className="grid grid-rows-2 gap-2 my-2">
            <div className="md:flex no-wrap md:mx-1 rounded border p-2">
              {/* LEFT SIDE */}
              <AdminDashboardLeft />
              {/* RIGHT SIDE */}
              <Switch>
                <AdminRoute path={`/`} exact component={AdminHome}></AdminRoute>
                <AdminRoute path={`/users`} exact component={AdminUsersPage}></AdminRoute>
                <AdminRoute path={`/analytics`} exact component={AdminAnalyticsPage}></AdminRoute>
                <AdminRoute path={`/bookings`} exact component={AdminBookingsPage}></AdminRoute>
                <AdminRoute path={`/types`} exact component={AdminTypesPage}></AdminRoute>
                <AdminRoute path={`/categories`} exact component={AdminCategoryPage}></AdminRoute>
                <AdminRoute path={`/cars`} exact component={AdminCarsPage}></AdminRoute>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default withRouter(AdminDashboard);
