import React from 'react';

type HeaderProps = {
    size?: 'default' | 'large'; // size options
    children: React.ReactNode;
    className?: string; // allow extra classes
};

export default function Header({ size = 'default', children, className = '' }: HeaderProps) {
    let sizeClasses = '';

    switch (size) {
        case 'large':
            sizeClasses = 'text-3xl font-bold';
            break;
        case 'default':
        default:
            sizeClasses = 'text-xl font-bold';
            break;
    }

    return <h1 className={`${sizeClasses} ${className}`}>{children}</h1>;
}
