import toast from 'react-hot-toast';
export const notify = (msg, t = 'success') =>
  t === 'error' ? toast.error(msg) : toast.success(msg);
