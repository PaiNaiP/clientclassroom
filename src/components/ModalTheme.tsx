import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  theme:any;
  course:any;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, theme, course}) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState<string>()

  useEffect(() => {
    setTitle(theme.title)
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

  const handleCreateTheme=async()=>{
    if(!theme){
      if(title)
      store.createTheme(title, course).then((data)=>{
        if(data)
          window.location.reload()
      })
    }else{
      if(title)
      store.updateTheme(theme.id, title).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
  }

  return (
    <div className='group-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'300px', color:'black'}}>
            <div className="modal-header">
              {theme&&(
                <>
                  <h1 style={{width:'38%'}}>Изменить тему</h1>
                  <button className="modal-close" onClick={handleClose} 
                  style={{marginTop:'2rem', marginLeft:'-30px'}}>
                    &times;
                  </button>
                </>
              )}
              {!theme&&(
                <>
                  <h1>Создать тему</h1>
                  <button className="modal-close" onClick={handleClose} style={{marginTop:'0.8rem'}}>
                      &times;
                  </button>
                </>
              )}
            </div>
            <div className="modal-body">
                <div className="continput">
                    <p>Название темы:</p>
                    <input type="text" placeholder='Название' className='inputlog' autoComplete='false'
                    value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
            </div>
            <div className="button-cont" style={{marginLeft:'23rem'}}>
                <button style={{background:'#9f9da3'}} onClick={handleClose}>Отмена</button>
                <button style={{background:'#335DFF'}} onClick={handleCreateTheme}>Сохранить</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default observer(Modal);
