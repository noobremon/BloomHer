import Script from 'next/script';

export const metadata = {
  title: 'BloomHer - Menstrual & PCOS Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Global Maya AI assistant widget: self-initializing, mounts itself
            to document.body and is used on every page (matches every
            mainpages/*.html <script src="/scriptpages/maya-assistant.js">). */}
        <Script src="/scriptpages/maya-assistant.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
