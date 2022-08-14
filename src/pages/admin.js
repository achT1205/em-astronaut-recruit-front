import React from 'react'
import { useContext } from "react";
import Head from "next/head";
import { Loader, DialogBox } from "../Components/index";
import { RecruitContext } from "../context/RecruitContext";
import Link from 'next/link'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default function Admin() {

    const {
        currentAccount,
        connectWallet,
        shortAddress,
        dialog,
        cleanUp,
        addUserForFreeMint,
        addGoldenVip,
        addUserForVipMint,
        addUserForLevelUp,
        addOperator,
        handleChange,
        withdraw,
        loadBatchUser,
        isLoading,
        formData
    } = useContext(RecruitContext);

    return (
        <>
            <Head>
                <title>AstroMust - NFTS</title>
                <meta name="description" content="NFTS" />
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
                                    className="start-button button --white-button"
                                    style={{ cursor: "pointer" }}
                                    onClick={connectWallet}
                                >
                                    <img src="/images/white-button.svg" alt="" />
                                    <span className="text">Connect wallet</span>
                                </a> :

                                    <a
                                        className="start-button button --white-button"
                                    >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text">{shortAddress}</span>
                                    </a>
                                }
                            </div>
                        </div>
                    </div>
                </header>

                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Add a user for free mint (by pass the game)</h5>

                        <Row>
                            <Form>
                                <Form.Group className="mb-3" controlId="freeMintWallet">
                                    <Form.Label>wallet address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter a wallet address" onChange={(e) => handleChange(e, 'freeMintWallet')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="hasFinishedGame" >
                                    <Form.Check type="checkbox" label="Has plaied the game" onChange={(e) => handleChange(e, 'hasFinishedGame', 'checkbox')} />
                                </Form.Group>

                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={addUserForFreeMint} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </section>

                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Add a golden vip (by pass the game & registration)</h5>

                        <Row>
                            <Form>
                                <Form.Group className="mb-3" controlId="goldenVip">
                                    <Form.Label>wallet address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter a wallet address" onChange={(e) => handleChange(e, 'goldenVipWallet')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="goldenVip" >
                                    <Form.Check type="checkbox" label="Golden Vip" onChange={(e) => handleChange(e, 'goldenVip', 'checkbox')} />
                                </Form.Group>

                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={addGoldenVip} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </section>

                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Add a vip user (firt 24h minting privilege)</h5>

                        <Row>
                            <Form>
                                <Form.Group className="mb-3" controlId="vipMintWallet">
                                    <Form.Label>wallet address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter a wallet address" onChange={(e) => handleChange(e, 'vipMintWallet')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="isVip" >
                                    <Form.Check type="checkbox" label="Can vip mint" onChange={(e) => handleChange(e, 'isVip', 'checkbox')} />
                                </Form.Group>

                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={addUserForVipMint} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </section>


                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Allow a user to level up </h5>
                        <Row>
                            <Form>
                                <Form.Group className="mb-3" controlId="levelUpWallet">
                                    <Form.Label>wallet address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter a wallet address" onChange={(e) => handleChange(e, 'levelUpWallet')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="canLevelUp" >
                                    <Form.Check type="checkbox" label="Can levelup" onChange={(e) => handleChange(e, 'canLevelUp', 'checkbox')} />
                                </Form.Group>
                                {

                                    formData.canLevelUp &&

                                    <Form.Group className="mb-3">
                                        <Form.Label>Select a level </Form.Label>
                                        <Form.Select onChange={(e) => handleChange(e, 'level')} >
                                            <option>Select a level</option>
                                            <option value="2">2ND OFFICER</option>
                                            <option value="3">1ST OFFICER</option>
                                            <option value="4">LIEUTENANT</option>
                                        </Form.Select>
                                    </Form.Group>
                                }

                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={addUserForLevelUp} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </section>

                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Add operator </h5>
                        <Row>
                            <Form>
                                <Form.Group className="mb-3" controlId="operatoWallet">
                                    <Form.Label>wallet address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter a wallet address" onChange={(e) => handleChange(e, 'operatoWallet')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="approved" >
                                    <Form.Check type="checkbox" label="approved" onChange={(e) => handleChange(e, 'approved', 'checkbox')} />
                                </Form.Group>

                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={addOperator} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </section>

                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Loard WL players</h5>
                        <Row>
                            <Form>
                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={loadBatchUser} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'load batch user'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </section>

                <section className="hero-banner mt-50">
                    <Container >
                        <h5>Withdrow fund</h5>
                        <Row>
                            <Form>
                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" style={{ cursor: "pointer" }} onClick={withdraw} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text">{isLoading ? 'Loading...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Form>
                        </Row>
                    </Container>
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
    )
}