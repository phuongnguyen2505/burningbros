'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef, CSSProperties } from 'react';
import { createPortal } from 'react-dom';

// 1. MODAL CONTEXT LOGIC
interface ModalOptions {
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}
interface ModalContextType {
    openModal: (options: ModalOptions) => void;
    closeModal: () => void;
}
const ModalContext = createContext<ModalContextType | null>(null);

function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<ModalOptions | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);
    const openModal = (options: ModalOptions) => {
        setModalState(options);
    };
    const closeModal = () => {
        setModalState(null);
    };
    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {isMounted && (
                <AnimatePresence>
                    {modalState && createPortal(
                        <ModalComponent {...modalState} onClose={closeModal} />,
                        document.body
                    )}
                </AnimatePresence>
            )}
        </ModalContext.Provider>
    );
}

// function ModalComponent({ title, message, onConfirm, confirmText, cancelText, onClose }: ModalOptions & { onClose: () => void }) {
//     const handleConfirm = () => { onConfirm?.(); onClose(); };
//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
//             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-sm rounded-lg bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
//                 <h3 className="text-lg font-bold">{title}</h3>
//                 <p className="mt-2 text-sm text-muted-foreground">{message}</p>
//                 <div className="mt-6 flex justify-end gap-3">
//                     {onConfirm && (<button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold hover:bg-muted">{cancelText || 'Cancel'}</button>)}
//                     <button onClick={onConfirm ? handleConfirm : onClose} className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90">{confirmText || 'OK'}</button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// }
function ModalComponent({ title, message, onConfirm, confirmText, cancelText, onClose }: ModalOptions & { onClose: () => void }) {
    console.log('%c ModalComponent IS RENDERING!', 'background: #222; color: #bada55');

    const handleConfirm = () => { onConfirm?.(); onClose(); };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '2rem',
                    borderRadius: '8px',
                    maxWidth: '400px',
                    width: '90%',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{title}</h3>
                <p style={{ marginTop: '0.5rem' }}>{message}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    {onConfirm && (
                        <button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px' }} onClick={onClose}>
                            {cancelText || 'Cancel'}
                        </button>
                    )}
                    <button style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white' }} onClick={onConfirm ? handleConfirm : onClose}>
                        {confirmText || 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
}
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) { throw new Error('useModal must be used within a ModalProvider'); }
    return context;
};

// 2. ANIMATION CONTEXT LOGIC
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

// 3. EXPORT PROVIDER
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ModalProvider>
            <AnimationProvider>
                {children}
            </AnimationProvider>
        </ModalProvider>
    );
}