import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { PropagateLoader } from 'react-spinners';
import { FreeUserMap } from './FreeUserMap';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  id:string;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, id }) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [users, setUsers] = useState<any>()
    const [searchValue, setSearchValue] = useState('');
    const [usersOld, setUsersOld] = useState<any>();
  useEffect(() => {
    store.viewFreeUsersInGroup(id).then((data)=>{
        if(data?.data){    
            setUsers(data?.data)
            setUsersOld(data?.data)
        }        
        setLoading(false)
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

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const filteredUsers = users.filter((user: { [s: string]: unknown; } | ArrayLike<unknown>) =>
        // eslint-disable-next-line array-callback-return
        Object.values(user).some((field:any) =>
            field.toString().toLowerCase().includes(value.toLowerCase())
        )
    );
    if(value==="")
        setUsers(usersOld)
    else
    setUsers(filteredUsers);
};

  return (
    <div className='group-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'470px'}}>
            <div className="modal-header" style={{marginTop:'0px'}}>
                <h1 style={{fontSize:'28px', width:'12rem'}}>Участники</h1>
                <button className="modal-close" onClick={handleClose} style={{marginTop:'0.8rem'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
              <div className="modal-body-cont" style={{margin:'0 auto', height:'19rem', display:'flex'}}>
                {loading&&(
                    <div style={{margin:'0 auto', marginTop:'8rem'}}>
                      <PropagateLoader 
                      color="#335DFF" 
                      style={{marginLeft:'-5px'}} 
                      className='loaderone'
                      />
                  </div>
                )}
                {!loading&&(
                    <div>
                    {users.length===0?(
                      <div style={{width:'30rem'}} className="continput">
                          <p style={{marginLeft:'-7px'}}>Поиск:</p>
                          <input type="text" style={{marginLeft:'-7px'}}  
                          placeholder='&#x1F50E;&#xFE0E;' 
                          className='inputlog' 
                          autoComplete='false'
                          value={searchValue}
                          onChange={handleInputChange}/>
                      </div>
                    ):users&&(
                      <div className="continput">
                          <p>Поиск:</p>
                          <input type="text" 
                          placeholder='&#x1F50E;&#xFE0E;' 
                          className='inputlog' 
                          autoComplete='false'
                          value={searchValue}
                          onChange={handleInputChange}/>
                      </div>
                    )}
                    <div className="freeusers-cont">
                      <FreeUserMap users={users} group={id} cross={false}/>
                    </div>
                    </div>
                )}
              </div>
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
