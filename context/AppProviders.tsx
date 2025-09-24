'use client';

import Image from 'next/image';
import { createContext, useContext, useState, ReactNode, useRef, CSSProperties } from 'react';


// ANIMATION CONTEXT LOGIC
interface AnimationData { imageSrc: string; startRect: DOMRect; }
interface AnimationContextType {
    triggerAnimation: (data: AnimationData) => void;
    setCartRef: (el: HTMLElement | null) => void;
}
const AnimationContext = createContext<AnimationContextType | null>(null);

function AnimationProvider({ children }: { children: ReactNode }) {
    const [animatingImage, setAnimatingImage] = useState<string | null>(null);
    const [style, setStyle] = useState<CSSProperties>({});
    const cartRef = useRef<HTMLElement | null>(null);

    const triggerAnimation = ({ imageSrc, startRect }: AnimationData) => {
        if (!cartRef.current) return;
        const endRect = cartRef.current.getBoundingClientRect();
        setAnimatingImage(imageSrc);
        setStyle({ position: 'fixed', left: startRect.left, top: startRect.top, width: startRect.width, height: startRect.height, opacity: 1, transform: 'scale(1)', transition: 'all 0.7s cubic-bezier(0.5, 0, 0.75, 0)', zIndex: 100, });
        setTimeout(() => { setStyle((prevStyle) => ({ ...prevStyle, left: endRect.left + endRect.width / 2, top: endRect.top + endRect.height / 2, width: 0, height: 0, opacity: 0.5, transform: 'scale(0.1)', })); }, 50);
        setTimeout(() => { setAnimatingImage(null); }, 750);
    };

    return (
        <AnimationContext.Provider value={{ triggerAnimation, setCartRef: (el) => (cartRef.current = el) }}>
            {children}
            {animatingImage && (<Image src={animatingImage} alt="animating item" width={100} height={100} className="rounded-lg object-cover" style={style} />)}
        </AnimationContext.Provider>
    );
}

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) { throw new Error('useAnimation must be used within an AnimationProvider'); }
    return context;
};

// EXPORT PROVIDER
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <AnimationProvider>
            {children}
        </AnimationProvider>
    );
}