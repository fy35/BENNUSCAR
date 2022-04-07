import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//routing
import UserRoute from './components/routing/UserRoute';
import AdminRoute from './components/routing/AdminRoute';

//pages
import Home from './pages/Home';
import Cars from './pages/Cars';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages//booking/Booking';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserSettings from './pages/user/UserSettings';

//components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/cars" exact component={Cars} />
        <Route path="/login" exact component={Login} />
        <Route path="/forgotpassword" exact component={ForgotPassword} />
        <Route path="/resetpassword/:resetToken" exact component={ResetPassword} />
        <Route path="/register" exact component={Register} />
        <Route path="/booking/:carId" exact component={Booking} />
        <Route path="/contact" exact component={Contact} />

        <UserRoute path="/userdashboard" exact component={UserDashboard} />
        <UserRoute path="/userdashboard/settings" exact component={UserSettings} />

        <AdminRoute path="/admindashboard" component={AdminDashboard} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
