import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import {IoIosClose} from 'react-icons/io'
import { Context } from '..';
import { FileUploader } from "react-drag-drop-files";
type ModalProps = {
  show: boolean;
  onClose: () => void;
  classid:any;
};
const fileTypes = ["JPG", "PNG", "GIF"];

const Modal: React.FC<ModalProps> = ({ show, onClose, classid }) => {
  const {store} = useContext(Context)
  const [selectedFile, setSelectedFile] = useState<any>()
  const modalRef = useRef<HTMLDivElement>(null);
  const handleChange = (file: React.SetStateAction<null>) => {
    if (file) {
      setSelectedFile(file);
    }
  };
  useEffect(() => {
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
  }, [show, onClose]);

  const handleClose = () => {
    onClose();
  };

  const handleAddAvatar = () =>{
    if(classid){
      store.editCover(classid, selectedFile).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
    else{
      store.editAva(store.user.email, selectedFile).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
  }

  return (
    <div className='modalimage'>
      {show && (
        <div className="modal-backdrop">
          <div className="modal" ref={modalRef} style={{position:'relative', height:'25rem'}}>
            <div className="modal-header">
              <h1 style={{color:'black'}}>Изменение фотографии</h1>
              <button className="modal-close" onClick={handleClose}>
                <IoIosClose/>
              </button>
            </div>
            <div className="modal-body" style={{margin:'0 auto'}}>
              <div className="file-upld" style={{margin:'0 auto', marginBottom:'60px'}}>
              <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
              </div>
            </div>
            <div className="btn-cnt" style={{position:'absolute', right:0}}>
              <button className='cancel' onClick={handleClose}>Отменить</button>
              <button className='save' onClick={handleAddAvatar}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;