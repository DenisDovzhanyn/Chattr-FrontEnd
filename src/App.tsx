
import './App.css'
import Login from './containers/login/Login'
import { Routes, Route } from 'react-router-dom';
import Privateroute from './privateroute';
import { useDispatch } from 'react-redux';
import { loadSessionAsync, renewAccessAsync } from './store/userSlice';
import { AppDispatch } from './store/store';
import { useEffect } from 'react';


function App() {
 
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    dispatch(loadSessionAsync())
    window.addEventListener('renewAccess', async ({detail}: CustomEventInit) => {
      const token = await dispatch(renewAccessAsync())
      await detail.onFinish(token)
    })
  }, [])

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/login/forgotpassword' element={<div>uh oh someone forgot their password</div>} />
        <Route path='/homepage' element={<Privateroute/>}>
          <Route path='/homepage' element={<div>a</div>} />
        </Route>
        <Route path='*' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
