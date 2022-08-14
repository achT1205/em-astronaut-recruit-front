import React, { useEffect, useState, useCallback } from "react";
import { signIn, signOut } from "next-auth/react";
import { providers, ethers } from 'ethers'
import axios from "axios";
import { recruitABI } from "../constants/abi";
import { whiteListUser } from "../constants/users";
import Web3Modal from "web3modal";

const ERROR_LIST = [
  "INVALID_SIGNATURE",
  "INVALID_MESSAGE",
  "THIS TOKEN WAS BURNED",
  "NEED TO LEVELUP TO LIEUTENANT",
  "VIP SALE PERIOD",
  "0 IS NOT A CORRECT ADDRESS",
  "QUANTITY_EXCEEDED",
  "0 IS NOT A CORRECT ADDRESS",
  "0 IS NOT VALID QUANTIIY",
  "NOT_ENOUG_FUND",
  "VIP SALE PERIOD OVER",
  "VIP_SALE_QUANTITY_EXCEEDED",
  "NOT OWNER",
  "REACHED_MAXIMUM_LEVEL",
  "LEVEL_CAN_NOT_BE_0",
  "THE 2 ARRAYS SHOULD HAVE THE SAME LENGTH",
  "0 IS NOT A VALID ADDRESS"

]

export const RecruitContext = React.createContext("Recruit");
const config = {
  baseURL: process.env.NEXT_PUBLIC_API_URI,
  headers: {
    "Content-Type": "application/json",
  }
};

