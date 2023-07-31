import { useContext, useState } from 'react';
import { X, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';
import { lineString, length } from '@turf/turf'
import mapboxgl from 'mapbox-gl';

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import './PinPopup.css'

function PinPopup({ result, userCoords, setShowPopup }) {
    // Constants
    const test = true // Set true to test logging, false for production
    const title = result.place_name.substring(0, result.place_name.indexOf(','));
    const address = result.place_name.substring(result.place_name.indexOf(',') + 1);
    const geocoderButton = document.querySelector('.mapboxgl-ctrl-geocoder--button');
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    // Contexts
    const { auth, setAuth } = useContext(AuthContext)
    const map = useContext(MapContext)
    // States
    const [showLog, setShowLog] = useState(true);
    const [showRecommend, setShowRecommend] = useState(false);
    const [logged, setLogged] = useState(false);
    const [recommend, setRecommend] = useState(true);
    const [dateLogged, setDateLogged] = useState('today');


    const closePopup = () => {
        setShowPopup(false);
        geocoderButton.click();
    }

    const logExploration = () => {
        const line = lineString([result.center, [userCoords.lng, userCoords.lat]]);
        const len = length(line, { units: 'miles' });
        // User must be within 100yards of location
        if (len <= 0.0568182 || test) {
            setShowLog(false);
            setShowRecommend(true);
        } else {
            alert('Must be within 100 yards of location')
        }
    }

    const dropPin = () => {
        setLogged(true);
        setShowRecommend(false);
        setShowLog(true);

        const currentDate = new Date();
        const month = months[currentDate.getMonth()];
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        const formattedDate = `${month} ${day}, ${year}`;
        setDateLogged(formattedDate)

        const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([result.center[0], result.center[1]])
            .addTo(map.current);
        let newAuth = { ...auth }
        newAuth.pins.push({ title: title, description: address, longitude: result.center[0], latitude: result.center[1], marker: marker })
        setAuth(newAuth)
        geocoderButton.click();
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
                {logged ?
                    <div className='popup-button logged'>Logged {dateLogged}</div> :
                    <button className='popup-button log' onClick={logExploration}>Log Exploration</button>}
            </>)}
            {showRecommend && (<>
                <div className='popup-friends'>Recommend to others?</div>
                <div className='recommend-buttons-container'>
                    <button className={'recommend-button' + (recommend ? ' selected' : '')} onClick={() => setRecommend(true)}><ThumbsUp size={32} weight='fill' /></button>
                    <button className={'recommend-button' + (recommend ? '' : ' selected')} onClick={() => setRecommend(false)}><ThumbsDown size={32} weight='fill' /></button>
                </div>
                <button className='popup-button log' onClick={dropPin}>Drop my pin!</button>
            </>)}
        </div>
    );
}

export default PinPopup;