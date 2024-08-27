import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import ico from '@/public/images/motivaily-favicon-color.png'
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Motivaily",
  description: "Your daily motivation app to help you achieve your goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="icon" href="/images/motivaily-favicon-color.png" />
      </head>
      <body className="bg-background text-foreground transition-colors duration-1000 ease-in-out">
        <main className="min-h-screen flex flex-col items-center">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
