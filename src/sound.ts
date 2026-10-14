const src = (name: string) => `${import.meta.env.BASE_URL}audio/${name}.mp3`

let music: HTMLAudioElement | null = null
let muted = false

function clip(name: string, volume: number) {
  const audio = new Audio(src(name))
  audio.preload = 'auto'
  audio.volume = volume
  return audio
}

export function isSoundMuted() {
  return muted
}

export function setSoundMuted(next: boolean) {
  muted = next
  if (music) music.muted = next
  if (!next) startMusic()
  return muted
}

export function startMusic() {
  if (muted) return
  if (!music) {
    music = clip('bg', 0.28)
    music.loop = true
  }
  music.play().catch(() => {})
}

export function playTap() {
  if (muted) return
  startMusic()
  clip('tap', 0.5).play().catch(() => {})
}

export function playReveal() {
  if (muted) return
  clip('reveal', 0.42).play().catch(() => {})
}
