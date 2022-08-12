import React from 'react'
import { useState, useContext } from "react";
import Head from "next/head";
import { Loader, DialogBox } from "../Components/index";
import { RecruitContext } from "../context/RecruitContext";
import Link from 'next/link'
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';

export default function Nfts() {
    const closeDilod = () => {
        cleanUp();
    };

    const {
        currentAccount,
        connectWallet,
        shortAddress,
        dialog,
        cleanUp,
        recruits,
        formData,
        maxLevel,
        levelUpprice,
        selectedToken,
        handleTokenSelection,
        levelUp,
        payForLevelUp,
        isLoading,
        setFormData,
        availableFreeLevel
    } = useContext(RecruitContext);

    const [selectPayForLevelUp, setPayForLevelUp] = useState(null);

    const [upgradeOption, setUpgradeOption] = useState(null);


    const increaseLevel = () => {
        if (formData.level + selectedToken.level >= maxLevel)
            return;

        const data = { ...formData }
        data.level++;
        setFormData(data)
    }

    const decreaseLevel = () => {
        if (formData.level <= 1)
            return;

        const data = { ...formData }
        data.level--;
        setFormData(data)
    }



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
                <header className="primary-header">
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-md-4">
                                <div>
                                    <DialogBox
                                        closeDilod={closeDilod}
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
                <section className="hero-banner">
                    <Container>
                        <Row>
                            <h4 className="text-center fc-white ls-large">PROFILE</h4>
                            {
                                recruits &&
                                recruits.map((recruit) => (

                                    <Col className="mtpx-20" key={recruit.id}>
                                        <Card className="nft-card"
                                            bg={selectedToken && selectedToken.id == recruit.id ? '' : ''}
                                            text={selectedToken && selectedToken.id == recruit.id ? '' : ''}
                                            border={selectedToken && selectedToken.id == recruit.id ? '' : ''}
                                        >
                                            <Card.Img src={recruit.url} alt="Card image" />
                                            <Card.Body>
                                                <Card.Title className="fc-primary fw-bold"> ID : {recruit.id}</Card.Title>
                                                <Card.Title className="fc-primary fw-bold"> TITLE : {recruit.title}</Card.Title>
                                                <Card.Title className="fc-primary fw-bold"> LEVEL : {recruit.level}</Card.Title>
                                            </Card.Body>
                                        </Card>

                                        <a className="button d-inline-flex" onClick={() => handleTokenSelection(recruit)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 291 70">
                                                <g id="Path_22692" data-name="" fill="rgba(238,165,0,0.4)">
                                                    <path d="M 275.8393249511719 59.5 L 0.5 59.5 L 0.5 16.32163619995117 L 15.21776866912842 0.5 L 290.5 0.5 L 290.5 44.79335021972656 L 275.8393249511719 59.5 Z" stroke="none"></path>
                                                    <path d="M 15.435546875 1 L 1 16.51826095581055 L 1 59 L 275.6317443847656 59 L 290 44.58668518066406 L 290 1 L 15.435546875 1 M 15 0 L 291 0 L 291 45 L 276.046875 60 L 0 60 L 0 16.12503814697266 L 15 0 Z" stroke="none" fill="#eea500"></path>
                                                </g>
                                            </svg>
                                            <span className="d-flex align-items-center justify-content-center">
                                                <span className="text fc-white" style={{ cursor: "pointer" }}>UPGRADE</span>
                                            </span>
                                        </a>
                                    </Col>

                                ))
                            }
                            {(!recruits || recruits.length === 0) && <h6 style={{ color: "white" }} className="mtpx-60 text-center">YOU DO NO HAVE ANY RECRUIT YET</h6>}

                        </Row>
                    </Container>


                    <Container className="mt-50">

                        <Modal show={selectedToken && selectedToken.id} onHide={() => handleTokenSelection(null)} animation={false} backdrop="static">
                            <Modal.Header closeButton>

                            </Modal.Header>
                            {(selectedToken && selectedToken.id) &&
                                <Row >
                                    <h6 className="mtpx-60 text-center fc-white margin-bottom-40">UPGRADE YOUR LEVEL</h6>
                                    <Col>
                                        <div className="d-flex align-items-center justify-content-around">
                                            <a className="button" onClick={() => setUpgradeOption(1)} >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="210" height="48" viewBox="0 0 291 70">
                                                    <g id="Path_22691" data-name="" fill="rgba(77,255,255,0.48)">
                                                        <path d="M 290.5 59.5 L 15.16070938110352 59.5 L 0.5 44.79335021972656 L 0.5 0.5 L 275.7822265625 0.5 L 290.5 16.32163619995117 L 290.5 59.5 Z" stroke="none"></path>
                                                        <path d="M 1 1 L 1 44.58668518066406 L 15.36825561523438 59 L 290 59 L 290 16.51826095581055 L 275.564453125 1 L 1 1 M 0 0 L 276 0 L 291 16.12503814697266 L 291 60 L 14.953125 60 L 0 45 L 0 0 Z" stroke="none" fill="#4dffff"></path>
                                                    </g>
                                                </svg>
                                                <span className="d-flex align-items-center justify-content-center">
                                                    <span className="text fc-white" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'FREE UPGRADE'}</span>
                                                </span>
                                            </a>
                                        </div>
                                    </Col>

                                    <Col>
                                        <div className="d-flex align-items-center justify-content-around">
                                            <a className="button" onClick={() => setUpgradeOption(2)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 291 70">
                                                    <g id="Path_22692" data-name="" fill="rgba(238,165,0,0.4)">
                                                        <path d="M 275.8393249511719 59.5 L 0.5 59.5 L 0.5 16.32163619995117 L 15.21776866912842 0.5 L 290.5 0.5 L 290.5 44.79335021972656 L 275.8393249511719 59.5 Z" stroke="none"></path>
                                                        <path d="M 15.435546875 1 L 1 16.51826095581055 L 1 59 L 275.6317443847656 59 L 290 44.58668518066406 L 290 1 L 15.435546875 1 M 15 0 L 291 0 L 291 45 L 276.046875 60 L 0 60 L 0 16.12503814697266 L 15 0 Z" stroke="none" fill="#eea500"></path>
                                                    </g>
                                                </svg>
                                                <span className="d-flex align-items-center justify-content-center">
                                                    <span className="text fc-white" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'BUY UPGRADE'}</span>
                                                </span>
                                            </a>
                                        </div>
                                    </Col>
                                </Row>}
                            {upgradeOption === 1 && <Row >
                                <Row>

                                    <Row>
                                        <h6 className="mtpx-60 text-center fc-white margin-bottom-40">{availableFreeLevel == 4 ? "LIEUTENANT LEVEL AVAILABLE" : availableFreeLevel == 3 ? "2ND OFFICER LEVEL AVAILABLE" : availableFreeLevel == 2 ? "1ST OFFICER LEVEL AVAILABLE" : "NO FREE UPGRADE AVAILABE"}</h6>
                                    </Row>
                                    <Row>
                                        <div className="d-flex align-items-center justify-content-around">
                                            <a className="button" onClick={levelUp} disabled={isLoading || !availableFreeLevel  || (typeof (canLevelUp) == "undefined")} >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 291 70">
                                                    <g id="Path_22692" data-name="" fill="rgba(238,165,0,0.4)">
                                                        <path d="M 275.8393249511719 59.5 L 0.5 59.5 L 0.5 16.32163619995117 L 15.21776866912842 0.5 L 290.5 0.5 L 290.5 44.79335021972656 L 275.8393249511719 59.5 Z" stroke="none"></path>
                                                        <path d="M 15.435546875 1 L 1 16.51826095581055 L 1 59 L 275.6317443847656 59 L 290 44.58668518066406 L 290 1 L 15.435546875 1 M 15 0 L 291 0 L 291 45 L 276.046875 60 L 0 60 L 0 16.12503814697266 L 15 0 Z" stroke="none" fill="#eea500"></path>
                                                    </g>
                                                </svg>
                                                <span className="d-flex align-items-center justify-content-center">
                                                    <span className="text fc-white" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'Submit'}</span>
                                                </span>
                                            </a>
                                        </div>
                                    </Row>
                                </Row>
                            </Row>}
                            {upgradeOption === 2 && <Row>
                                <Row>
                                    <Col>
                                        <h5 className="fc-white tt-uppercase ls-large text-center mbpx-20">BUY UPGRADE</h5>
                                    </Col>
                                </Row>

                                <div className="align-items-center flex-col">
                                    <p className="text-center fc-white mbpx-6">Times to Mint</p>
                                    <div className="modal-counter">

                                        <Button variant="secondary" size="lg" disabled={formData.level === 1} onClick={decreaseLevel}>
                                            -
                                        </Button>

                                        <Badge bg="">{formData.level}</Badge>

                                        <Button variant="secondary" size="lg" onClick={increaseLevel}>
                                            +
                                        </Button>
                                    </div>


                                    <div className="d-flex align-items-center justify-content-around">
                                        <div className="mb-3">
                                            <p className="text-center fc-white fs-large">Times to Mint</p>
                                            <span className="d-flex align-items-center justify-content-center">
                                                <span className="fc-primary counter-text">{(formData.level * levelUpprice).toFixed(4)} ETH</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Row>
                                    <div className="d-flex align-items-center justify-content-around">
                                        <a className="button" disabled={isLoading} onClick={payForLevelUp}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 291 70">
                                                <g id="Path_22692" data-name="" fill="rgba(238,165,0,0.4)">
                                                    <path d="M 275.8393249511719 59.5 L 0.5 59.5 L 0.5 16.32163619995117 L 15.21776866912842 0.5 L 290.5 0.5 L 290.5 44.79335021972656 L 275.8393249511719 59.5 Z" stroke="none"></path>
                                                    <path d="M 15.435546875 1 L 1 16.51826095581055 L 1 59 L 275.6317443847656 59 L 290 44.58668518066406 L 290 1 L 15.435546875 1 M 15 0 L 291 0 L 291 45 L 276.046875 60 L 0 60 L 0 16.12503814697266 L 15 0 Z" stroke="none" fill="#eea500"></path>
                                                </g>
                                            </svg>
                                            <span className="d-flex align-items-center justify-content-center">
                                                <span className="text fc-white" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'Submit'}</span>
                                            </span>
                                        </a>
                                    </div>
                                </Row>

                            </Row>}
                            <Modal.Body>
                            </Modal.Body>
                        </Modal>
                    </Container>

                </section>



                <section className="primary-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2">
                                <ul className="unstyled social-media">
                                    <li>
                                        <a href="#">
                                            <img src="/images/discord.svg" alt="" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="/images/facebook.svg" alt="" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="/images/instagram.svg" alt="" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <img src="/images/twitter.svg" alt="" />
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-lg-4">
                                <ul className="unstyled footer-links">
                                    <li>
                                        <Link href="#">
                                            <a>Astro Must Main Website</a>
                                        </Link>
                                    </li>
                                    <li>
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
