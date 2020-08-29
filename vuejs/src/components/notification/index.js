
import { Notification } from "element-ui";

const notify = ({ title, message, type, duration }) => {
Notification({
  title: title,
  message: message,
  type: type,
  duration: duration,
});
};

export default notify;
