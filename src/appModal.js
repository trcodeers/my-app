
import Modal from '@mui/material/Modal';

 
export default function BasicModal(props) {

  const {src, open, handleClose} = props

  return (
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={{ position: 'absolute', top: '25%', left: '35%'}}>
            <img src={src} width='100%' height='100%' />
        </div>
      </Modal>
  );
}
