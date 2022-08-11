import React from 'react'
import { useState, useContext } from "react";
import Head from "next/head";
import { Loader, DialogBox } from "../Components/index";
import { RecruitContext } from "../context/RecruitContext";
import Link from 'next/link'
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
        setFormData
    } = useContext(RecruitContext);

    const [selectPayForLevelUp, setPayForLevelUp] = useState(null);

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
                <header
                    className="primary-header"
                    style={{ backgroundImage: "url(./images/header-lens.png)" }}
                >
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
                            {
                                recruits &&
                                recruits.map((recruit) => (

                                    <Col key={recruit.id} onClick={() => handleTokenSelection(recruit)}>
                                        <Card style={{ width: '18rem' }}
                                            bg={selectedToken && selectedToken.id == recruit.id ? 'light' : 'dark'}
                                            text={selectedToken && selectedToken.id == recruit.id ? 'dark' : 'white'}
                                            border={selectedToken && selectedToken.id == recruit.id ? 'primary' : ''}
                                        >
                                            <Card.Img src={recruit.url} alt="Card image" />
                                            <Card.ImgOverlay>
                                                <Card.Title> ID : {recruit.id}</Card.Title>
                                                <Card.Title> Title : {recruit.title}</Card.Title>
                                                <Card.Text> LELEV : {recruit.level}
                                                </Card.Text>
                                            </Card.ImgOverlay>
                                        </Card>
                                    </Col>

                                ))
                            }
                            {(!recruits || recruits.length === 0) && <h4 style={{ color: "white" }}>YOU DO NO HAVE ANY RECRUIT YET</h4>}
                        </Row>
                    </Container>


                    <Container className="mt-50">
                        {(selectedToken && selectedToken.id && !selectPayForLevelUp) && <Row>
                            <span onClick={() => handleTokenSelection(null)} style={{ color: "white" }}>{'<< Back'}</span>
                            <Col>
                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" onClick={levelUp} disabled={isLoading} >
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'Level up'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Col>

                            <Col>
                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" disabled={isLoading} onClick={() => setPayForLevelUp(true)}>
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'Pay For Level Up'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Col>
                        </Row>}
                    </Container>

                    <Container className="mt-50">
                        {selectPayForLevelUp && <Row>
                            <span onClick={() => setPayForLevelUp(false)} style={{ color: "white" }}>{'<< Back'}</span>
                            <Col>
                                <Button variant="secondary" size="lg" onClick={increaseLevel}>
                                    +
                                </Button>
                                <Badge bg="secondary">{formData.level}</Badge>
                                <Button variant="secondary" size="lg" disabled={formData.level === 1} onClick={decreaseLevel}>
                                    -
                                </Button>
                            </Col>
                            <Col>
                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button">
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="">{(formData.level * levelUpprice).toFixed(4)} ETH</span>
                                        </span>
                                    </a>
                                </div>
                            </Col>

                            <Col>
                                <div className="d-flex align-items-center justify-content-around">
                                    <a className="button --white-button" disabled={isLoading} onClick={payForLevelUp}>
                                        <img src="/images/white-button.svg" alt="" />
                                        <span className="text d-flex align-items-center justify-content-center">
                                            <span className="text" style={{ cursor: "pointer" }}>{isLoading ? 'In progress ...' : 'Submit'}</span>
                                        </span>
                                    </a>
                                </div>
                            </Col>

                        </Row>}
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
