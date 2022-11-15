import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import Link from 'next/link'
import router from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mailman } from '@backend/utils/mailman'
import { DailyChallengeWinners } from '@components/DailyChallengeWinners'
import { Head } from '@components/Head'
import { Layout, LoadingPage } from '@components/Layout'
import { WidthController } from '@components/Layout/WidthController'
import { MapLeaderboard } from '@components/MapLeaderboard'
import { MapPreviewCard } from '@components/MapPreviewCard'
import { MapStats } from '@components/MapStats'
import { GameSettings } from '@components/Modals/GameSettings'
import { Modal } from '@components/Modals/Modal'
import { SkeletonCards } from '@components/SkeletonCards'
import { SkeletonLeaderboard } from '@components/SkeletonLeaderboard'
import { SkeletonMapInfo } from '@components/SkeletonMapInfo'
import { Avatar, Button } from '@components/System'
import { VerifiedBadge } from '@components/VerifiedBadge'
import { updateStartTime } from '@redux/game'
import { selectUser } from '@redux/user'
import StyledMapPage from '@styles/MapPage.Styled'
import { GameSettingsType, MapLeaderboardType, MapType } from '@types'
import { showErrorToast, showSuccessToast } from '@utils/helperFunctions'

const MapPage: FC = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [mapDetails, setMapDetails] = useState<MapType | null>()
  const [leaderboardData, setLeaderboardData] = useState<MapLeaderboardType[] | null>()
  const [otherMaps, setOtherMaps] = useState<MapType[] | null>()
  const [loading, setLoading] = useState(true)

  // State for "The Daily Challenge"
  const [isDailyChallenge, setIsDailyChallenge] = useState(false)
  const [hasPlayedDailyChallenge, setHasPlayedDailyChallenge] = useState(false)
  const [previousWinners, setPreviousWinners] = useState([])

  const mapId = router.query.id as string
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  settingsModalOpen ? disableBodyScroll(document as any) : enableBodyScroll(document as any)

  const closeModal = () => {
    setSettingsModalOpen(false)
  }

  const fetchMapDetails = async () => {
    const { status, res } = await mailman(`maps/${mapId}?userId=${user?.id}&stats=true`)

    if (status === 404 || status === 500) {
      return setMapDetails(null)
    }

    setMapDetails(res)
  }

  const fetchMapScores = async () => {
    const { status, res } = await mailman(`scores/${mapId}`)

    if (status === 404 || status === 500) {
      return setLeaderboardData(null)
    }

    setLeaderboardData(res)
  }

  const fetchOtherMaps = async () => {
    const { status, res } = await mailman(`maps/browse/popular?count=6&mapId=${mapId}`)

    if (status === 400 || status === 500) {
      return setOtherMaps(null)
    }

    setOtherMaps(res)
  }

  const startDailyChallenge = async () => {
    if (!user.id) {
      return router.push('/register')
    }

    const alreadyPlayedMessage = `You already played today's challenge.`

    if (hasPlayedDailyChallenge) {
      return showErrorToast(alreadyPlayedMessage)
    }

    const { res } = await mailman(`challenges/daily?userId=${user.id}`, 'POST')

    const { hasPlayed, challengeId } = res

    setHasPlayedDailyChallenge(hasPlayed)

    if (hasPlayed) {
      return showErrorToast(alreadyPlayedMessage)
    }

    router.push(`/challenge/${challengeId}`)
  }

  // Called if this is "The Daily Challenge"
  const fetchPreviousWinners = async () => {
    const { res } = await mailman(`scores/challenges/dailyWinners`)

    if (res.error) return

    setPreviousWinners(res)
  }

  useEffect(() => {
    if (!mapId) {
      return
    }

    setIsDailyChallenge(false)

    if (mapId === '63349eb5090804522c2180b7') {
      setIsDailyChallenge(true)
      fetchPreviousWinners()
    }

    fetchMapDetails()
    fetchMapScores()
    fetchOtherMaps()
  }, [mapId])

  return (
    <StyledMapPage>
      <WidthController customWidth="1100px" mobilePadding="0px">
        <Head title={mapDetails?.name ? `Play - ${mapDetails.name}` : 'GeoHub'} />

        {mapDetails ? (
          <div className="mapDetailsSection">
            <div className="mapDescriptionWrapper">
              <div className="descriptionColumnWrapper">
                <div className="descriptionColumn">
                  <Avatar type="map" src={mapDetails.previewImg} size={50} />
                  <div className="map-details">
                    <div className="name-wrapper">
                      <span className="name">{mapDetails.name}</span>
                      <VerifiedBadge size={20} />
                    </div>
                    {mapDetails.description && <span className="description">{mapDetails.description}</span>}
                    {!mapDetails.description && mapDetails.creatorDetails && (
                      <span className="map-creator">
                        {'Created by '}
                        <span className="map-creator-link">
                          <Link href={`/user/${mapDetails.creatorDetails._id}` || ''}>
                            <a>{mapDetails.creatorDetails.name}</a>
                          </Link>
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="solidPurple"
                  width="148px"
                  height="52px"
                  callback={() => (isDailyChallenge ? startDailyChallenge() : setSettingsModalOpen(true))}
                >
                  Play Now
                </Button>
              </div>
            </div>

            <div className="statsWrapper">
              <MapStats map={mapDetails} />
            </div>
          </div>
        ) : (
          <SkeletonMapInfo />
        )}

        {leaderboardData ? <MapLeaderboard leaderboard={leaderboardData} /> : <SkeletonLeaderboard />}

        {isDailyChallenge && (
          <div style={{ marginTop: '3rem' }}>
            {previousWinners ? <DailyChallengeWinners prevWinners={previousWinners} /> : <SkeletonLeaderboard />}
          </div>
        )}

        {otherMaps ? (
          <div className="otherMapsWrapper">
            <span className="otherMapsTitle">Other Popular Maps</span>
            <div className="otherMaps">
              {otherMaps.map((otherMap, idx) => (
                <MapPreviewCard key={idx} map={otherMap} />
              ))}
            </div>
          </div>
        ) : (
          <div className="skeletonCards">
            <SkeletonCards numCards={6} numColumns={3} />
          </div>
        )}
      </WidthController>

      {settingsModalOpen && mapDetails && <GameSettings closeModal={closeModal} mapDetails={mapDetails} />}
    </StyledMapPage>
  )
}

export default MapPage
