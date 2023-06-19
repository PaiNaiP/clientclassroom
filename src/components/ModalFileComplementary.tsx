/* eslint-disable array-callback-return */
import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { PropagateLoader } from 'react-spinners';
type ModalProps = {
  show: boolean;
  onClose: () => void;
  id:string;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, id }) => {
    const {store} = useContext(Context)
    const [loading, setLoading] = useState<boolean>(true)
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<any>([]);
    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files as FileList;
      setSelectedFile((prev: File[]) => {
          for (let i = 0; i < selectedFiles?.length; i++) {
          prev.push(selectedFiles[i])
          }
          return [...prev]; 
      })
    };

    useEffect(() => {
        
        setLoading(false)
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
    const addFile = () =>{
      if(selectedFile.length!==0){
        store.addFiles(selectedFile,id).then((data)=>{
          if(data)
            window.location.reload()
        })
      }
    }
      addFile()
  return (
    <div className='task-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{position:'static'}}>
            <div className="modal-header">
                <h1 style={{color:'black'}}>Добавить файл</h1>
                <button className="modal-close" onClick={handleClose} style={{marginTop:'0.5rem', marginLeft:'-60px'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', marginTop: '-20px', overflow: 'auto' }}>
                {loading ? (
                    <div style={{ width: '100%', paddingTop: '10rem', paddingBottom: '20rem' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ margin: '0 auto', marginTop: '5rem', textAlign: 'center' }}>
                        <PropagateLoader color="#335DFF" style={{ marginLeft: '-15px' }} />
                        </div>
                    </div>
                    </div>
                ) : (
                    <>
                    <div className="continput" style={{marginTop:'16%', marginBottom:'17%'}}>
                        <div className="add-photo" style={{width:'100%', height:'140px'}}>
                        <div className="file-input" style={{marginTop:'10px'}}>
                            <label htmlFor="file-input" style={{width:'30px', height:'30px'}}>
                            <AiOutlinePlus style={{fontSize:'18px', paddingBottom:'2px'}}/>
                            </label>
                            <input
                            ref={fileInputRef}
                            id="file-input"
                            type="file"
                            onChange={handleFileSelected}
                            accept='*'
                            multiple
                            />
                        </div>
                        </div>
                        </div>
                        <div className="btn-cnt" style={{marginRight:'45px'}}>
                            <button className='cancel' onClick={handleClose}>Отменить</button>
                        </div>
                    </>
                )}
            </div>
            </div>
        </div>
    </div>
  );
};

export default observer(Modal);
