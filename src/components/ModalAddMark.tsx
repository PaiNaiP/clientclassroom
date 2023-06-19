import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { API_URL } from '../http';
import checkFileAvailability from '../middleware/image';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { BsFillFileTextFill } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  complementary:any;
  task:any;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, complementary, task}) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
  const [checkFile, setCheckFile] = useState<any>()
  const [dateNow, setDateNow] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [mark, setMark] = useState<string>()
  const [files, setFiles] = useState<any>()
  const handleCheckFile = async()=>{
      const fileUrl = API_URL + 'images/'+complementary.member.user.file;
      const isFileAvailable = await checkFileAvailability(fileUrl);
      setCheckFile(isFileAvailable);
  } 
  useEffect(() => {
    setMark(complementary.mark)
    handleCheckFile()
    store.viewComplementaryOne(task.id, complementary.member.user_id).then((data)=>{
      setFiles(data?.data.file)
      setLoading(false)
    })
    const date = new Date()
    setDateNow(date.toISOString())
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (show) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleClose = () => {
    onClose();
  };

  const handleAddMark = () =>{
    if(Number(mark)>Number(task.point)){
      toast.error("Оценка больше максимальной", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    else{
      if(mark)
      store.addMarkComplementary(complementary.id, mark).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
  }

  return (
    <div className='group-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'300px', color:'black'}}>
            <ToastContainer />
            <div className="modal-header">
                <div 
                    style={{background:complementary.member.user.colorProfile, 
                    width:'50px', height:'50px', overflow:'hidden', 
                    borderRadius:'100%', marginRight:'10px', marginTop:'30px'}}>
                        {checkFile?(
                            <img src={API_URL + 'images/'+complementary.member.user.file} 
                            style={{objectFit:'cover', width:'52px'}}alt="" />
                        ):(
                            <div style={{textAlign:'center', fontWeight:'600', color:'white'}}>
                                <p style={{marginTop:'13px'}}>{complementary.member.user.email[0].toUpperCase()}</p>
                            </div>
                        )}
                    </div>
                    <h1 style={{width:'28.5%', fontSize:'18px'}}>{complementary.member.user.surname} {complementary.member.user.name} {complementary.member.user.lastname}</h1>
                    <button className="modal-close" onClick={handleClose} 
                    style={{marginTop:'2rem', marginLeft:'-30px'}}>
                        &times;
                    </button>
            </div>
            <div className="modal-body" style={{width:'80%', margin:'0 auto', overflowY:'hidden'}}>
                <div className="status" style={{display:'flex'}}>
                    {task.point !== 0&&(
                      <div className="mark" style={{display:'flex', height:'25px', width:'80%'}}>
                        <div style={{border:'1px solid #AEB5C8', width:'10%', textAlign:'center', borderRadius:'5px 0px 0 5px'}}>{task.point}</div>
                        <input max={task.point} onChange={(e)=>setMark(e.target.value)} type="number" style={{width:'10%', border:'1px solid #AEB5C8', borderRadius:'0px 5px 5px 0px'}} value={mark}/>
                      </div>
                    )}
                    <div style={{marginTop:'-18px'}}>
                        {dateNow>task.deadlineDatetime&&!complementary.status&&(
                            <p  style={{color:'#FA4F4F'}}>Пропущен срок сдачи</p>
                        )}
                        {dateNow>task.deadlineDatetime&&complementary.status&&(
                            <p>Сдано с опозданием</p>
                        )}
                        {dateNow<task.deadlineDatetime&&!complementary.status&&(
                            <p  style={{color:'#FA4F4F', marginLeft:'25px'}}>Не сдано</p>
                        )}
                        {dateNow<task.deadlineDatetime&&complementary.status&&(
                            <p style={{marginLeft:'10px'}}>Сдано</p>
                        )}
                    </div>
                </div>
                {loading?(
                  <Skeleton/>
                ):(
                  <div style={{width:'80%', margin:'0 auto', overflowY:'auto'}}>
                    {files.map((file:any)=>(
                        <div className='task-body__body__right__file__file' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
                        margin:'5px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding:'10px' }}>
                                <div>
                                    <BsFillFileTextFill style={{ fontSize: '24px' }} />
                                </div>
                                <a href={`${API_URL}files/${file[0].id}`}>{file[0].name}</a>
                            </div>
                        </div>
                        ))}
                  </div>
                )}
            </div>
            <div className="button-cont" style={{marginLeft:'24rem'}}>
                <button style={{background:'#9f9da3'}} onClick={handleClose}>Отмена</button>
                {task.point === 0?(
                  <button style={{background:'#335DFF'}} disabled>Вернуть</button>
                ):(
                  <button style={{background:'#335DFF'}} onClick={handleAddMark}>Вернуть</button>
                )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default observer(Modal);
