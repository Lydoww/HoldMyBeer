import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalPortal = ({ children, onClose }: ModalPortalProps) => {
  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
      onClick={onClose}
    >
      {children}
    </div>,
    document.body,
  );
};

export default ModalPortal;
