import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, className }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                    >
                        {/* Modal Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 24 }}
                            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "glass-card w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]",
                                className
                            )}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-6 py-4"
                                style={{ borderBottom: '1px solid var(--glass-border)' }}
                            >
                                <h2
                                    className="text-lg font-bold"
                                    style={{ color: 'var(--foreground)' }}
                                >
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="neuo-btn p-1.5 transition-colors"
                                    style={{
                                        color: 'var(--muted-foreground)',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    <X className="w-4.5 h-4.5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
