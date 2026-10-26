// Fetch only the unmodified 180px assets permitted for non-commercial openGym forks.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, cpSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
const destination = resolve('catalogue/media')
if (existsSync(join(destination, 'clip')) && existsSync(join(destination, 'still'))) {
  console.log('Exercise media already present')
  process.exit(0)
}
const scratch = mkdtempSync(join(tmpdir(), 'opengym-media-'))
const run = args => execFileSync('git', args, { cwd: scratch, stdio: 'inherit' })
try {
  run(['init'])
  run(['remote', 'add', 'origin', 'https://github.com/DuarteSantos8/openGym.git'])
  run(['config', 'core.sparseCheckout', 'true'])
  run(['sparse-checkout', 'set', '--cone', 'catalogue/media'])
  run(['fetch', '--filter=blob:none', '--depth=1', 'origin', '7c8290ca20cb619bf6baa6830ea864d283df305a'])
  run(['checkout', '--detach', 'FETCH_HEAD'])
  cpSync(join(scratch, 'catalogue/media'), destination, { recursive: true })
} finally {
  // Only the unique directory created by mkdtemp above.
  rmSync(scratch, { recursive: true, force: true })
}
