
import './App.css'
import Login from './login/Login'
import { Routes, Route, Navigate } from 'react-router-dom';
import Privateroute from './privateroute';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function App() {
  const {jwt} = useSelector((state: RootState) => state.user)

  return (
    <>
      <Routes>
        <Route path='/login' element={jwt ? <Navigate to ='./homepage' /> : <Login />} />
        <Route path='/homepage' element={<Privateroute/>}>
          <Route path='/homepage' element={<div>lets go bro ur authenticated W IN CHAT</div>} />
        </Route>
        <Route path='*' element={<div>ERROR 404: PAGE NOT FOUND</div>} />
      </Routes>
    </>
  )
}

export default App
