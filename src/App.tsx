
import './App.css'
import Login from './pages/login/Login'
import { Routes, Route, Navigate } from 'react-router-dom';
import Privateroute from './privateroute';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function App() {
  const {access} = useSelector((state: RootState) => state.user)

  return (
    <>
      <Routes>
        <Route path='/login' element={access ? <Navigate to ='/homepage' /> : <Login />} />
        <Route path='/login/forgotpassword' element={<div>uh oh someone forgot their password</div>} />
        <Route path='/homepage' element={<Privateroute/>}>
          <Route path='/homepage' element={<div>lets go bro ur authenticated W IN CHAT</div>} />
        </Route>
        <Route path='*' element={access ? <Navigate to ='/homepage' /> : <Navigate to ='/login' />} />
      </Routes>
    </>
  )
}

export default App
