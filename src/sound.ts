const src = (name: string) => `${import.meta.env.BASE_URL}audio/${name}.mp3`

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
  return muted
}

export function playTap() {
  if (muted) return
  clip('tap', 0.5).play().catch(() => {})
}

export function playReveal() {
  if (muted) return
  clip('reveal', 0.42).play().catch(() => {})
}
