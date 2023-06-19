import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { BsPlus } from 'react-icons/bs';
import { PropagateLoader } from 'react-spinners';
import ModalAddUserToGroup from './ModalAddUserToGroup';
import { FreeUsersGroupMap } from './FreeUsersGroupMap';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  id:string;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, id }) => {
    const [openModalGroup, setOpenModalGroup] = useState(false)
    const {store} = useContext(Context)
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [users, setUsers] = useState<any>()
  useEffect(() => {
    store.viewUsersInGroup(id).then((data)=>{
        if(data?.data){    
            setUsers(data.data)
            setLoading(false)
        }        
    })
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

  const handleCloseModalGroup = () => {
    setOpenModalGroup(false);
}

  const handleClose = () => {
    onClose();
  };

  const handleRemoveUser = () => {    
    store.viewUsersInGroup(id).then((user)=>{
      if(user?.data)
        setUsers(user?.data)
    })
};
  return (
    <div className='group-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'470px'}}>
            <div className="modal-header" style={{marginTop:'-30px', marginLeft:'10px'}}>
                <h1>Участники</h1>
                <button className="modal-close" onClick={handleClose} style={{marginTop:'2.3rem'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body" style={{overflowX:'hidden'}}>
                <div className="model-body-cont" style={{height:'18rem', marginLeft:'10px', width:'100%', display:'flex'}}>
                <div>
                <BsPlus style={{paddingLeft:'3rem', fontSize:'30px', color:'#335DFF'}} 
                className='btn-add-user'
                onClick={()=>setOpenModalGroup(true)}/>
                </div>
                {loading&&(
                    <div style={{margin:'0 auto', marginTop:'8rem'}}>
                        <PropagateLoader 
                        color="#335DFF" 
                        style={{marginLeft:'-60px'}}
                        className='loader'
                        />
                    </div>
                )}
                {!loading&&(
                    <div style={{marginTop:'20px'}}>
                    {!users&&(
                    <div style={{margin:'0 auto', textAlign:'center'}}>
                        <h1 >Ни одного пользователя в группе</h1>
                        <img style={{width:'15rem'}}
                        src="https://cdn.dribbble.com/userupload/5389624/file/original-f271ff07d00d9b9e526c261921927cae.jpg?compress=1&resize=1024x1050" 
                        alt="not found" />
                    </div>
                    )}
                    {users&&(
                      <div style={{marginLeft:'-75px'}}>
                        <FreeUsersGroupMap users={users} group={id} onRemoveUser={handleRemoveUser} cross={true}/>
                      </div>
                    )}
                    </div>
                )}
                </div>
                {openModalGroup&&(
                    <ModalAddUserToGroup show={openModalGroup} onClose={handleCloseModalGroup} id={id}/>
                )}
            </div>
            <div className="button-cont">
                <button style={{background:'#9f9da3', marginLeft:'8rem'}} onClick={handleClose}>Отмена</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default observer(Modal);
