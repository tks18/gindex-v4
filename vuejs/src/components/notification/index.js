
import { Notification } from "element-ui";

const notify = ({ title, message, type, duration }) => {
Notification({
  title: title,
  message: message,
  type: type,
  duration: duration ? duration : 2500,
});
};

export default notify;
