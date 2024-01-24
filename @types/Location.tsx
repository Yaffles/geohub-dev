import { ObjectId } from 'mongodb'

type Location = {
  _id: any
  lat: number
  lng: number
  panoId?: string | null
  heading?: number
  pitch?: number
  zoom?: number
  mapId?: ObjectId
  countryCode?: string
}

export default Location
