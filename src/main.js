import '@phosphor-icons/web/regular'
import './style.css'
import { calculateAnniversaryState } from './anniversary.js'

const base = import.meta.env.BASE_URL
const app = document.querySelector('#app')
const imageUrl = (path) => `${base}${path}`

const photoButton = (photo, memoryIndex, photoIndex, className = '') => `
  <button class="memory-photo ${className}" data-memory="${memoryIndex}" data-photo="${photoIndex}" aria-label="查看${photo.alt}">
    <img src="${imageUrl(photo.thumb)}" data-full="${imageUrl(photo.full)}" alt="${photo.alt}" loading="lazy" width="${photo.width}" height="${photo.height}" />
  </button>
`

function chapterTemplate(memory, index) {
  const layout = ['chapter--spread', 'chapter--cinema', 'chapter--mosaic'][index % 3]
  const visible = memory.photos.slice(0, 5)
  return `
    <article class="chapter ${layout} observe" data-chapter="${index}">
      <div class="chapter__media">
        ${visible.map((photo, photoIndex) => photoButton(photo, index, photoIndex, `memory-photo--${photoIndex + 1}`)).join('')}
      </div>
      <div class="chapter__story">
        <p class="chapter__date">${memory.date}</p>
        <h3>${memory.title}</h3>
        <p>${memory.story}</p>
        <blockquote>“${memory.quote}”</blockquote>
        <button class="view-all" data-memory="${index}" data-photo="0">查看全部照片 <i class="ph ph-arrow-up-right" aria-hidden="true"></i></button>
      </div>
    </article>
  `
}

