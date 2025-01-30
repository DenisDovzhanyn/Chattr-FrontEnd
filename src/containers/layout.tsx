import { useSelector, useDispatch } from 'react-redux'
import './Layout.css'
import { useEffect, useRef } from 'react'
import { RootState, AppDispatch } from '../store/store'
import { renewAccessAsync } from '../store/userSlice'

function Layout({children}: any) {
   

    return (<div id="layout">
        {children}
    </div>
    )
}

export default Layout