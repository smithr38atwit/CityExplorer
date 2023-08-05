import { useContext, useState } from 'react';
import { X, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';
import { lineString, length } from '@turf/turf'
import mapboxgl from 'mapbox-gl';

import { pinModel } from '../scripts/data';
import { createPin } from '../scripts/api';
import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import './PinPopup.css'

function PinPopup({ pin, userCoords, setPopupData, setShowPopup }) {
    // Constants
    const test = true // Set true to test logging, false for production
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
    const [recommend, setRecommend] = useState(true);
    const [dateLogged, setDateLogged] = useState(pin.date_logged);


    const closePopup = () => {
        setShowPopup(false);
        geocoderButton.click();
    }

    const logExploration = () => {
        const line = lineString([[pin.longitude, pin.latitude], [userCoords.lng, userCoords.lat]]);
        const len = length(line, { units: 'miles' });
        // User must be within 100yards of location
        if (len <= 0.0568182 || test) {
            setShowLog(false);
            setShowRecommend(true);
        } else {
            alert('Must be within 100 yards of location')
        }
    }

    const dropPin = async () => {
        const currentDate = new Date();
        const month = months[currentDate.getMonth()];
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;

        const [up, down] = recommend ? [1, 0] : [0, 1]
        const newPin = pinModel(pin.name, pin.address, pin.longitude, pin.latitude, formattedDate, up, down, pin.feature_id)

        // Send pin info to database, cancel action if it fails
        try {
            const response = await createPin(newPin, auth.id);
            const data = await response.json()

            if (response.status === 201) {
                // success
                console.debug('Pin uploaded successfully')
            } else {
                // failure
                console.error('Create pin error: ', data.detail)
                return
            }
        } catch (error) {
            // failure
            console.error('Create pin error: ', error)
            return
        }

        setShowRecommend(false);
        setShowLog(true);
        setDateLogged(formattedDate)

        const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([pin.longitude, pin.latitude])
            .addTo(map.current);
        marker.getElement().addEventListener('click', () => {
            map.current.flyTo({
                center: [pin.longitude, pin.latitude],
                zoom: 16
            });
            setPopupData(newPin);
            setShowPopup(true);
        });

        // This block is only for creating new pins
        // TODO: functionality for logging existing friends pin
        const newAuth = { ...auth }
        newAuth.pins.push({ ...newPin, marker: marker })
        setAuth(newAuth)
        geocoderButton.click();
    }

    return (
        <div className="pin-popup">
            <button className='close-pin-popup' onClick={closePopup}><X size={20} /></button>
            <div className='place-name'>
                <h2 className='title'>{pin.name}</h2>
                <h3 className='subtitle'>{pin.address}</h3>
            </div>
            <hr />
            {showLog && (<>
                <div className='popup-friends'><button>0 friends</button> have been here</div>
                {dateLogged ?
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