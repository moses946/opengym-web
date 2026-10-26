import { cpSync } from 'node:fs'
cpSync(new URL('../frontend/dist/', import.meta.url), new URL('../dist/', import.meta.url), { recursive: true })
