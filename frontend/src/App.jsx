import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Album from './pages/Album';
import Artist from './pages/Artist';
import Search from './pages/Search';
import User from './pages/User';
import Notif from './pages/Notif';
import NotFound from './pages/NotFound';
import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useEffect, useState } from 'react';

function App() {
  const auth = useSelector(state => state.auth.value);
  const loading = useSelector(state => state.loading.value);
  const [date, setDate] = useState(Date.now());

  useEffect(() => {
    const timeID = setInterval(() => setDate(Date.now()), 500);
    return () => clearInterval(timeID);
  });
  
  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/album/:albumID' element={<Album />} />
            <Route path='/artist/:artistID' element={<Artist />} />
            <Route path='/user/:username' element={<User />} />
            <Route path='/notif' element={auth ? <Notif /> : <Navigate to="/" />} />
            <Route path='/search/:query' element={<Search />} />
            <Route path='/notfound' element={<NotFound />} />
          </Routes>
          {loading && <div className='loading'>
            <div className='loading-wheel'></div>
            {date - loading > 5000 && <div className='loading-description'>Initial load takes time, please wait...</div>}
          </div>
          }
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </div>
  )
}

export default App