const twitterConfig = {
  baseURL: process.env.REACT_TWITTER_API_URI,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_TWITTER_BEARER_TOKEN}`
  },
};

let provider;
let signer;
let web3Modal;

export const apiClient = axios.create(config);
//export const twitterClient = axios.create(twitterConfig);
//apiClient.defaults.headers.common['Authorization'] = process.env.NEXT_PUBLIC_API_KEY;
const getRecruitContract = () => {
  const contact = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    recruitABI,
    signer
  );
  return contact;
};

export const RecruitProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [shortAddress, setShortAddress] = useState(null);
  const [discordUser, setDiscordUser] = useState(null);
  const [twitterUser, setTwitterUser] = useState(null);
  const [discordUserInfos, setDiscordUserInfos] = useState(null);
  const [twitterUserInfos, setTwitterUserInfos] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isListed, setIsListed] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [unitPrice, setUnitPrice] = useState(null);
  const [unitFormatedPrice, setUnitFormatedPrice] = useState(null);
  const [hasFreeMinted, setHasFreeMinted] = useState(null);
  const [formData, setFormData] = useState({ amount: 1, level: 1, freeMintWallet: null, hasFinishedGame: false, goldenVip: false, vipMintWallet: null, isVip: false });
  const [recruits, setRecruits] = useState(null);
  const [maxLevel, setMaxLevel] = useState(null);
  const [levelUpprice, setLevelUpprice] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [vipSaleStartTime, setVipSaleStartTime] = useState(null);
  const [vipMintingPeriod, setVipMintingPeriod] = useState(null);
  const [isOperator, setIsOperator] = useState(null);
  const [availableFreeLevel, setAvailableFreeLevel] = useState(null);


  const handleTokenSelection = (item) => {
    if (item && item.level === maxLevel) {
      const dialog = {
        title: "MAX LEVEL REACHED",
        message: 'This recruit is already a LIEUTENANT',
        type: 'danger'
      }
      setDialog(dialog)
      return
    }
    setSelectedToken(item)
  }

  const logOut = (redirect = false, to = '/registration') => {
    if (redirect)
      signOut({ redirect: redirect, callbackUrl: to })
    else
      signOut({ redirect: redirect })
    localStorage.clear()
    setDiscordUser(null)
    setTwitterUser(null)
  }

  const completeRegistration = async () => {
    setDialog(null)
    setIsLoading(true)
    if (!provider) {
      const dialog = {
        title: "NOT METAMASK DETECTED",
        message: 'Please install METAMASK',
        type: 'danger'
      }
      setDialog(dialog)

      logOut('/')
      setIsLoading(false)
      return;
    }

    const network = await provider.getNetwork()
    const { chainId } = network;
    if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
      const dialog = {
        title: "CHAIN ERROR",
        message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
        type: 'danger'
      }
      setDialog(dialog)
      logOut()
      setIsLoading(false)
      return;
    }

    if (!currentAccount) {
      const dialog = {
        title: "WALLET ERROR",
        message: `Please connect your wallet`,
        type: 'danger'
      }
      setDialog(dialog)

      logOut()
      setIsLoading(false)
      return;
    }

    if (!twitterUser) {
      const dialog = {
        title: "Must Follow on twitter",
        message: "Follow as on twitter to continue",
        type: 'danger'
      }
      setDialog(dialog)

      setIsLoading(false)
      return
    }

    if (!discordUser) {
      const dialog = {
        title: "Must join discord",
        message: "Join our discord to continue",
        type: 'danger'
      }
      setDialog(dialog)

      setIsLoading(false)
      return
    }
    const user = {
      "discordHandler": discordUser.username,
      "discordProfilePicture": discordUser.picture,
      "discordId": discordUser.id,
      "twitterHandler": twitterUser.username,
      "twitterProfilePicture": twitterUser.picture,
      "twitterId": twitterUser.id,
      "walletId": currentAccount,
    };
    try {
      await apiClient.post(`/players`, user)
      setIsLoading(false);
      const dialog = {
        title: "Registration",
        message: "Registration completed successfully",
        type: 'success'
      }
      setDialog(dialog)
      window.location.href = process.env.NEXTAUTH_URL;
    } catch (error) {
      console.log(error);
      const dialog = {
        title: "Error",
        message: error.message,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
    }

  }

  const handleChange = (e, name, type) => {
    if (type === 'checkbox')
      setFormData((prevState) => ({ ...prevState, [name]: e.target.checked }));
    else
      setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    console.log('formData', formData)
  };

  const addUserForFreeMint = async () => {
    setDialog(null)
    setIsLoading(true)
    const { freeMintWallet, hasFinishedGame } = formData;

    if (!isOperator) {
      const dialog = {
        title: "Forbidden",
        message: 'Only operator can do this action',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    if (!freeMintWallet) {
      const dialog = {
        title: "Parrameter error",
        message: 'Please enter a correct wallet address',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }



    try {
      await apiClient.put(`/players/${freeMintWallet}`, { walletId: freeMintWallet, hasFinishedGame: hasFinishedGame })
      const dialog = {
        title: "White list updated",
        message: hasFinishedGame ? `User ${freeMintWallet} is now whitelisted` : `User ${freeMintWallet} is now removed from the whitelist`,
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false)
    } catch (error) {
      const dialog = {
        title: "Error",
        message: error.message,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
    }
  }


  const addGoldenVip = async () => {
    setDialog(null)
    setIsLoading(true)
    const { goldenVipWallet, goldenVip } = formData;

    if (!isOperator) {
      const dialog = {
        title: "Forbidden",
        message: 'Only operator can do this action',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    if (!goldenVipWallet) {
      const dialog = {
        title: "Parrameter error",
        message: 'Please enter a correct wallet address',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }



    try {
      await apiClient.put(`/players/${goldenVipWallet}`, { walletId: goldenVipWallet, goldenVip: goldenVip })
      const dialog = {
        title: "Golden VIP",
        message: goldenVip ? `User ${goldenVipWallet} is now Golden VIP` : `User ${goldenVipWallet} is now removed from the Golden VIP list`,
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false)
    } catch (error) {
      const dialog = {
        title: "Error",
        message: error.message,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
    }
  }




  const addUserForVipMint = async () => {
    setDialog(null)
    setIsLoading(true)
    const { vipMintWallet, isVip } = formData;

    if (!isOperator) {
      const dialog = {
        title: "Forbidden",
        message: 'Only operator can do this action',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    if (!vipMintWallet) {
      const dialog = {
        title: "Parrameter error",
        message: 'Please enter a correct wallet address',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    try {
      await apiClient.put(`/players/${vipMintWallet}`, { walletId: vipMintWallet, isVip: isVip })
      const dialog = {
        title: "White list updated",
        message: isVip ? `User ${vipMintWallet} is now whitelisted` : `User ${vipMintWallet} is now removed from the whitelist`,
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false)
    } catch (error) {
      const dialog = {
        title: "Error",
        message: error.message,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
    }
  }

  const addUserForLevelUp = async () => {
    setDialog(null)
    setIsLoading(true)
    const { levelUpWallet, canLevelUp, level } = formData;

    if (!isOperator) {
      const dialog = {
        title: "Forbidden",
        message: 'Only operator can do this action',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    if (!levelUpWallet) {
      const dialog = {
        title: "Parrameter error",
        message: 'Please enter a correct wallet address',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    if (level < 1 || level > maxLevel) {
      const dialog = {
        title: "Level error",
        message: 'level should be : 1<= level <= 4',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    try {

      await apiClient.put(`players/${levelUpWallet}`, { walletId: levelUpWallet, canLevelUp: canLevelUp, level: level })

      const dialog = {
        title: "White list updated",
        message: canLevelUp ? `User ${levelUpWallet} is now allowed to levelup` : `User ${levelUpWallet} is now denied to levelup`,
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false)
    } catch (error) {
      const dialog = {
        title: "Error",
        message: error.message,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
    }
  }

  const addOperator = async () => {
    setDialog(null)
    setIsLoading(true)
    const { operatoWallet, approved } = formData;

    if (!isOperator) {
      const dialog = {
        title: "Forbidden",
        message: 'Only operator can do this action',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    if (!operatoWallet) {
      const dialog = {
        title: "Parrameter error",
        message: 'Please enter a correct wallet address',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    try {
      const recruitContract = getRecruitContract();
      const transaction = await recruitContract.setOperator(operatoWallet, approved);
      setIsLoading(true);
      console.log(`Loading - ${transaction.hash}`);
      await transaction.wait();
      console.log(`Success - ${transaction.hash}`);
      setShowBuyOptions(false)
      await loadNftInfo(currentAccount)
      const dialog = {
        title: "Success Operation",
        message: approved ? `${operatoWallet} is now operator` : `${operatoWallet} is not operator anymore`,
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false);
    } catch (error) {
      const dialog = {
        title: "ERROR",
        message: formatError(error),
        type: 'danger'
      }
      setDialog(dialog)
      setShowBuyOptions(false)
      console.log(error);
    }
  }

  const withdraw = async () => {
    setDialog(null)
    setIsLoading(true)

    try {
      const recruitContract = getRecruitContract();
      const transaction = await recruitContract.withdraw();
      setIsLoading(true);
      console.log(`Loading - ${transaction.hash}`);
      await transaction.wait();
      console.log(`Success - ${transaction.hash}`);
      await loadNftInfo(currentAccount)
      const dialog = {
        title: "Success Operation",
        message: 'Withdrawed funds',
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false);
    } catch (error) {
      const dialog = {
        title: "ERROR",
        message: formatError(error),
        type: 'danger'
      }
      setDialog(dialog)
      console.log(error);
    }
  }


  const loadBatchUser = async () => {
    setDialog(null)
    setIsLoading(true)

    if (!isOperator) {
      const dialog = {
        title: "Forbidden",
        message: 'Only operator can do this action',
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return
    }

    try {

      const responses = await Promise.all(
        whiteListUser.map(async id => {
          const resp = await apiClient.put(`/players/${id}`, { walletId: id, goldenVip: true , isVip: true})
        })
      );

      const dialog = {
        title: "Success Operation",
        message: 'users uploaded',
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false);
    } catch (error) {
      const dialog = {
        title: "ERROR",
        message: formatError(error),
        type: 'danger'
      }
      setDialog(dialog)
      console.log(error);
    }
  }

  const handleSignIn = async (authProvider) => {
    setDialog(null)
    if (!provider) {
      const dialog = {
        title: "NOT METAMASK DETECTED",
        message: `Please install METAMASK`,
        type: 'danger'
      }
      setDialog(dialog)

      logOut('/')
      setIsLoading(false)
      return;
    }

    const network = await provider.getNetwork()
    const { chainId } = network;
    if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
      const dialog = {
        title: "CHAIN ERROR",
        message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
        type: 'danger'
      }
      setDialog(dialog)
      logOut()
      return;
    }

    if (!currentAccount) {
      const dialog = {
        title: "WALLET ERROR",
        message: `Please connect your wallet`,
        type: 'danger'
      }
      setDialog(dialog)
      logOut()
      return;
    }
    signIn(authProvider, { callbackUrl: process.env.NEXT_PUBLIC_CALLBACK })
  }

  const handleSignOut = (provider) => {
    signOut({ redirect: false })
    if (provider === 'twitter') {
      localStorage.removeItem("twitterUser")
      setTwitterUser(null)
    }
    if (provider === 'discord') {
      localStorage.removeItem("discordUser")
      setDiscordUser(null)
    }
  }

  const connectWallet = useCallback(async () => {
    setDialog(null)
    try {
      web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      provider = new providers.Web3Provider(connection)
      signer = provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      const { chainId } = network;
      if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
        const dialog = {
          title: "CHAIN ERROR",
          message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
          type: 'danger'
        }
        setDialog(dialog)

        logOut()
        return;
      }
      if (address) {
        const resp = await apiClient.get(`/players/${address}`)
        if (resp && resp.data) {
          const { twitterHandler, discordHandler, discordId, twitterId, twitterProfilePicture, discordProfilePicture } = resp.data
          if (typeof window !== "undefined") {
            const localtwitter = localStorage.getItem('twitterUser')
            if (localtwitter && !twitterUser) {
              setTwitterUser(JSON.parse(localtwitter))
            } else if (!localtwitter && !twitterUser) {
              setTwitterUser({
                id: twitterId,
                picture: twitterProfilePicture,
                username: twitterHandler

              })
            }
            const localdiscord = localStorage.getItem('discordUser')
            if (localdiscord && !discordUser) {
              setDiscordUser(JSON.parse(localdiscord))
            } else if (!localdiscord && !discordUser) {
              setDiscordUser({
                id: discordId,
                picture: discordProfilePicture,
                username: discordHandler

              })
            }
          }

        }
        else {
          if (typeof window !== "undefined") {
            const localtwitter = localStorage.getItem('twitterUser')
            if (localtwitter && !twitterUser)
              setTwitterUser(JSON.parse(localtwitter))
            const localdiscord = localStorage.getItem('discordUser')
            if (localdiscord && !discordUser) setDiscordUser(JSON.parse(localdiscord))
          }
        }
      }

      setIsListed(false);
      setCurrentAccount(address);
      const shortAddr = `${address.substring(0, 10)}...${address.substring(address.length - 10, address.length)}`
      setShortAddress(shortAddr)

    }

    catch (error) {
      console.log(error);
      const dialog = {
        title: "METAMASK ERROR",
        message: error.message === "User Rejected" ? "Please connect your METAMASK" : error.message,
        type: 'danger'
      }
      setDialog(dialog)
    }
  }, []);



  useEffect(() => {
    loadNftInfo(currentAccount);
  }, [currentAccount]);

  useEffect(() => {
    if (twitterUserInfos) {
      const user = {
        username: twitterUserInfos.profile.username,
        picture: twitterUserInfos.profile.profile_image_url,
        accessToken: twitterUserInfos.accessToken,
        refreshToken: twitterUserInfos.refreshToken,
        id: twitterUserInfos.profile.id
      }
      localStorage.setItem('twitterUser', JSON.stringify(user))
    }
  }, [twitterUserInfos])

  useEffect(() => {
    if (discordUserInfos) {
      const user = {
        username: discordUserInfos.name,
        picture: discordUserInfos.picture,
        accessToken: discordUserInfos.discord.accessToken,
        refreshToken: discordUserInfos.discord.refreshToken,
        id: discordUserInfos.sub
      }
      localStorage.setItem('discordUser', JSON.stringify(user))
    }
  }, [discordUserInfos])

  const cleanUp = () => {
    setDialog(null)
  };

  const claimRecruit = async () => {
    setDialog(null)
    if (!provider) {
      const dialog = {
        title: "NOT METAMASK DETECTED",
        message: `Please install METAMASK`,
        type: 'danger'
      }
      setDialog(dialog)

      logOut('/')
      setIsLoading(false)
      return;
    }

    const network = await provider.getNetwork()
    const { chainId } = network;
    if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
      const dialog = {
        title: "CHAIN ERROR",
        message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
        type: 'danger'
      }
      setDialog(dialog)

      logOut()
      return;
    }

    if (hasFreeMinted) {
      const dialog = {
        title: "Alredy Minted",
        message: `You have alredy minted a recruit`,
        type: 'info'
      }
      setDialog(dialog)

      return;
    }

    if (!currentAccount) {
      const dialog = {
        title: "WALLET ERROR",
        message: `Please connect your wallet`,
        type: 'danger'
      }
      setDialog(dialog)
      logOut()
      return;
    }

    const freemintSignature = await apiClient.get(`players/${currentAccount}/free-mint-signature`);
    if (!freemintSignature ||
      !freemintSignature.data ||
      !freemintSignature.data.hashedMessage) {
      const error = freemintSignature.data.message
      if (error === "did not complete profile yet.") {
        window.location.href = `${process.env.NEXTAUTH_URL}registration`;
        return
      }
      console.log(error);
      const dialog = {
        title: "ERROR",
        message: error,
        type: 'danger'
      }
      setDialog(dialog)
      setShowBuyOptions(false)
      return;
    }
    const { hashedMessage, signature, timestamp } = freemintSignature.data;
    try {
      const recruitContract = getRecruitContract();
      const messageHashBinary = Buffer.from(hashedMessage, 'base64')
      const transaction = await recruitContract.safeMint(
        messageHashBinary,
        signature,
        timestamp
      );
      setIsLoading(true);
      console.log(`Loading - ${transaction.hash}`);
      await transaction.wait();
      console.log(`Success - ${transaction.hash}`);
      setShowBuyOptions(false)
      const dialog = {
        title: "Success Free mint",
        message: 'Your recruit was minted successfully !',
        type: 'success'
      }
      window.location.href = `${process.env.NEXTAUTH_URL}`;
      setDialog(dialog)
      setIsLoading(false);


    } catch (error) {
      const dialog = {
        title: "ERROR",
        message: formatError(error),
        type: 'danger'
      }
      setDialog(dialog)
      setShowBuyOptions(false)
      console.log(error);
    }
  };

  const formatError = (e) => {
    let message = e.message;
    ERROR_LIST.forEach(error => {
      let err = e.toString()
      if (err.indexOf(error) > -1) {
        message = error;
      }
    });
    return message;

  }

  const buyRecuit = async () => {
    setIsLoading(true);
    setDialog(null)
    if (!provider) {
      const dialog = {
        title: "NOT METAMASK DETECTED",
        message: 'Please install METAMASK',
        type: 'danger'
      }
      setDialog(dialog)
      logOut('/')
      setIsLoading(false)
      setShowBuyOptions(false)
      return;
    }

    const network = await provider.getNetwork()
    const { chainId } = network;
    if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
      const dialog = {
        title: "CHAIN ERROR",
        message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      logOut()
      return;
    }

    if (!currentAccount) {
      const dialog = {
        title: "WALLET ERROR",
        message: `Please connect your wallet`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      logOut()
      return;
    }

    try {

      const now = Math.floor(Date.now() / 1000);
      const recruitContract = getRecruitContract();
      const { amount } = formData;
      const total = ethers.utils.parseEther((parseInt(amount) * unitPrice).toString())
      let transaction;
      if (now - vipSaleStartTime <= vipMintingPeriod) {

        const vipmintSignature = await apiClient.get(`players/${currentAccount}/vip-signature`);
        if (!vipmintSignature || !vipmintSignature.data || vipmintSignature.data.message) {
          const dialog = {
            title: "Not VIP member",
            message: vipmintSignature.data.message,
            type: 'danger'
          }
          setDialog(dialog)
          setIsLoading(false);
          return
        }
        if (vipmintSignature && vipmintSignature.data) {
          const { hashedMessage, signature, timestamp } = vipmintSignature.data
          const messageHashBinary = Buffer.from(hashedMessage, 'base64')
          transaction = await recruitContract.vipSale(
            parseInt(amount),
            messageHashBinary,
            signature,
            timestamp,
            { value: total });
        }
      }
      else {
        transaction = await recruitContract.buyRecuit(
          parseInt(amount),
          { value: total });
      }

      console.log(`Loading - ${transaction.hash}`);
      await transaction.wait();
      console.log(`Success - ${transaction.hash}`);

      setShowBuyOptions(false)
      window.location.href = `${process.env.NEXTAUTH_URL}`;
      const dialog = {
        title: "Success mint",
        message: 'Your recruit was minted successfully !',
        type: 'success'
      }
      setDialog(dialog)
      setIsLoading(false);
    } catch (error) {
      const dialog = {
        title: "ERROR",
        message: error.message,
        type: 'danger'
      }
      setDialog(dialog)
      setShowBuyOptions(false)
      setIsLoading(false)
      console.log(error);
    }
  };

  const levelUp = async () => {
    setIsLoading(true);
    setDialog(null)
    if (!provider) {
      const dialog = {
        title: "NOT METAMASK DETECTED",
        message: `Please install METAMASK`,
        type: 'danger'
      }
      setDialog(dialog)
      logOut('/')
      setIsLoading(false)
      return;
    }

    const network = await provider.getNetwork()
    const { chainId } = network;
    if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
      const dialog = {
        title: "CHAIN ERROR",
        message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false);
      logOut()
      return;
    }

    if (!currentAccount) {
      const dialog = {
        title: "WALLET ERROR",
        message: `Please connect your wallet`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false);
      logOut()
      return;
    }
    if (!availableFreeLevel || (typeof (availableFreeLevel) == "undefined")) {
      const dialog = {
        title: "Can no upgrade",
        message: "No free upgrade available",
        type: 'danger'
      }
      console.log(dialog)
      setIsLoading(false);
      setDialog(dialog)
      return;
    }

    if (selectedToken.level == maxLevel) {
      return;
    }

    if (selectedToken.level !== (availableFreeLevel - 1)) {
      const dialog = {
        title: "Can no upgrade",
        message: "Can only upgrade one level at the time",
        type: 'danger'
      }
      console.log(dialog)
      setIsLoading(false);
      setDialog(dialog)
      return;
    }


    const levelUpSignature = await apiClient.get(`players/${currentAccount}/levelup-signature`);
    let hashedMessage, signature, timestamp, level;
    if (!levelUpSignature ||
      !levelUpSignature.data ||
      !levelUpSignature.data.hashedMessage) {
      const error = levelUpSignature.data.message
      console.log(error);
      const dialog = {
        title: "Level up signature",
        message: error,
        type: 'danger'
      }
      console.log(dialog)
      setIsLoading(false);
      setDialog(dialog)
      return;
    }
    else {
      hashedMessage = levelUpSignature.data.hashedMessage;
      signature = levelUpSignature.data.signature;
      timestamp = levelUpSignature.data.timestamp;
      level = levelUpSignature.data.level;
    }



    try {

      await apiClient.put(`/players/${currentAccount}`, {
        walletId: currentAccount,
        canLevelUp: false,
        level: 0
      })


      const recruitContract = getRecruitContract();
      const messageHashBinary = Buffer.from(hashedMessage, 'base64')
      const transaction = await recruitContract.levelUp(
        messageHashBinary,
        signature,
        timestamp,
        selectedToken.id,
        level);
      setIsLoading(true);
      console.log(`Loading - ${transaction.hash}`);
      await transaction.wait();
      console.log(`Success - ${transaction.hash}`);

      window.location.href = `${process.env.NEXTAUTH_URL}nfts`;
      setIsLoading(false);
      const dialog = {
        title: "Level updated.",
        message: `Your recruit level is now ${selectedToken.level + 1}!`,
        type: 'success'
      }
      setDialog(dialog)
      handleTokenSelection(null)
    }
    catch (error) {
      console.log(error);
      const dialog = {
        title: "ERROR",
        message: error.message,
        type: 'danger'
      }
      setIsLoading(false)
      setDialog(dialog)
    }

  }

  const payForLevelUp = async () => {
    setIsLoading(true)
    setDialog(null)
    if (!provider) {
      const dialog = {
        title: "NOT METAMASK DETECTED",
        message: `Please install METAMASK`,
        type: 'danger'
      }
      setDialog(dialog)
      logOut('/')
      setIsLoading(false)
      return;
    }

    const network = await provider.getNetwork()
    const { chainId } = network;
    if (chainId != process.env.NEXT_PUBLIC_CHAIN_ID) {
      const dialog = {
        title: "CHAIN ERROR",
        message: `Please change to ${process.env.NEXT_PUBLIC_CHAIN_NAME}`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      logOut()
      return;
    }

    if (!currentAccount) {
      const dialog = {
        title: "WALLET ERROR",
        message: `Please connect your wallet`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      logOut()
      return;
    }

    const { level } = formData;
    if (selectedToken.level + parseInt(level) > maxLevel) {
      const dialog = {
        title: "Level exceeded",
        message: `Maximum level exceeded (${maxLevel})`,
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false)
      return;
    }

    try {
      const recruitContract = getRecruitContract();
      const total = ethers.utils.parseEther((parseInt(level) * levelUpprice).toString())
      const transaction = await recruitContract.payForlevelUp(selectedToken.id, level, { value: total })
      setIsLoading(true);
      console.log(`Loading - ${transaction.hash}`);
      await transaction.wait();
      console.log(`Success - ${transaction.hash}`);
      setIsLoading(false);
      const dialog = {
        title: "Level updated",
        message: `Your recruit level is now ${selectedToken.level + level}!`,
        type: 'success'
      }
      setDialog(dialog)
      window.location.href = `${process.env.NEXTAUTH_URL}nfts`;
      handleTokenSelection(null)
    }
    catch (error) {
      console.log(error);
      const dialog = {
        title: "ERROR",
        message: error.message,
        type: 'danger'
      }
      setIsLoading(false)
      setDialog(dialog)
    }
  }

  const loadNftInfo = async (account) => {
    setIsLoading(true);
    setDialog(null)
    try {
      const recruitContract = getRecruitContract();
      if (account) {
        const balance = await recruitContract.balanceOf(account);
        setBalance(balance.toNumber());

        const hasFreeMinted = await recruitContract.hasFreeMinted(account)
        setHasFreeMinted(hasFreeMinted)

        const revealed = await recruitContract.revealed()
        const vipSaleStartTime = await recruitContract.vipSaleStartTime()
        setVipSaleStartTime(vipSaleStartTime.toNumber())
        const isOperator = await recruitContract.operators(currentAccount)
        setIsOperator(isOperator)
        const vipMintingPeriod = await recruitContract.vipMintingPeriod()
        setVipMintingPeriod(vipMintingPeriod.toNumber())
        const tokens = await recruitContract.tokensOfOwner(account);
        let array;
        const recruits = []
        if (tokens && tokens.length > 0) {
          if (tokens.length > 30 && isOperator) {
            //array = tokens.slice(10) 
          }
          else
            array = tokens
          if (array && array.length)
            array.forEach(async (token) => {
              const level = await recruitContract.recuitToLevel(token.toNumber())
              const wasFreeMinted = await recruitContract.isFreeToken(token.toNumber())
              let url;
              if (!revealed) {
                url = await recruitContract.tokenURI(token.toNumber())
              } else {
                const uri = await recruitContract.tokenURI(token.toNumber());
                const jsonUrl = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
                const metadata = await axios.get(jsonUrl)
                url = metadata.data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
              }

              recruits.push({
                id: token.toNumber(),
                level: level,
                wasFreeMinted: wasFreeMinted,
                url: `https://ipfs.io/ipfs/QmbKuVUDpuKyitzMNMbC9c2ijefZ8yQhLk7cK1yDwJ5boD/level${level}/${token.toNumber()}.jpeg`,
                title: level === 4 ? "LIEUTENANT" : level === 3 ? "1ST OFFICER" : level === 2 ? "2ND OFFICER" : "RECRUIT"
              })

              setRecruits(recruits)
            });
        }
        const maxLevel = await recruitContract.maxLevel();
        setMaxLevel(maxLevel)
        const price = await recruitContract.price()
        setUnitPrice(ethers.utils.formatEther(price, { pad: true }))
        setUnitFormatedPrice(ethers.utils.formatUnits(price.toString(), "ether"))
        const levelUpprice = await recruitContract.levelUpprice()
        setLevelUpprice(ethers.utils.formatEther(levelUpprice, { pad: true }))

        const resp = await apiClient.get(`players/${account}/levelup-signature`);
        if (resp, resp.data) {
          setAvailableFreeLevel(resp.data.level)
        }
      }
      else {
        const dialog = {
          title: "WALLET ERROR",
          message: "Connect your wallet",
          type: 'danger'
        }
        setDialog(dialog)
      }
      setIsLoading(false);
    } catch (err) {
      const dialog = {
        title: "CONTRACT ERROR",
        message: "Failed to load NFT infos",
        type: 'danger'
      }
      setDialog(dialog)
      setIsLoading(false);
      console.error("Failed to load NFT infos", err);
    }
  };

  useEffect(() => {
    connectWallet();
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        logOut(true, '/')
      });
      window.ethereum.on("networkChanged", function () {
        logOut(true, '/')
      });
    }
  }, []);

  return (
    <RecruitContext.Provider
      value={{
        shortAddress,
        currentAccount,
        discordUser,
        twitterUser,
        isListed,
        isLoading,
        balance,
        levelUpprice,
        dialog,
        unitFormatedPrice,
        hasFreeMinted,
        formData,
        recruits,
        maxLevel,
        selectedToken,
        showBuyOptions,
        isOperator,
        availableFreeLevel,
        connectWallet,
        completeRegistration,
        setDiscordUser,
        setTwitterUser,
        setDiscordUserInfos,
        setTwitterUserInfos,
        cleanUp,
        claimRecruit,
        handleSignIn,
        handleSignOut,
        buyRecuit,
        handleChange,
        levelUp,
        payForLevelUp,
        handleTokenSelection,
        addUserForFreeMint,
        addGoldenVip,
        addUserForVipMint,
        addUserForLevelUp,
        addOperator,
        setShowBuyOptions,
        withdraw,
        loadBatchUser,
        setFormData
      }}
    >
      {children}
    </RecruitContext.Provider>
  );
};
