import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tostadas = {
  ToastSuccess: (message) => {
    toast.success(message, {
        pauseOnHover: false,
        autoClose: 1250,
    });
  },

  ToastError: (message) => {
    toast.error(message, {
        pauseOnHover: false,
    });
  },

  ToastInfo: (message) => {
    toast.info(message, {
        pauseOnHover: false,
        
    });
  },

  ToastWarning: (message) => {
    toast.warning(message, {
        pauseOnHover: false,
    });
  }
};

export default Tostadas;
