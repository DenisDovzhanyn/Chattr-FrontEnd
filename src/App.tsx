
import './App.css'
import Login from './pages/login/Login'
import { Routes, Route, Navigate } from 'react-router-dom';
import Privateroute from './privateroute';
import { useSelector, useDispatch } from 'react-redux';
import { loadSessionAsync, renewAccessAsync } from './store/userSlice';
import { AppDispatch, RootState } from './store/store';
import { useEffect, useRef } from 'react';


function App() {
  const {access, access_exp} = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(loadSessionAsync())
  }, [])

  const timeout = useRef(0)
  useEffect(() => {
    if (access && access_exp) {
      const timeLeft = (access_exp * 1000) - (1 * 60 * 1000) - Date.now()
      if(timeout.current) clearTimeout(timeout.current)
      console.log('hello gangy, a new timeout has been set for ' + timeLeft)
      if (timeLeft > 0) {
        timeout.current = setTimeout(() => dispatch(renewAccessAsync()), timeLeft)
      }
    }

    return () => clearTimeout(timeout.current);
  },[access_exp])

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
