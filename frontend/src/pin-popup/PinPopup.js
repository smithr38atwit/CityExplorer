import { X, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';

import './PinPopup.css'
import { useState } from 'react';

function PinPopup({ result, setShowPopup }) {
    const title = result.place_name.substring(0, result.place_name.indexOf(','));
    const address = result.place_name.substring(result.place_name.indexOf(',') + 1);
    const geocoderButton = document.querySelector('.mapboxgl-ctrl-geocoder--button');

    const [showLog, setShowLog] = useState(true);
    const [showRecommend, setShowRecommend] = useState(false);
    const [showLogged, setShowLogged] = useState(false);
    const [recommend, setRecommend] = useState(true);

    const closePopup = () => {
        setShowPopup(false);
        geocoderButton.click();
    }

    const logExploration = () => {

        setShowLog(false);
        setShowRecommend(true);
    }

    return (
        <div className="pin-popup">
            <button className='close-pin-popup' onClick={closePopup}><X size={20} /></button>
            <div className='place-name'>
                <h2 className='title'>{title}</h2>
                <h3 className='subtitle'>{address}</h3>
            </div>
            <hr />
            {showLog && (<>
                <div className='popup-friends'><button>0 friends</button> have been here</div>
                <button className='popup-button' onClick={logExploration}>Log Exploration</button>
            </>)}
            {showRecommend && (<>
                <div className='popup-friends'>Recommend to others?</div>
                <div className='recommend-buttons-container'>
                    <button className={'recommend-button' + (recommend ? ' selected' : '')} onClick={() => setRecommend(true)}><ThumbsUp size={32} weight='fill' /></button>
                    <button className={'recommend-button' + (recommend ? '' : ' selected')} onClick={() => setRecommend(false)}><ThumbsDown size={32} weight='fill' /></button>
                </div>
                <button className='popup-button' onClick={logExploration}>Drop my pin!</button>
            </>)}
        </div>
    );
}

export default PinPopup;