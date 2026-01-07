import { useCallback } from 'react';

const useNotification = () => {
  const showNotification = useCallback((message, type) => {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
      color: var(--white);
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      animation: slideInAndOut 3.5s ease-in-out forwards;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.parentNode && notification.parentNode.removeChild(notification), 3500);
  }, []);
  return showNotification;
};

export default useNotification;