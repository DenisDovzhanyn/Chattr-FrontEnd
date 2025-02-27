
import './App.css'
import Login from './containers/login/Login'
import ChatLayout from './containers/chatLayout/chatLayout';
import { Routes, Route } from 'react-router-dom';
import Privateroute from './privateroute';
import { useDispatch } from 'react-redux';
import { loadSessionAsync, renewAccessAsync } from './store/userSlice';
import { AppDispatch } from './store/store';
import { useEffect } from 'react';
import { updateCurrTime } from './store/appSlice';

function App() {
  
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    dispatch(loadSessionAsync())
    window.addEventListener('renewAccess', async ({detail}: CustomEventInit) => {
      const token = await dispatch(renewAccessAsync())
      await detail.onFinish(token)
    })

    let interval = setInterval(() => {
      dispatch(updateCurrTime(Date.now()))
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/login/forgotpassword' element={<div>uh oh someone forgot their password</div>} />
        <Route path='/homepage' element={<Privateroute/>}>
          <Route path='/homepage' element={<ChatLayout />} />
        </Route>
        <Route path='*' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
