import { ClerkProvider } from "@clerk/nextjs";

export default function SignUpLayout({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

