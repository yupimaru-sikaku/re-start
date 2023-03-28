import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import 'src/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}