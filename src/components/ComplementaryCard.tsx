import React, { useState } from 'react'
import { API_URL } from '../http';
import checkFileAvailability from '../middleware/image';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ModalAddMark from './ModalAddMark';

export const ComplementaryCard = (complementary:any) => {
    const [checkFile, setCheckFile] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [openModal, setOpenModal] = useState(false)

    const handleCheckFile = async()=>{
        const fileUrl = API_URL + 'images/'+complementary.complementary.member.user.file;
        const isFileAvailable = await checkFileAvailability(fileUrl);
        setCheckFile(isFileAvailable);
    } 
    setTimeout(() => {
        handleCheckFile()
        setLoading(false)
    }, 1000);
    const handleCloseModal = () => {
        setOpenModal(false);
    }
  return (
    <>
    <tr onClick={()=>setOpenModal(true)}>
        <td>
            {loading?(
                <Skeleton/>
            ):(
                <div className="task-work__body__account">
                    <div className="task-work__body__account__image"
                    style={{background:complementary.complementary.member.user.colorProfile}}>
                        {checkFile?(
                            <img src={API_URL + 'images/'+complementary.complementary.member.user.file} 
                            style={{objectFit:'cover', width:'60px'}}alt="" />
                        ):(
                            <div>
                                <p style={{marginTop:'13px'}}>{complementary.complementary.member.user.email[0].toUpperCase()}</p>
                            </div>
                        )}
                    </div>
                    <div className="task-work__body__account__info">
                        <div className="task-work__body__account__info__fio">
                            <p>{complementary.complementary.member.user.surname} {complementary.complementary.member.user.name} {complementary.complementary.member.user.lastname}</p>
                        </div>
                        <div className="task-work__body__account__info__email">
                            <p>{complementary.complementary.member.user.email}</p>
                        </div>
                    </div>
                </div>
            )}
        </td>
        <td>
            {loading?(
                <Skeleton/>
            ):(
                <div className="task-work__body__mark">
                    {complementary.complementary.mark?(
                        <p style={{color:"#82BF5C", marginTop:'5px'}}>{complementary.task.point} / {complementary.complementary.mark}</p>
                    ):(
                        <div className='task-work__body__mark__status'>
                        {complementary.complementary.status?(
                            <p>Сдано</p>
                        ):(
                            <p style={{color:'#FA4F4F'}}>Не сдано</p>
                        )}
                        </div>
                    )}
                </div>
            )}
        </td>
    </tr>
    {openModal&&(
        <ModalAddMark show={openModal} onClose={handleCloseModal} complementary={complementary.complementary} task={complementary.task}/>
    )}
    </>
  )
}
