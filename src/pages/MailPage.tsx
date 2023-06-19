import React, { useContext, useEffect, useState } from 'react'
import HeaderHome from '../components/HeaderHome'
import { observer } from 'mobx-react-lite'
import '../style/Mail.scss'
import { Footer } from '../components/Footer'
import MailComponent from '../components/MailComponent'
import { PacmanLoader } from 'react-spinners'
import { Context } from '..'

const MailPage = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const {store} = useContext(Context)
    useEffect(() => {
        store.checkAuth().then(()=>{
            setLoading(false)
        })
    }, [store])
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
    <div className="mail">
        <HeaderHome/>
        <MailComponent/>
        <Footer/>
    </div>
  )
}
export default observer(MailPage)