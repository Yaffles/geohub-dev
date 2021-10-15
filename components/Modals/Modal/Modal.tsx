import { FC, ReactNode } from 'react'
import { StyledModal } from '.'
import ReactDOM from 'react-dom'

type Props = {
  closeModal: () => void
  children: ReactNode
}

const Modal: FC<Props> = ({ closeModal, children }) => {
  return ReactDOM.createPortal(
    <StyledModal>
    <div className="layerContainer">
      <div className="modal">
        <div className="modalBody">
         { children }
        </div>
      </div>
      <div className="backdrop" onClick={() => closeModal()} />
    </div>
  </StyledModal>, 
  document.getElementById('__next') as HTMLElement
  )
}

export default Modal