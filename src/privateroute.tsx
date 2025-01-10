
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { RootState } from './store/store';

export default ()  => {
    const {jwt} = useSelector((state: RootState) => state.user);

    return jwt ? <Outlet/> : <Navigate to='/login' />
}

