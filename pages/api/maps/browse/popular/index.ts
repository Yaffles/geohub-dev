/* eslint-disable import/no-anonymous-default-export */
console.log("first");
import { ObjectId } from 'mongodb'
console.log("second");
import { NextApiRequest, NextApiResponse } from 'next'
console.log("third");
import { collections, dbConnect, throwError } from '@backend/utils'
console.log("fourth");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("5");
  try {
    await dbConnect()

    // HALP -> Sort maps by most liked -> going to need to query the mapLikes collection
    console.log("6");
    const countQuery = req.query.count as string
    const mapCount = Number(countQuery)
    const mapId = req.query.mapId as string
    console.log("7");

    if (req.method === 'GET') {
      console.log("8");
      const maps = await collections.maps
        ?.find({
          _id: { $ne: new ObjectId(mapId) },
          isPublished: true,
          isDeleted: { $exists: false },
        })
        .limit(mapCount || 3)
        .toArray()

      if (!maps) {
        console.log("9");
        return throwError(res, 400, 'Failed to get popular maps')
      }
      console.log("10");
      res.status(200).send(maps)
    } else {
      console.log("11");
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (err) {
    console.log("12");
    console.error(err)
    res.status(500).json({ success: false })
  }
}
