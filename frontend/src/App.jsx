import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Album from './pages/Album';
import Artist from './pages/Artist';
import Search from './pages/Search';
import User from './pages/User';
import './App.css'

// Pink: #be0b6d
// Purple: #6b3082
// Blue: #11488d

function App() {
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
            <Route path='/search/:query' element={<Search />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
