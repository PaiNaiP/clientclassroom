import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  titleGroup: string;
  idGroup:string;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, titleGroup, idGroup }) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState<string>()
  const [id, setId] = useState<string>()

  useEffect(() => {
    setTitle(titleGroup)
    setId(idGroup)
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

  const handleCreateClass=async()=>{
    if(id){
      if(title)
      store.editGroupe(title, id).then((data)=>{
        if(data)
          window.location.reload()
      })
    }else{
      if(title)
      store.createGroupe(title, store.user.id).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
  }
  return (
    <div className='group-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'300px'}}>
            <div className="modal-header">
              <div style={{width:'82%'}}>
              {id&&(
                <h1 style={{width:'100%'}}>Изменить группу</h1>
              )}
              {!id&&(
                <h1 style={{width:'100%'}}>Создать группу</h1>
              )}
              </div>
                <button className="modal-close" onClick={handleClose} style={{marginTop:'2.4rem'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <div className="continput">
                    <p>Название группы:</p>
                    <input type="text" placeholder='Название' className='inputlog' autoComplete='false'
                    value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
            </div>
            <div className="button-cont" style={{marginLeft:'23rem'}}>
                <button style={{background:'#9f9da3'}} onClick={handleClose}>Отмена</button>
                <button style={{background:'#335DFF'}} onClick={handleCreateClass}>Сохранить</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default observer(Modal);
