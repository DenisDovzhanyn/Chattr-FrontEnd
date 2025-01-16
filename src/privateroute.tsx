
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { RootState } from './store/store';

export default ()  => {
    const {access} = useSelector((state: RootState) => state.user);

    return access ? <Outlet/> : <Navigate to='/login' />
}

