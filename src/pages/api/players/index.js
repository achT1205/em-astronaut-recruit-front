import db from '../../../lib/dynamo-db'

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case 'POST':
            try {
                const { walletId, discordHandler, discordId, twitterHandler, twitterId, twitterProfilePicture, discordProfilePicture,  hasFinishedGame } = req.body

                const { Item } = await db.get({
                    Key: {
                        walletId: walletId
                    }
                });

                console.log("player", Item)
                if (!Item || !Item.walletId) {
                    const params = {
                        Item: {
                            "walletId": walletId,
                            "discordHandler": discordHandler,
                            "discordId": discordId,
                            "twitterHandler": twitterHandler,
                            "twitterId": twitterId,
                            "twitterProfilePicture": twitterProfilePicture,
                            "discordProfilePicture": discordProfilePicture,
                            "hasFinishedGame": hasFinishedGame,
                            "createdAt": Date.now(),
                            "updatedAt": null
                        },
                    };
                    await db.put(params);
                    res.status(200).json(req.body);
                }
                else {

                    const { walletId, discordHandler, discordId, twitterHandler, twitterId, twitterProfilePicture, discordProfilePicture, hasFinishedGame, isVip, canLevelUp, level } = req.body
                    let updateExpression = "SET  #updatedAt = :updatedAt";
                    let expressionAttributeNames = { "#updatedAt": "updatedAt" }
                    let expressionAttributeValues = { ":updatedAt": Date.now() }
                    if (typeof (discordHandler) != "undefined") {
                        expressionAttributeValues[":discordHandler"] = discordHandler
                        updateExpression = updateExpression + ", #discordHandler = :discordHandler"
                        expressionAttributeNames["#discordHandler"] = "discordHandler"
                    }
                    if (typeof (discordId) != "undefined") {
                        expressionAttributeValues[":discordId"] = discordId
                        updateExpression = updateExpression + ", #discordId = :discordId"
                        expressionAttributeNames["#discordId"] = "discordId"
                    }
                    if (typeof (twitterHandler) != "undefined") {
                        expressionAttributeValues[":twitterHandler"] = twitterHandler
                        updateExpression = updateExpression + ", #twitterHandler = :twitterHandler"
                        expressionAttributeNames["#twitterHandler"] = "twitterHandler"
                    }
                    if (typeof (twitterId) != "undefined") {
                        expressionAttributeValues[":twitterId"] = twitterId
                        updateExpression = updateExpression + ", #twitterId = :twitterId"
                        expressionAttributeNames["#twitterId"] = "twitterId"
                    }
                    if (typeof (twitterProfilePicture) != "undefined") {
                        expressionAttributeValues[":twitterProfilePicture"] = twitterProfilePicture
                        updateExpression = updateExpression + ", #twitterProfilePicture = :twitterProfilePicture"
                        expressionAttributeNames["#twitterProfilePicture"] = "twitterProfilePicture"
                    }
                    if (typeof (discordProfilePicture) != "undefined") {
                        expressionAttributeValues[":discordProfilePicture"] = discordProfilePicture
                        updateExpression = updateExpression + ", #discordProfilePicture = :discordProfilePicture"
                        expressionAttributeNames["#discordProfilePicture"] = "discordProfilePicture"
                    }
                    if (typeof (hasFinishedGame) != "undefined") {
                        expressionAttributeValues[":hasFinishedGame"] = hasFinishedGame
                        updateExpression = updateExpression + ", #hasFinishedGame = :hasFinishedGame"
                        expressionAttributeNames["#hasFinishedGame"] = "hasFinishedGame"
                    }
                    if (typeof (isVip) != "undefined") {
                        expressionAttributeValues[":isVip"] = isVip
                        updateExpression = updateExpression + ", #isVip = :isVip"
                        expressionAttributeNames["#isVip"] = "isVip"
                    }
                    if (typeof (canLevelUp) != "undefined") {
                        expressionAttributeValues[":canLevelUp"] = canLevelUp
                        updateExpression = updateExpression + ", #canLevelUp = :canLevelUp"
                        expressionAttributeNames["#canLevelUp"] = "canLevelUp"
                    }

                    if (typeof (level) != "undefined") {
                        expressionAttributeValues[":level"] = level
                        updateExpression = updateExpression + ", #level = :level"
                        expressionAttributeNames["#level"] = "level"
                    }

                    const params = {
                        Key: { walletId: walletId },
                        UpdateExpression: updateExpression,
                        ExpressionAttributeValues: expressionAttributeValues,
                        ExpressionAttributeNames: expressionAttributeNames,
                        ReturnValues: "ALL_NEW",
                    };

                    const result = await db.update(params)
                    res.status(200).json(result);
                }
            } catch (error) {
                console.log("error", error)
                res.status(400).json(error);
            }
            break;
        default:
            res.status(400).json({});
            break;
    }
}
