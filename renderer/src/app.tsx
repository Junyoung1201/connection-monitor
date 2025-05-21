import ConnectionList from 'components/section/ConnectionList';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { setConnectionList } from 'store/connection';
import { RootState, store } from 'store/store';
import './fonts/fonts.css';
import 'app.css';
import Header from 'components/header/Header';
import Section from 'components/section/Section';

ReactDOM.createRoot(document.querySelector("#app")!).render(<App />)

function App() {

    const timerRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if(!timerRef.current) {
            timerRef.current = setInterval(updateConnectionList,350);
        }

        return () => {
            window.app.clearAllListeners();
        }
    },[])

    async function updateConnectionList() {
        let conList = await window.app.invoke("getConnectionList");
        store.dispatch(setConnectionList(conList));
    }

    return (
        <Provider store={store}>
            <Header />
            <Section />
        </Provider>
    )
}