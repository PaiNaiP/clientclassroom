import { observer } from 'mobx-react-lite'
import React, {useState, useEffect, useContext} from 'react'
import HeaderHome from '../components/HeaderHome'
import { Footer } from '../components/Footer'
import '../style/Home.scss'
import PacmanLoader from "react-spinners/PacmanLoader";
import { Context } from '..'
import '../style/Dropdown.scss'
import { HeaderHomeNoneAuth } from '../components/HeaderHomeNoneAuth'
import { AuthError } from '../components/AuthError'
import ArchiveHome from '../components/ArchiveHome'
const Archive = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const {store} = useContext(Context)

    useEffect(() => {
        store.checkAuth().then(()=>{
            setLoading(false)
        })
    })
    if(loading){
        return(
            <div style={{display:'flex'}}>
                <div style={{margin:'0 auto', marginTop:'22%'}}>
                    <PacmanLoader color="#335DFF" />
                </div>
            </div>
        )
    }
  return (
    <div className="home">
        <div className="header-cont">
            {store.isAuth&&(
                <HeaderHome />
            )}
            {!store.isAuth&&(
                <HeaderHomeNoneAuth/>
            )}
        </div>
        <div className="content">
            {store.isAuth&&(
                <ArchiveHome/>
            )}
            {!store.isAuth&&(
                <AuthError/>
            )}
        </div>
        <div className="footer">
            <Footer/>
        </div>
    </div>
  )
}
export default observer(Archive)