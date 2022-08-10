import Head from "next/head";
import React, { useContext, useEffect } from "react";
import { RecruitContext } from "../context/RecruitContext";
import { DialogBox } from "../Components/index";
import { useSession } from "next-auth/react";
import { XCircle } from "react-bootstrap-icons";
import { useRouter } from 'next/router'
// import Twitter from 'twitter-lite';
import Link from 'next/link'




export default function Registration() {
  const {
    connectWallet,
    shortAddress,
    isLoading,
    cleanUp,
    completeRegistration,
    twitterUser,
    discordUser,
    setDiscordUserInfos,
    setTwitterUserInfos,
    handleSignIn,
    handleSignOut,
    dialog,
  } = useContext(RecruitContext);


  const { data: session, status } = useSession();
  // if (status === 'authenticated' && session && session.token && session.token.provider === 'twitter') {

  //   const client = new Twitter({
  //     version: '1.1',
  //     extension: false,
  //     consumer_key: process.env.TWITTER_ID,
  //     consumer_secret: process.env.TWITTER_SECRET,
  //     access_token_key: session.token.twitter.accessToken,
  //     access_token_secret: session.token.twitter.refreshToken,
  // bearer_token: process.env.REACT_TWITTER_BEARER_TOKEN
  //   });
  // }
  const { push } = useRouter()




  useEffect(() => {
    if (typeof window !== "undefined") {
      if (session && session.token && session.token.provider === 'twitter' && (!twitterUser || !twitterUser.id)) {
        setTwitterUserInfos(session.token.twitter);
      }
      if (session && session.token && session.token.provider === 'discord' && (!discordUser || !discordUser.id)) {
        setDiscordUserInfos(session.token);
      }
    }
  });

  return (
    <>
      <Head>
        <title>Registration</title>
        <meta name="description" content="Registration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main className="app-container">
          <div
            className="background-bg"
            style={{ backgroundImage: "url(./images/background-banner.jpg)" }}
          ></div>

          <header
            className="primary-header"
            style={{ backgroundImage: "url(./images/header-lens.png)" }}
          >
            <div className="container">
              <div className="row align-items-start">
                <div className="col-md-4">
                  <div>
                    <DialogBox
                      closeDilod={cleanUp}
                      dialog={dialog}
                    ></DialogBox>
                  </div>
                </div>

                <div className="col-md-4">
                  <Link href="/" >
                    <img
                      src="/images/astro-must.svg"
                      alt=""
                      className="m-auto"
                    />
                  </Link>
                </div>
              </div>
            </div>


          </header>

          <section className="main-body">
            <article>
              <h2 className="title">GET A FREE NFT </h2>

              <p className="desc fs-large text-center fc-white tt-uppercase">
                Register with ASTRO MUST and get free NFT for minting 
              </p>

              <p className="desc ff-secondary mtpx-40 fs-medium text-center fc-white tt-uppercase">
                start your journey
              </p>

              <div className="buttons-section">
                <div className="d-flex align-items-center mbpx-30">
                  <div className="control-group">
                    <div className="checkbox">
                      <input type="checkbox" disabled checked={shortAddress ? true : false} />
                      <span className="label"></span>
                    </div>
                  </div>
                  {!shortAddress ? <a className="outline-button blue-button"
                    onClick={connectWallet}

                  >
                    <i className="xicon">
                      <img src="/images/wallet-image.png" alt="" />
                    </i>
                    Connect wallet
                  </a> :
                    <a className="outline-button blue-button"

                    >
                      <i className="xicon">
                        <img src="/images/wallet-image.png" alt="" />
                      </i>
                      {shortAddress}
                    </a>}
                </div>



                <div className="d-flex align-items-center mbpx-30">
                  <div className="control-group">
                    <div className="checkbox">
                      <input type="checkbox" disabled checked={(discordUser && discordUser.id) || session && session.token && session.token.provider === 'discord' ? true : false} />
                      <span className="label"></span>
                    </div>
                  </div>


                  {
                    ((discordUser && discordUser.id) || session && session.token && session.token.provider === 'discord') &&
                    <a className="outline-button blue-button">
                      <i className="xicon">
                        <img src="/images/discord-image.png" alt="" />
                      </i>
                      {(discordUser && discordUser.id) ? `${discordUser.username}` : session.token.name}
                      {(discordUser && discordUser.picture) && <img src={discordUser.picture} alt="Avatar" className="avatar"></img>}
                      <XCircle className="close" size={15} onClick={() => handleSignOut('discord')} />
                    </a>
                  }
                  {
                    ((!discordUser || !discordUser.id) && (!session || !session.token || session.token.provider !== 'discord')) &&
                    <a className="outline-button blue-button" onClick={() => handleSignIn('discord')}>
                      <i className="xicon">
                        <img src="/images/discord-image.png" alt="" />
                      </i>
                      CONNECT DISCORD
                    </a>
                  }
                </div>

                <div className="d-flex align-items-center mbpx-30">
                  <div className="control-group">
                    <div className="checkbox">
                      <input type="checkbox" disabled checked={twitterUser && twitterUser.id || session && session.token && session.token.provider === 'twitter' ? true : false} />
                      <span className="label"></span>
                    </div>
                  </div>
                  {
                    ((twitterUser && twitterUser.id) || session && session.token && session.token.provider === 'twitter') &&
                    <a className="outline-button blue-button">
                      <i className="xicon">
                        <img src="/images/twitter-image.png" alt="" />
                      </i>
                      {(twitterUser && twitterUser.id) ? `${twitterUser.username}` : session.token.twitter.profile.username}
                      {(twitterUser && twitterUser.picture) && <img src={twitterUser.picture} alt="Avatar" className="avatar"></img>}
                      <XCircle className="close" size={15} onClick={() => handleSignOut('twitter')} />
                    </a>
                  }
                  {
                    ((!twitterUser || !twitterUser.id) && (!session || !session.token || session.token.provider !== 'twitter')) &&
                    <a className="outline-button blue-button" onClick={() => handleSignIn('twitter')}>
                      <i className="xicon">
                        <img src="/images/twitter-image.png" alt="" />
                      </i>
                      FOLLOW TWITTER
                    </a>
                  }
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <a onClick={completeRegistration}
                  disabled={isLoading === true}
                  className="button white-button complete-registration"
                >
                  <span className="text">{isLoading === true ? 'Loading ...' : 'COMPLETE REGISTRATION'}</span>
                </a>
              </div>
            </article>
          </section>
          <a
            onClick={() => push('/')}
            className="fc-white fw-bold continue-website"
          >
            <span>Continue to the website</span>
            <i className="xicon icon-arrow_right"></i>

          </a>
        </main>
      </div>
      );
    </>
  );
}
