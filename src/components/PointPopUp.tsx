import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { pointPopUpAtom } from '@/store/points';

export function PointPopUp() {
    const [pointPopUp, setPointPopUp] = useAtom(pointPopUpAtom);
    const [isVisible, setIsVisible] = useState(false);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (pointPopUp) {
            setDisplayValue(pointPopUp.value);
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setPointPopUp(null); // Reset the atom after animation
            }, 2000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [pointPopUp, setPointPopUp]);

    if (!isVisible) return null;

    return (
        <div className="fixed left-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-1000 ease-out"
            style={{
                opacity: isVisible ? 1 : 0,
                bottom: isVisible ? '350px' : '300px', // Start at 300px from bottom, animate to 350px
                transform: 'translateX(-50%)', // Horizontal centering
            }}>
            +{displayValue} Points!
        </div>
    );
} 