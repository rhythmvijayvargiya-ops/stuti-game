const VOLUME = 0.55

let ctx: AudioContext | null = null
let intro: AudioBuffer | null = null
let loop: AudioBuffer | null = null
let nodes: AudioBufferSourceNode[] = []
let preload: Promise<[ArrayBuffer, ArrayBuffer]> | null = null

function fileUrl(name: string) {
  return `${import.meta.env.BASE_URL}audio/${name}.wav`
}

function audioContext() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function preloadBackground() {
  if (!preload) {
    preload = Promise.all([
      fetch(fileUrl('bg-intro')).then((response) => response.arrayBuffer()),
      fetch(fileUrl('bg-loop')).then((response) => response.arrayBuffer()),
    ])
  }
  return preload
}

export function startBackground() {
  const audio = audioContext()
  void audio.resume()
  void preloadBackground().then(async ([introBytes, loopBytes]) => {
    if (!intro) intro = await audio.decodeAudioData(introBytes.slice(0))
    if (!loop) loop = await audio.decodeAudioData(loopBytes.slice(0))
    stopBackground()
    const gain = audio.createGain()
    gain.gain.value = VOLUME
    gain.connect(audio.destination)
    const start = audio.currentTime + 0.05
    const introNode = audio.createBufferSource()
    introNode.buffer = intro
    introNode.connect(gain)
    introNode.start(start)
    const loopNode = audio.createBufferSource()
    loopNode.buffer = loop
    loopNode.loop = true
    loopNode.connect(gain)
    loopNode.start(start + intro.duration)
    nodes = [introNode, loopNode]
  })
}

export function stopBackground() {
  nodes.forEach((node) => {
    try {
      node.stop()
    } catch {
      /* already stopped */
    }
  })
  nodes = []
}
