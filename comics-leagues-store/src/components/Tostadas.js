import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tostadas = {
  ToastSuccess: (message) => {
    toast.success(message, {
      autoClose: 1250,
    });
  },

  ToastError: (message) => {
    toast.error(message, {
    });
  },

  ToastInfo: (message) => {
    toast.info(message, {
    });
  },

  ToastWarning: (message) => {
    toast.warning(message, {
    });
  }
};

export default Tostadas;
