// Muestra el formulario de registro de Clerk en /sign-up
import { SignUp } from '@clerk/nextjs';

export default function Page() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <SignUp />
        </main>
    );
}