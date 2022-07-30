import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';
import '../styles/Home.css';
import '../styles/StartMinting.css';
import '../../node_modules/react-modal-video/scss/modal-video.scss';
import { SessionProvider } from 'next-auth/react';
import { RecruitProvider } from '../context/RecruitContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <RecruitProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </RecruitProvider>
  );
}
export default MyApp;