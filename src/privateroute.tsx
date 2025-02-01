
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import Layout from './containers/layout/Layout';
import ChatList from './containers/chatlist/ChatList';
import { useEffect, useRef } from 'react';
import { renewAccessAsync } from './store/userSlice';

export default ()  => {
    const {access, access_exp, isLoading} = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
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


    if (isLoading) return
    if (!access) return <Navigate to='/login' />

    return (
        <Layout>
            <ChatList />
            <Outlet/>
        </Layout>
    )
}

