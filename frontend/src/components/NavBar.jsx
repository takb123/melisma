import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../redux/authSlice';
import melismaLogo from '/melisma_logo.png'
import { useState, useRef, useEffect } from 'react';

const NavBar = () => {
    const auth = useSelector(state => state.auth.value);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const query = encodeURIComponent(text);
            console.log(query);
            navigate(`/search/${query}`);
        }
    };

    const handleSignout = () => {
        localStorage.removeItem("auth");
        dispatch(signout());
    };

    return (
        <header>
            <nav>
                <span className='container'>
                    <Link to='/'>
                        <img src={melismaLogo} className='logo' alt='Melisma Logo' />
                    </Link>
                    <div className='search-bar'>
                        <div className="search">
                            <span className="material-symbols-outlined">search</span>
                            <input 
                                type="text" 
                                placeholder="Search" 
                                value={text} 
                                onChange={e => setText(e.target.value)} 
                                onKeyDown={handleKeyDown}
                            />
                            <span className="material-symbols-outlined close" onClick={() => setText("")}>close</span>
                        </div>
                    </div>
                </span>
                { auth ? (
                    <span className='container'>
                        <div className='dropdown' ref={menuRef}>
                            <div className='dropdown-icon' onClick={() => setMenuOpen(true)}>
                                <span className="material-symbols-outlined">account_circle</span> 
                                <span>{auth.username}</span>
                            </div> 
                            <div className={'dropdown-content' + (menuOpen ? "" : " hidden")}>
                                <Link className="dropdown-line" to={`/user/${auth.username}`} onClick={() => setMenuOpen(false)}>
                                    <span className="material-symbols-outlined">person</span>
                                    <span>Profile</span>
                                </Link>
                                <Link className="dropdown-line" to={`/notif`} onClick={() => setMenuOpen(false)}>
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span>Notifications</span>
                                </Link>
                                <span className="dropdown-line" onClick={() => { setMenuOpen(false); handleSignout(); }}>
                                    <span className="material-symbols-outlined">logout</span>
                                    <span>Sign Out</span>
                                </span>
                            </div>
                        </div>
                    </span>
                    ) : (
                    <span className='container'>
                        <Link to='/signup'>
                            <span className='button signup'>Sign Up</span>
                        </Link>
                        <Link to='/signin'>
                            <span className='button signin'>Sign In</span>
                        </Link>
                    </span>
                )
                }
            </nav>
        </header>
    );
};

export default NavBar;