import React from 'react';
import { Link } from 'react-router';
import logo from '../../public/WebLogo.png'; // Adjust the path as necessary

const WebLogo = () => {
    return (
        <Link to="/">
            <div className='flex items-end w-28 md:w-32 lg:w-36'>
                <img className='mb-2' src={logo} alt="" />
            </div>
        </Link>
    );
};

export default WebLogo;