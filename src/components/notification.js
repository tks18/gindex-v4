import { Notification } from 'element-ui';

const notify = ({ title, message, type, duration }) => {
  Notification({
    title,
    message,
    type,
    duration: duration || 2500,
  });
};

export default notify;
