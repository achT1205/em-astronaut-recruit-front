import Head from "next/head";
import { useState, useContext } from "react";
import ModalVideo from "react-modal-video";
import { AvatarSlider } from "../Components";
import { FaqSection } from "../Components";
import { RecruitContext } from "../context/RecruitContext";
import { Loader, DialogBox } from "../Components/index";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Badge from 'react-bootstrap/Badge';

export default function Home() {
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);

  const {
    currentAccount,
    connectWallet,
    shortAddress,
    claimRecruit,
    dialog,
    cleanUp,
    buyRecuit,
    unitFormatedPrice,
    formData,
    setFormData,
    isLoading,
    showBuyOptions,
    setShowBuyOptions
  } = useContext(RecruitContext);

  const [showRange, setToggleRange] = useState(false);

  const { push } = useRouter()

  const handleFreeMintChoice = (choice) => {
    if (choice === "free") {
      setToggleRange(false)
      claimRecruit()

    }
    else
      setToggleRange(true)
  }


  const increaseAmount = () => {
    const data = { ...formData }
    data.amount++;
    setFormData(data)
  }

  const decreaseAmount = () => {
    if (formData.amount === 1)
      return;

    const data = { ...formData }
    data.amount--;
    setFormData(data)
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Current wallet</Popover.Header>
      <Popover.Body>
        {shortAddress}
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <Head>
        <title>AstroMust - Home</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app-container">
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
                <Link href="/" className="astromust-logo" >
                  <img src="/images/astromust.svg" alt="" className="m-auto" />
                </Link>

              </div>
              <div className="col-md-4 d-flex justify-content-end">
                {!currentAccount ? <a
                  className="start-button button --white-button" style={{ cursor: "pointer" }}
                  onClick={connectWallet}
                >
                  <img src="/images/white-button.svg" alt="" />
                  <span className="text">Connect wallet</span>
                </a> :
                  // <a className="start-button button --white-button" style={{ cursor: "pointer" }}>
                  //   <>
                  //     <img src="/images/white-button.svg" alt="" />
                  //     <span className="text">{shortAddress}</span>
                  //   </>
                  // </a>

                  <OverlayTrigger
                    placement="left"
                    overlay={popover}
                  >
                    <a onClick={() => push('/nfts')} className="start-button button --white-button" style={{ cursor: "pointer" }}>
                      <>
                        <img src="/images/white-button.svg" alt="" />
                        <span className="text">Go to your NFTs </span>
                      </>
                    </a>
                  </OverlayTrigger>
                }
              </div>
            </div>
          </div>
        </header>

        <section className="hero-banner">
          <div className="container">
            <article className="inner-content">
              <h2 className="maintitle">THE RECRUITS</h2>
              <p className="subtitle">
                The Million Dollar Mission <br />
                The mines of the moon are plentiful and we MUST organize to win. <br />
                The race is on! You&apos;re here. We salute you. Let&apos;s begin your training… Recruit!
              </p>

              <div className="banner-buttons">
                <div className="d-flex align-items-center justify-content-around">
                  <a className="button --white-button" onClick={() => setShowBuyOptions(true)}>
                    <img src="/images/white-button.svg" alt="" />
                    <span className="text d-flex align-items-center justify-content-center">
                      <span className="" style={{ cursor: "pointer" }}>MINT</span>
                    </span>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <Modal show={showBuyOptions} onHide={() => setShowBuyOptions(false)} animation={false} backdrop="static">
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <h5 className="fc-white tt-uppercase ls-large text-center mbpx-20">RECRUIT NFT</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex align-items-center justify-content-around">
                    <a className="button" disabled={isLoading} onClick={() => handleFreeMintChoice('free')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="210" height="48" viewBox="0 0 291 70">
                        <g id="Path_22691" data-name="" fill="rgba(77,255,255,0.48)">
                          <path d="M 290.5 59.5 L 15.16070938110352 59.5 L 0.5 44.79335021972656 L 0.5 0.5 L 275.7822265625 0.5 L 290.5 16.32163619995117 L 290.5 59.5 Z" stroke="none"></path>
                          <path d="M 1 1 L 1 44.58668518066406 L 15.36825561523438 59 L 290 59 L 290 16.51826095581055 L 275.564453125 1 L 1 1 M 0 0 L 276 0 L 291 16.12503814697266 L 291 60 L 14.953125 60 L 0 45 L 0 0 Z" stroke="none" fill="#4dffff"></path>
                        </g>
                      </svg>
                      <span className="d-flex align-items-center justify-content-center">
                        <span className="text fc-white" style={{ cursor: "pointer" }}>{isLoading ? 'Loading ...' : 'CLAIM ONE FREE NFT'}</span>
                      </span>
                    </a>
                  </div>
                </Col>
                <Col>
                  <div className="d-flex align-items-center justify-content-around">
                    <a className="button" onClick={() => handleFreeMintChoice('buy')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 291 70">
                        <g id="Path_22692" data-name="" fill="rgba(238,165,0,0.4)">
                          <path d="M 275.8393249511719 59.5 L 0.5 59.5 L 0.5 16.32163619995117 L 15.21776866912842 0.5 L 290.5 0.5 L 290.5 44.79335021972656 L 275.8393249511719 59.5 Z" stroke="none"></path>
                          <path d="M 15.435546875 1 L 1 16.51826095581055 L 1 59 L 275.6317443847656 59 L 290 44.58668518066406 L 290 1 L 15.435546875 1 M 15 0 L 291 0 L 291 45 L 276.046875 60 L 0 60 L 0 16.12503814697266 L 15 0 Z" stroke="none" fill="#eea500"></path>
                        </g>
                      </svg>

                      <span className="d-flex align-items-center justify-content-center">
                        <span className="text fc-white" style={{ cursor: "pointer" }}>{isLoading ? 'Loading ...' : 'BUY NFT'} </span>
                      </span>
                    </a>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            {showRange &&
              <Modal.Body>
                <div className="align-items-center flex-col">

                  <div className="modal-counter">
                    <Button variant="" size="lg" disabled={formData.amount === 1} onClick={decreaseAmount}>
                      -
                    </Button>

                    <Badge bg="">{formData.amount}</Badge>

                    <Button variant="" size="lg" onClick={increaseAmount}>
                      +
                    </Button>
                  </div>


                  <div className="d-flex align-items-center justify-content-around">
                    <div className="mb-3">
                      <span className="d-flex align-items-center justify-content-center">
                        <span className="fc-primary counter-text">{(formData.amount * unitFormatedPrice).toFixed(4)} ETH</span>
                      </span>
                    </div>
                  </div>


                </div>
                <Row>
                  <div className="d-flex align-items-center justify-content-around">
                    <a className="button --white-button" disabled={isLoading} onClick={buyRecuit}>
                      <img src="/images/white-button.svg" alt="" />
                      <span className="text d-flex align-items-center justify-content-center">
                        <span className="text" style={{ cursor: "pointer" }}>{isLoading ? 'Loading ...' : 'BUY A RECRUIT'}</span>
                      </span>
                    </a>
                  </div>
                </Row>

              </Modal.Body>
            }
          </Modal>

          <figure className="banner-image">
            <img
              src="/images/banner.png"
              alt=""
              className="d-none d-md-block"
            />
            <img
              src="/images/mobile-banner.png"
              alt=""
              className="d-block d-md-none"
            />
          </figure>
        </section>

        <section className="recruit-section">
          <article className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h2 className="maintitle">THE COLLECTION</h2>
                <p className="maindesc">
                  It&apos;s time! Hone your skills and prepare yourselves for the future. The Recruit Collection is a Free Mint for ALL, and your entry pass into the AstroMust ecosystem. <br /><br />
                  <strong>1 free mint + gas per wallet. </strong> <br />
                  Once you mint your Recruit, you &apos;MUST&apos; join us on discord to rank up your Recruit to Lieutenant! <br /><br />
                  We are waiting for you….
                </p>

                <div className="mtpx-30">
                  <a className="button --white-button d-inline-flex" href="https://discord.com/invite/astromust">
                    <img src="/images/white-button.svg" alt="" />
                    <span className="text">Connect Discord</span>
                  </a>
                </div>

              </div>

              <div className="col-md-5 offset-md-1">
                <div className="recruit-video">
                  <ModalVideo
                    channel="custom"
                    url="https://www.youtube.com/embed/Ntr8xMwZPIE"
                    isOpen={isVideoModalVisible}
                    onClose={() => setIsVideoModalVisible(false)}
                  />

                  <div>
                    <a
                      id="sintel"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsVideoModalVisible(true);
                      }}
                    >
                      <img src="/images/recruit-video.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="benefits-section sec-padding">
          <div className="container">
            <article className="">
              <h2 className="maintitle">WHY JOIN, WHY NOW?.... WHY NOT!</h2>
              <p className="maindesc">
                You are joining <strong>&quot;M.U.S.T.&quot;</strong> (Multi-Universal Space Team), so make your bed and act like it, prepare for it, do your best, and show what you are made of. In return, you get;
              </p>
            </article>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/benefit-icon1.png" alt="" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">A Mission-based community</h4>
                    <p className="desc">
                      We are united in ONE vision - <strong>To create Space for Everyone in the Metaverse. </strong> You join; you BELONG.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/benefit-icon2.png" alt="" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">To Master new skills</h4>
                    <p className="desc">
                      Have you ever heard of NFTs getting trained?! You will put your NFT to work, which will pay off.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/benefit-icon3.png" alt="" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">Rewards</h4>
                    <p className="desc">
                      $1 million to be won by the first AstroMust on the moon. 20% of revenue goes to our players as in-game rewards. Yes, you heard that right. $1m IRL for the first MUST on the moon!
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/benefit-icon4.png" alt="" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">Early Access</h4>
                    <p className="desc">
                      You are early and will get direct access to the MUST collection, coming soon. Pioneers, paving the way for other Astros.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="avatar-section sec-padding">
          <article className="container">
            <div className="row align-items-center">
              <div className="col-md-7">
                <h2 className="maintitle">RECRUIT PROGRESSION</h2>
                <p className="maindesc w-lg-70">
                  You will move up the ranks by completing discovery missions, tasks, and exploration challenges. Only the strongest will survive to become Lieutenant. Live up to your <strong>NUMBER</strong>, RECRUIT. Don&apos;t let us down.
                </p>
              </div>
            </div>

            <div className="d-none d-md-block">
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <img src="/images/avatar-img1.png" alt="" className="m-auto" />
                </div>
                <div className="col-lg-3 col-md-6">
                  <img src="/images/avatar-img3.png" alt="" className="m-auto" />
                </div>
                <div className="col-lg-3 col-md-6">
                  <img src="/images/avatar-img2.png" alt="" className="m-auto" />
                </div>
                <div className="col-lg-3 col-md-6">
                  <img src="/images/avatar-img4.png" alt="" className="m-auto" />
                </div>
              </div>
            </div>

            <div className="d-block d-md-none">
              <div>
                <img src="/images/mobile-avatar-img1.png" alt="" />
              </div>
              <div>
                <img src="/images/mobile-avatar-img3.png" alt="" />
              </div>
              <div>
                <img src="/images/mobile-avatar-img2.png" alt="" />
              </div>
              <div>
                <img src="/images/mobile-avatar-img4.png" alt="" />
              </div>
            </div>
          </article>
        </section>
        <section className="benefits-section sec-padding">
          <div className="container">
            <article className="">
              <h2 className="maintitle">HOW TO MINT</h2>
            </article>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/how-mint-icon1.png" alt="" className="m-auto" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">13/08/2022</h4>
                    <p className="desc">
                      24hr early access to holders of WL spots
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/how-mint-icon2.png" alt="" className="m-auto" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">14/08/2022</h4>
                    <p className="desc">
                      Play to Mint live
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/how-mint-icon3.png" alt="" className="m-auto" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">Mint Recruit</h4>
                    <p className="desc">
                      Mint Recruit (pfp only) - you can mint free through the game or buy a Recruit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/how-mint-icon4.png" alt="" className="m-auto" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">Registration</h4>
                    <p className="desc">
                      Complete registration through the website
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/how-mint-icon5.png" alt="" className="m-auto" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">Upgrade recruit</h4>
                    <p className="desc">
                      Upgrade Recruit to Lieutenant through discord activities
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="benefit-box">
                  <i className="xicon">
                    <img src="/images/how-mint-icon6.png" alt="" className="m-auto" />
                  </i>
                  <div className="content">
                    <h4 className="title tt-uppercase">Avatar</h4>
                    <p className="desc">
                      All collection holders will receive a 3D fully rigged avatar soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="goals-section sec-padding">
          <div className="container">
            <article className="">
              <h2 className="maintitle">ULTIMATE GOAL</h2>
              <p className="maindesc">
                <strong>SPACE</strong> - with the right gear, the correct equipment, and the most skilled workforce. <br /><br />
                AstroMust is a revolutionary gaming project with a robust Web3 culture. We create innovative gamefi concepts to shake up the industry. <br />
                The first-ever Play-to-Mint game on the App store. The first &apos;Open door&apos; NFT collection. The first NFT training roadmap and much, <strong>MUST</strong> more….
              </p>
            </article>

            <AvatarSlider />

            <div className="mtpx-40">
              <Link href="https://astromust.gsc.im/1/twitter">
                <a className="button --white-button m-auto">
                  <img src="/images/white-button.svg" alt="" />
                  <span className="text">Start Playing</span>
                </a>
              </Link>
            </div>
          </div>
        </section>

        <section className="faq-section sec-padding">
          <div className="container">
            <article className="inner-content text-center mbpx-40">
              <h2 className="maintitle">faq</h2>
            </article>

            <FaqSection />
          </div>
        </section>

        <section className="primary-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <ul className="unstyled footer-links">
                  <li>
                    <Link href="https://astromust.com/">
                      <a>AstroMust Main Website</a>
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="#">
                      <a>FAQ</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Contact</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Blog</a>
                    </Link>
                  </li> */}
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="unstyled inline social-media">
                  <li>
                    <Link href="https://discord.com/invite/astromust">
                      <a target="_blank">
                        <img src="/images/discord.svg" alt="" />
                      </a>
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="#">
                      <a target="_blank">
                        <img src="/images/facebook.svg" alt="" />
                      </a>
                    </Link>
                  </li> */}
                  <li>
                    <Link href="https://www.instagram.com/astro_must/">
                      <a target="_blank">
                        <img src="/images/instagram.svg" alt="" />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://twitter.com/Astro_Must">
                      <a target="_blank">
                        <img src="/images/twitter.svg" alt="" />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}