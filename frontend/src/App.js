import './App.css';
import AuthLayout from './pages/AuthLayout/AuthLayout';
import ChatLayout from './pages/ChatLayout/ChatLayout';
import SnackBar from './components/SnackBar/SnackBar';
import { Provider } from "react-redux";
import store from './store/index';
import RouterConfig from './RouterConfig/RouterConfig';
import Loader from './components/Loader/Loader';
function App() {

  return (
    <div >

      <Provider store={store}>
        <Loader/>
        <RouterConfig />
        <SnackBar />
      </Provider>
    </div>
  );
}

export default App;
