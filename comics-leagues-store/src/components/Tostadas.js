import { autocomplete } from '@nextui-org/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tostadas = {
  ToastSuccess: (message,autoClose=1250) => {
    toast.success(message, {
        pauseOnHover: false,
        autoClose: autoClose,
    });
  },

  ToastError: (message,autoClose=5000) => {
    toast.error(message, {
        pauseOnHover: false,
        autoClose:autoClose,
    });
  },

  ToastInfo: (message,autoClose=5000) => {
    toast.info(message, {
        pauseOnHover: false,
        autoClose: autoClose,
    });
  },

  ToastWarning: (message,autoClose=5000) => {
    toast.warning(message, {
        pauseOnHover: false,
        autoClose: autoClose,
    });
  }
};

export default Tostadas;
