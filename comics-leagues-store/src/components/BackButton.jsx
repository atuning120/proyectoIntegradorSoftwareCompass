import React from 'react';
import {Link} from 'react-router-dom'

const BackButton = ({ to, destination }) => {
    const label = `Regresar`;

    const handleClick = () => {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
    };

    return (
        <Link to={to}
            style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                width: '180px', // Set width to auto or specific size
                height: '40px', // Set a fixed height
                boxSizing: 'border-box', // Ensures padding is included in width/height
                paddingLeft: '12px'
            }}

            onClick={handleClick} >
                <button style={{ display: 'flex', cursor: 'pointer' }}>
                    <span style={{ marginRight: '8px' }}>&#8592;</span>
                    {label}
                </button>
        </Link>
    );
};

export default BackButton;