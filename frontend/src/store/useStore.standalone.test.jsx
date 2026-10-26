// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
vi.mock('../lib/standalone.js', () => ({ LOCAL_WEB: true }))
import { useStore } from './useStore.js'
import { api } from '../lib/api.js'

describe('standalone web app', () => {
  it('boots with a clean log, no account and no demo seed', async () => {
    const network = vi.spyOn(globalThis, 'fetch')
    await useStore.getState().boot()
    expect(useStore.getState().ready).toBe(true)
    expect(useStore.getState().isGuest()).toBe(true)
    expect(useStore.getState().user).toBeNull()
    expect(useStore.getState().S.workouts).toEqual([])
    expect(localStorage.getItem('gym_demo_seeded_v1')).toBeNull()
    expect(network).not.toHaveBeenCalled()
    network.mockRestore()
  })
  it('retains real entries across another boot', async () => {
    useStore.getState().update(s => { s.bodyweight = [{ d: '2026-10-26', w: 80 }]; s.goal = 78 })
    await useStore.getState().boot()
    expect(useStore.getState().S.bodyweight).toEqual([{ d: '2026-10-26', w: 80 }])
    expect(JSON.parse(localStorage.getItem('gym_state_v1')).goal).toBe(78)
  })
  it('refuses server operations instead of reporting a false sync', async () => {
    const network = vi.spyOn(globalThis, 'fetch')
    await expect(api('/api/data', { method: 'PUT' })).rejects.toMatchObject({ code: 'local-only' })
    expect(network).not.toHaveBeenCalled()
    network.mockRestore()
  })
})
