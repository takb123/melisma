import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import melismaLogo from '/melisma_logo.png'
import { useState } from 'react';

const NavBar = () => {
    const auth = useSelector(state => state.auth.value);
    const navigate = useNavigate();
    const [text, setText] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const query = encodeURIComponent(text);
            console.log(query);
            navigate(`/search/${query}`);
        }
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
                        <Link to={`/`}>Home (For Now)</Link>
                        <Link to={`/user/${auth.username}`}>Profile</Link>
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