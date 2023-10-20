/* eslint-disable import/no-anonymous-default-export */
console.log("first");
import { ObjectId } from 'mongodb'
console.log("second");
import { NextApiRequest, NextApiResponse } from 'next'
console.log("third");
import { collections, dbConnect, throwError } from '@backend/utils'
console.log("fourth");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("test");
  try {
    await dbConnect()

    // HALP -> Sort maps by most liked -> going to need to query the mapLikes collection
    const countQuery = req.query.count as string
    const mapCount = Number(countQuery)
    const mapId = req.query.mapId as string

    if (req.method === 'GET') {
      const maps = await collections.maps
        ?.find({
          _id: { $ne: new ObjectId(mapId) },
          isPublished: true,
          isDeleted: { $exists: false },
        })
        .limit(mapCount || 3)
        .toArray()

      if (!maps) {
        return throwError(res, 400, 'Failed to get popular maps')
      }

      res.status(200).send(maps)
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}
