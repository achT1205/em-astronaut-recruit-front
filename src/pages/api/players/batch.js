// import db from '../../../lib/dynamo-db'

// // JSON data
// const fetchedData = [
//   { language: 'JavaScript', isFun: true , walletId:"ggg"},
//   { language: 'Rust', isFun: true , walletId:"ppp"},
// ]

// // format data for docClient
// const seedData = fetchedData.map((item) => {
//   return {
//     PutRequest: {
//       Item: item,
//     },
//   }
// })

// /* We can only batch-write 25 items at a time,
//   so we'll store both the quotient, as well as what's left.
//   */

// let quotient = Math.floor(seedData.length / 25)
// const remainder = (seedData.length % 25)

// /* Upload in increments of 25 */

// let batchMultiplier = 1
// while (quotient > 0) {
//   for (let i = 0; i < seedData.length - 1; i += 25) {
//     await db.batchWrite(
//       {
//         RequestItems: {
//           YOUR_TABLE_NAME: seedData.slice(i, 25 * batchMultiplier),
//         },
//       },
//       (err, data) => {
//         if (err) {
//           console.log('something went wrong...')
//         } else {
//           console.log('yay...uploaded!')
//         }
//       }
//     ).promise()
//     console.log({ quotient })
//     ++batchMultiplier
//     --quotient
//   }
// }

// /* Upload the remaining items (less than 25) */
// if(remainder > 0){
//   await db.batchWrite(
//     {
//       RequestItems: {
//         YOUR_TABLE_NAME: seedData.slice(seedData.length - remainder),
//       },
//     },
//     (err, data) => {
//       if (err) {
//         console.log('something went wrong...')
//       } else {
//         console.log('yay...the remainder uploaded!')
//       }
//     }
//   ).promise()
// }