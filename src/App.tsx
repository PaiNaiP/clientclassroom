import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Registration from './pages/Registration';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Home from './pages/Home';
import { observer } from 'mobx-react-lite';
import Account from './pages/Account';
import Classroom from './pages/Classroom';
import Task from './pages/Task';
import Archive from './pages/Archive';
import MailPage from './pages/MailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signin" element={<Login/>}/>
      <Route path="/signup" element={<Registration/>}/>
      <Route path="/resetpassword" element={<ResetPassword/>}/>
      <Route path="/changepassword/:id" element={<ChangePassword/>}/>
      <Route path="/account" element={<Account/>}/>
      <Route path="/c/:id" element={<Classroom/>}/>
      <Route path="/t/:id" element={<Task/>}/>
      <Route path="/m/:id" element={<MailPage/>}/>
      <Route path="/archive" element={<Archive/>}/>
    </Routes>
  );
}

export default observer(App);
