'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterClient() {
    return (
        <Toaster
            position="top-center"
            containerStyle={{
                top: 0,          // 👈 arriba de todo
                zIndex: 9999,    // 👈 por encima de la navbar
            }}
            toastOptions={{
                duration: 3000,
            }}
        />
    );
}