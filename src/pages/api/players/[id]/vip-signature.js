import db from '../../../../lib/dynamo-db'

import { ethers } from 'ethers'

export default async function handler(req, res) {
    const { id } = req.query
    try {

        const { Item } = await db.get({
            Key: {
                walletId: id
            }
        });

        if (!Item)
            return res.status(200).json({ message: "Not listed yet for the first 24h sale." });
        else
            if (!Item.isVip)
                return res.status(200).json({ message: "Not listed yet for the first 24h sale." });


        const now = Math.floor(Date.now() / 1000);
        let messageHash = ethers.utils.solidityKeccak256(
            ["address", "uint256"],
            [`${id.toLowerCase()}`, now]
        );

        let messageHashBinary = ethers.utils.arrayify(messageHash);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
        const base64String = Buffer.from(messageHashBinary, 'binary').toString('base64')
        const signature = await wallet.signMessage(messageHashBinary);
        res.status(200).json({
            hashedMessage: base64String, signature: signature, timestamp: now
        });
    } catch (error) {
        console.log("error", error)
        res.status(400).json(error);
    }
}