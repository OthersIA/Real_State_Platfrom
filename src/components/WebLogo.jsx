import React from 'react';
import { Link } from 'react-router';

const WebLogo = () => {
    return (
        <Link to="/">
            <div className='flex items-end'>
                {/* <img className='mb-2' src={logo} alt="" /> */}
                <p className='text-3xl font-extrabold'>PropFinder</p>
            </div>
        </Link>
    );
};

export default WebLogo;