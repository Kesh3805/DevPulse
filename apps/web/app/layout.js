import './globals.css';

export const metadata = {
  title: 'DevPulse',
  description: 'Developer productivity and portfolio intelligence platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
