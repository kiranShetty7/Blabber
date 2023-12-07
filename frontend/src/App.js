import './App.css';
import SnackBar from './components/SnackBar/SnackBar';
import { Provider } from "react-redux";
import store from './store/index';
import RouterConfig from './RouterConfig/RouterConfig';
import Loader from './components/Loader/Loader';
import { SocketProvider } from './context/Socket';

function App() {

  return (
    <div >
      <Provider store={store}>
        <SocketProvider>
          <Loader />
          <RouterConfig />
          <SnackBar />
        </SocketProvider>
      </Provider>
    </div>
  );
}

export default App;