async function init() {
  const memories = await fetch(`${base}memories.json`).then((response) => {
    if (!response.ok) throw new Error('无法读取回忆数据')
    return response.json()
  })
  const anniversary = calculateAnniversaryState()
  const totalPhotos = memories.reduce((sum, memory) => sum + memory.photos.length, 0)
  const hero = memories[6].photos[0]
  const quietMoment = memories[3].photos[1] || memories[3].photos[0]
  const futurePhoto = memories[10].photos[0]
  const lifePhoto = memories[8].photos[0]

  app.innerHTML = `
    <div class="grain" aria-hidden="true"></div>
    <audio id="love-song" src="${base}music/perfect.mp3" preload="metadata" autoplay loop></audio>
    ${musicPlayerTemplate()}

    <header class="hero" id="top">
      <img class="hero__image" src="${imageUrl(hero.full)}" alt="鲜艳站在西安的灯火里" fetchpriority="high" />
      <div class="hero__veil" aria-hidden="true"></div>
      <nav class="nav" aria-label="主导航">
        <a class="nav__monogram" href="#top" title="回到首页">森林 <span>×</span> 鲜艳</a>
        <span class="nav__date">2025.07.15 至 2026.07.15</span>
      </nav>
      <div class="hero__copy">
        <p class="hero__eyebrow reveal">写给鲜艳的一封时光长信</p>
        <h1 class="reveal">我们的<br />第一年</h1>
        <p class="hero__lead reveal">日子一直向前，而我把爱留在每一个与你有关的瞬间。</p>
      </div>
      <div class="hero__days reveal" aria-label="相爱的天数">
        <strong id="together-days">${anniversary.together}</strong><span>天<br />仍在继续</span>
      </div>
    </header>

    <main>
      <section class="prologue section" id="prologue">
        <div class="prologue__statement observe">
          <p>亲爱的鲜艳</p>
          <h2>我想把这一年，<br />好好讲给你听。</h2>
        </div>
        <div class="prologue__letter observe">
          <p>时间把一次勇敢的告白，变成了无数次一起出发；也把两个独立的名字，写进了同一本日历。</p>
          <p>我做了这个网站，想把我们走过的路、见过的风景，还有那些没来得及说出口的话，都认真地收藏起来。</p>
          <p class="signature">爱你的森林</p>
        </div>
        <figure class="prologue__portrait observe">
          <img src="${imageUrl(quietMoment.full)}" alt="属于森林和鲜艳的日常瞬间" loading="lazy" />
        </figure>
        <div class="stats observe" aria-label="第一年的回忆数字">
          <div><strong>365</strong><span>一起走过的第一个春夏秋冬</span></div>
          <div><strong>${memories.length}</strong><span>段共同旅程</span></div>
          <div><strong>${totalPhotos}</strong><span>个被认真保存的瞬间</span></div>
        </div>
      </section>

      <section class="timeline section" id="timeline">
        <header class="timeline__header observe">
          <p>这一年，我们去了很多地方。</p>
          <h2>爱不是一个抽象的词。<br />它有日期，也有画面。</h2>
        </header>
        <div class="timeline__progress" aria-hidden="true"></div>
        <div class="chapters">
          ${memories.map(chapterTemplate).join('')}
        </div>
      </section>

      <section class="letter section" id="letter">
        <div class="letter__frame observe">
          <p class="letter__salutation">鲜艳：</p>
          <h2>谢谢你走进我的生活。</h2>
          <div class="letter__body">
            <p>这一年里，我们看过山、吹过海风，也在生活最普通的缝隙里，一点一点认识彼此。</p>
            <p>我知道未来不会永远只有鲜花和晴天。但我期待的，从来不是一个毫无波澜的故事，而是无论顺境还是难题，我们都愿意站在彼此身边，一起想办法，一起向前。</p>
            <p>希望我们认真工作，也认真生活；为各自的梦想努力，也为共同的未来攒下勇气。愿我们继续看更多风景，创造更多值得回忆的日子。</p>
            <p>第一年只是序章。以后，也请多多指教。</p>
          </div>
          <div class="letter__sign">爱你的森林<small>2026 年 7 月 15 日</small></div>
        </div>
      </section>

      <section class="future section" id="future">
        <header class="future__header observe">
          <h2>我们还会有<br />很多个明天。</h2>
        </header>
        <div class="future-grid">
          <article class="promise promise--photo observe" style="--photo: url('${imageUrl(futurePhoto.full)}')">
            <div><h3>继续出发</h3><p>去没去过的地方，拍下一张又一张新的合影。</p></div>
          </article>
          <article class="promise promise--quiet observe">
            <i class="ph ph-sun-horizon" aria-hidden="true"></i><h3>好好生活</h3><p>照顾好自己，也用心经营属于我们的日常。</p>
          </article>
          <article class="promise promise--accent observe">
            <i class="ph ph-arrow-up-right" aria-hidden="true"></i><h3>认真奋斗</h3><p>为热爱的事业努力，也给彼此最踏实的支持。</p>
          </article>
          <article class="promise promise--photo promise--life observe" style="--photo: url('${imageUrl(lifePhoto.full)}')">
            <div><h3>始终并肩</h3><p>遇见风雨不松手，迎着阳光一起向前。</p></div>
          </article>
        </div>
      </section>

      <section class="finale section">
        <div class="finale__image" aria-hidden="true"></div>
        <p class="finale__kicker observe">TO BE CONTINUED</p>
        <h2 class="observe">这不是故事的结尾。<br /><em>是下一段旅程的开始。</em></h2>
        <i class="ph ph-heart finale__heart observe" aria-hidden="true"></i>
        <p class="finale__names observe">森林 <span>×</span> 鲜艳</p>
        <p class="finale__date observe">2025.07.15 至 FOREVER</p>
        <p class="finale__countdown observe" id="anniversary-message" aria-live="polite">${anniversary.message}</p>
      </section>
    </main>

    <dialog class="lightbox" aria-label="照片大图浏览">
      <button class="lightbox__close" aria-label="关闭"><i class="ph ph-x"></i></button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="上一张"><i class="ph ph-caret-left"></i></button>
      <figure><img alt="" /><figcaption></figcaption></figure>
      <button class="lightbox__nav lightbox__nav--next" aria-label="下一张"><i class="ph ph-caret-right"></i></button>
    </dialog>
  `

  setupObservers()
  setupLightbox(memories)
  setupMusicPlayer()
  setupAnniversaryClock()
}

function setupAnniversaryClock() {
  const days = document.querySelector('#together-days')
  const message = document.querySelector('#anniversary-message')
  const refresh = () => {
    const state = calculateAnniversaryState()
    days.textContent = state.together
    message.textContent = state.message
  }
  refresh()
  window.setInterval(refresh, 60000)
}

function musicPlayerTemplate() {
  return `
    <aside class="music-player" aria-label="背景音乐播放器">
      <div class="music-player__disc" aria-hidden="true"><span>S × X</span></div>
      <div class="music-player__body">
        <div class="music-player__meta">
          <span class="music-player__status">正在尝试播放</span>
          <strong>Perfect</strong><small>Ed Sheeran</small>
        </div>
        <div class="music-player__controls">
          <button class="music-player__toggle" aria-label="播放音乐"><i class="ph ph-play"></i></button>
          <input class="music-player__progress" type="range" min="0" max="100" value="0" aria-label="音乐播放进度" />
          <button class="music-player__mute" aria-label="静音"><i class="ph ph-speaker-high"></i></button>
        </div>
      </div>
    </aside>
  `
}

function setupObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.observe').forEach((element) => observer.observe(element))
}

function setupLightbox(memories) {
  const dialog = document.querySelector('.lightbox')
  const image = dialog.querySelector('img')
  const caption = dialog.querySelector('figcaption')
  let memoryIndex = 0
  let photoIndex = 0

  const render = () => {
    const memory = memories[memoryIndex]
    const photo = memory.photos[photoIndex]
    image.src = imageUrl(photo.full)
    image.alt = photo.alt
    caption.textContent = `${memory.date}　${memory.title}　${photoIndex + 1} / ${memory.photos.length}`
  }
  const open = (nextMemory, nextPhoto) => {
    memoryIndex = nextMemory
    photoIndex = nextPhoto
    render()
    dialog.showModal()
    document.body.classList.add('no-scroll')
  }
  const close = () => {
    dialog.close()
    document.body.classList.remove('no-scroll')
  }
  const move = (direction) => {
    const length = memories[memoryIndex].photos.length
    photoIndex = (photoIndex + direction + length) % length
    render()
  }

  document.querySelectorAll('[data-memory][data-photo]').forEach((button) => {
    button.addEventListener('click', () => open(Number(button.dataset.memory), Number(button.dataset.photo)))
  })
  dialog.querySelector('.lightbox__close').addEventListener('click', close)
  dialog.querySelector('.lightbox__nav--prev').addEventListener('click', () => move(-1))
  dialog.querySelector('.lightbox__nav--next').addEventListener('click', () => move(1))
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close() })
  window.addEventListener('keydown', (event) => {
    if (!dialog.open) return
    if (event.key === 'ArrowLeft') move(-1)
    if (event.key === 'ArrowRight') move(1)
  })
  let touchStart = 0
  dialog.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX }, { passive: true })
  dialog.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStart
    if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1)
  }, { passive: true })
}

function setupMusicPlayer() {
  const audio = document.querySelector('#love-song')
  const player = document.querySelector('.music-player')
  const disc = player.querySelector('.music-player__disc')
  const toggle = player.querySelector('.music-player__toggle')
  const mute = player.querySelector('.music-player__mute')
  const progress = player.querySelector('.music-player__progress')
  const status = player.querySelector('.music-player__status')
  let seeking = false

  const render = () => {
    const playing = !audio.paused
    player.classList.toggle('is-playing', playing)
    disc.classList.toggle('is-spinning', playing)
    toggle.innerHTML = `<i class="ph ${playing ? 'ph-pause' : 'ph-play'}"></i>`
    toggle.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐')
    mute.innerHTML = `<i class="ph ${audio.muted ? 'ph-speaker-slash' : 'ph-speaker-high'}"></i>`
    mute.setAttribute('aria-label', audio.muted ? '取消静音' : '静音')
    status.textContent = playing ? '正在播放' : '轻触开启音乐'
  }
  const tryPlay = async () => {
    try {
      await audio.play()
      player.classList.remove('needs-gesture')
      render()
      return true
    } catch {
      player.classList.add('needs-gesture')
      render()
      return false
    }
  }
  const unlock = async (event) => {
    if (player.contains(event.target)) return
    if (audio.paused) await tryPlay()
    document.removeEventListener('pointerdown', unlock, true)
  }

  const heroImage = document.querySelector('.hero__image')
  if (heroImage.complete) tryPlay()
  else heroImage.addEventListener('load', tryPlay, { once: true })
  document.addEventListener('pointerdown', unlock, true)
  document.addEventListener('keydown', tryPlay, { once: true, capture: true })
  document.addEventListener('WeixinJSBridgeReady', tryPlay, { once: true })
  toggle.addEventListener('click', async () => {
    if (audio.paused) await tryPlay()
    else audio.pause()
    render()
  })
  mute.addEventListener('click', () => {
    audio.muted = !audio.muted
    render()
  })
  audio.addEventListener('play', () => {
    player.classList.remove('needs-gesture')
    render()
  })
  audio.addEventListener('pause', render)
  audio.addEventListener('loadedmetadata', () => { progress.max = audio.duration || 100 })
  audio.addEventListener('timeupdate', () => { if (!seeking) progress.value = audio.currentTime })
  progress.addEventListener('pointerdown', () => { seeking = true })
  progress.addEventListener('input', () => { audio.currentTime = Number(progress.value) })
  progress.addEventListener('change', () => { seeking = false })
  render()
}

init().catch((error) => {
  console.error(error)
  app.innerHTML = `<main class="error"><p>故事暂时走丢了，请刷新页面再试一次。</p></main>`
})
