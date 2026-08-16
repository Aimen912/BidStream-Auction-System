import AppRoutes from './routes/AppRoutes';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import ToastContainer from './components/shared/NotificationToast';

// Inner component so it can access NotificationContext
function AppInner() {
  const { toasts, dismissToast } = useNotifications();
  return (
    <>
      <AppRoutes />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

function App() {
  return (
    // SocketProvider wraps everything so one socket is shared across the app.
    // NotificationProvider is inside so it can consume useSocket().
    <SocketProvider>
      <NotificationProvider>
        <AppInner />
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;
