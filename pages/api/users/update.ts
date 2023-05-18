/* eslint-disable import/no-anonymous-default-export */
import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { collections, dbConnect } from '@backend/utils/dbConnect'
import getUserId from '../../../backend/utils/getUserId'
import { throwError } from '../../../backend/utils/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect()

    if (req.method === 'POST') {
      const { _id, name, bio, avatar } = req.body
      const userId = await getUserId(req, res)

      if (userId !== _id.toString()) {
        return throwError(res, 401, 'You are not allowed to update this user')
      }

      await collections.users?.updateOne({ _id: new ObjectId(_id) }, { $set: { name: name, bio: bio, avatar: avatar } })

      res.status(200).send({
        status: 'ok',
      })
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}
