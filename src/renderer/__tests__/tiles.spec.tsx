import { act, fireEvent, render, screen, within } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { INSTALLED_APPS_FOUND, URL_UPDATED } from '../../main/events'
import App from '../components/app'
import { OPEN_APP } from '../sendToMain'

test('tiles', () => {
  render(<App />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
      { name: 'Firefox', id: 'org.mozilla.firefox' },
      { name: 'Safari', id: 'com.apple.Safari' },
    ])
  })
  // Check tiles and tile logos shown
  expect(screen.getByAltText('Firefox')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Firefox Tile' })).toBeVisible()
  expect(screen.getByAltText('Safari')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Safari Tile' })).toBeVisible()

  // Make sure no tile set as favourite
  expect(screen.queryByText('space')).not.toBeInTheDocument()

  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Tiles Menu' }))
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.click(screen.getByRole('button', { name: 'Tiles Menu' }))
  const safariTile = screen.getByRole('button', { name: 'Safari Tile' })
  expect(within(safariTile).getByText('space')).toBeVisible()

  // Correct info sent to main when tile clicked
  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(OPEN_APP, {
    urlId: undefined,
    appId: 'org.mozilla.firefox',
    isAlt: false,
  })

  act(() => {
    win.webContents.send(URL_UPDATED, 'http://example.com')
  })
  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(OPEN_APP, {
    url: 'http://example.com',
    appId: 'org.mozilla.firefox',
    isAlt: false,
  })
})
