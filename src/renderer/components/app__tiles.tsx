import clsx from 'clsx'
import React from 'react'

import { useShallowEqualSelector } from '../store'
import Tile from './app__tiles__tile'

const Tiles: React.FC = () => {
  const apps = useShallowEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )
  const visibleTiles = apps.filter((b) => !hiddenTileIds.includes(b.id))

  const threeCols = visibleTiles.length <= 3 || visibleTiles.length === 6
  const fourCols =
    visibleTiles.length === 4 ||
    visibleTiles.length === 7 ||
    visibleTiles.length === 8 ||
    visibleTiles.length === 11 ||
    visibleTiles.length === 12
  const fiveCols =
    visibleTiles.length === 5 ||
    visibleTiles.length === 9 ||
    visibleTiles.length === 10 ||
    visibleTiles.length >= 13

  return (
    <div
      className={clsx(
        'grid gap-4',
        threeCols && 'grid-cols-3',
        fourCols && 'grid-cols-4',
        fiveCols && 'grid-cols-5',
      )}
    >
      {visibleTiles.map((app) => (
        <Tile key={app.id} app={app} />
      ))}
    </div>
  )
}

export default Tiles
