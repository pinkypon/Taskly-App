import React from 'react';

type HeaderProps = {
    size?: 'default' | 'large';
    children: React.ReactNode;
    className?: string;
};

export default function Header({ size = 'default', children, className = '' }: HeaderProps) {
    let sizeClasses = '';

    switch (size) {
        case 'large':
            sizeClasses = 'text-4xl font-bold';
            break;
        case 'default':
        default:
            sizeClasses = 'text-2xl font-semibold';
            break;
    }

    return <h1 className={`${sizeClasses} ${className}`}>{children}</h1>;
}
