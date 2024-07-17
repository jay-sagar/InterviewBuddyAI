import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from '../components/ui/sonner'
import Header from "./dashboard/_components/Header";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Buddy AI",
  description: "Experience realistic interview simulations, personalized feedback, and boost your confidence with our advanced AI-powered mock interviews.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
        <Header />
          <Toaster/> 
          {children}
          </body>
      </html>
    </ClerkProvider>
  );
}
