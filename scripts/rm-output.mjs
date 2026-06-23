import fs from 'node:fs'

const path = 'E:/MuShan/.output'
for (let i = 0; i < 30; i++) {
  try {
    fs.rmSync(path, { recursive: true, force: true, maxRetries: 5, retryDelay: 800 })
    console.log('removed at try', i + 1)
    break
  }
  catch (e) {
    console.log('try', i + 1, 'failed:', e.message)
    await new Promise(r => setTimeout(r, 2000))
  }
}
