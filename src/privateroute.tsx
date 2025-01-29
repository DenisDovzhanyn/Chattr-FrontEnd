
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { RootState } from './store/store';
import Layout from './containers/layout';
import ChatList from './containers/ChatList';

export default ()  => {
    const {access} = useSelector((state: RootState) => state.user);

    if (!access) return <Navigate to='/login' />

    return (
        <Layout>
            <ChatList />
            <Outlet/>
        </Layout>
    )
}

