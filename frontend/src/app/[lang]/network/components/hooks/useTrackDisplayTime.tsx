import { useState, useEffect, useRef, useContext } from 'react';
import { usePathname } from 'next/navigation';
import NetworkContext from '../reducer';
export default function (componentName) {
    const { dispatch } = useContext(NetworkContext)
    const pathname = usePathname();  
    const startTimeRef = useRef(null); // Tracks when the component was last rendered
    const startTimeName = useRef(null)
    const saveData = () => {
        dispatch({
            type: 'track_display_time',
            payload: { componentName, time: getCurrentDisplayTime() },
        });
    }

    useEffect(() => {
        // When the component mounts, record the start time
        startTimeRef.current = Date.now();
        startTimeName.current = componentName

        window.addEventListener('beforeunload', saveData);
        // When the component unmounts, calculate the time and dispatch it
        return () => {
            window.removeEventListener('beforeunload', saveData);
            dispatch({
                type: 'track_display_time',
                payload: { componentName, time: getCurrentDisplayTime() },
            });
        };
    }, [componentName, dispatch, pathname]);

    const getCurrentDisplayTime = () => {
        const currentTime = Date.now();
        return currentTime - startTimeRef.current;
    };
    return getCurrentDisplayTime
}