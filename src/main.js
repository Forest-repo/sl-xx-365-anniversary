import './style.css'

const base = import.meta.env.BASE_URL
const app = document.querySelector('#app')

const icon = (name) => {
  const paths = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>',
    arrow: '<path d="m6 9 6 6 6-6"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    prev: '<path d="m15 18-6-6 6-6"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4Zm4.5 3.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/>',
    muted: '<path d="M11 5 6 9H3v6h3l5 4Zm5 5 5 5m0-5-5 5"/>',
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`
}

const calculateDays = () => {
  const start = new Date('2025-07-15T00:00:00+08:00')
  const anniversary = new Date('2026-07-15T00:00:00+08:00')
  const today = new Date()
  const together = Math.max(0, Math.floor((today - start) / 86400000) + 1)
  const remaining = Math.ceil((anniversary - today) / 86400000)
  return { together, remaining }
}

const imageUrl = (path) => `${base}${path}`

async function init() {
  const memories = await fetch(`${base}memories.json`).then((response) => response.json())
  const { together, remaining } = calculateDays()
  const heroPhoto = memories.find((m) => m.id === 'chapter-07')?.photos[0] || memories[0].photos[0]

  app.innerHTML = `
    <div class="noise"></div>
    <audio id="love-song" src="${base}music/perfect.mp3" preload="auto" autoplay loop></audio>
    <aside class="music-player" aria-label="背景音乐播放器">
      <div class="music-player__disc" aria-hidden="true"><span>S × X</span></div>
      <div class="music-player__body">
        <div class="music-player__meta">
          <span class="music-player__status">正在尝试播放</span>
          <strong>Perfect</strong><small>Ed Sheeran</small>
        </div>
        <div class="music-player__controls">
          <button class="music-player__toggle" aria-label="播放音乐">${icon('play')}</button>
          <input class="music-player__progress" type="range" min="0" max="100" value="0" aria-label="音乐播放进度" />
          <button class="music-player__mute" aria-label="静音">${icon('volume')}</button>
        </div>
      </div>
    </aside>
    <header class="hero" id="top">
      <img class="hero__image" src="${imageUrl(heroPhoto.full)}" alt="鲜艳在西安的夜色里" />
      <div class="hero__shade"></div>
      <nav class="nav">
        <a class="nav__mark" href="#top" aria-label="回到顶部">S <span>×</span> X</a>
        <span class="nav__date">2025.07.15 — 2026.07.15</span>
      </nav>
      <div class="hero__content">
        <p class="eyebrow reveal">写给鲜艳的一封时光长信</p>
        <h1 class="reveal"><span>我们的</span><br />第一年</h1>
        <p class="hero__lead reveal">从那天开始，普通的日子有了新的名字：<strong>我们。</strong></p>
        <a class="open-letter reveal" href="#prologue">开启我们的故事 ${icon('arrow')}</a>
      </div>
      <div class="hero__counter reveal">
        <span class="hero__counter-number">${together}</span>
        <span class="hero__counter-copy">天<br />仍在继续</span>
      </div>
      <div class="hero__film">FOREST & XIANYAN · ONE YEAR OF US · 2026</div>
    </header>

    <main>
      <section class="prologue section" id="prologue">
        <div class="prologue__orbit" aria-hidden="true"><span></span><i></i></div>
        <p class="section-index">00 / 序</p>
        <div class="prologue__copy observe">
          <p>亲爱的鲜艳：</p>
          <p>时间很奇妙。它把一次勇敢的告白，变成了无数次一起出发；把两个人的名字，写进同一本日历。</p>
          <p>我做了这个小小的网站，想把我们走过的路、见过的风景，还有那些没来得及说出口的话，都好好收藏起来。</p>
          <p class="signature">—— 爱你的森林</p>
        </div>
        <div class="stats observe">
          <div><strong>365</strong><span>第一个春夏秋冬</span></div>
          <div><strong>${memories.length}</strong><span>段共同旅程</span></div>
          <div><strong>${memories.reduce((sum, m) => sum + m.photos.length, 0)}</strong><span>个被珍藏的瞬间</span></div>
        </div>
      </section>

      <section class="timeline section" id="timeline">
        <div class="section-heading observe">
          <p class="section-index">01 / 我们走过的路</p>
          <h2>日子向前，<br /><em>爱有迹可循。</em></h2>
          <p>向下滚动，重走一次我们的第一年。</p>
        </div>
        <div class="timeline__line" aria-hidden="true"><span></span></div>
        <div class="chapters">
          ${memories.map((memory, index) => chapterTemplate(memory, index)).join('')}
        </div>
      </section>

      <section class="letter section" id="letter">
        <div class="letter__paper observe">
          <p class="section-index">02 / 写给未来</p>
          <span class="letter__stamp">FOREVER<br />IN PROGRESS</span>
          <h2>鲜艳，<br />谢谢你走进我的生活。</h2>
          <div class="letter__body">
            <p>这一年里，我们看过山、吹过海风，也在生活最普通的缝隙里，一点一点认识彼此。</p>
            <p>我知道未来不会永远只有鲜花和晴天。但我期待的，从来不是一个毫无波澜的故事，而是无论顺境还是难题，我们都愿意站在彼此身边，一起想办法，一起向前。</p>
            <p>希望我们认真工作，也认真生活；为各自的梦想努力，也为共同的未来攒下勇气。愿我们继续看更多风景，创造更多值得回忆的日子。</p>
            <p>第一年只是序章。以后，也请多多指教。</p>
          </div>
          <div class="letter__sign">爱你的森林<br /><small>2026 年 7 月 15 日</small></div>
        </div>
      </section>

      <section class="future section">
        <p class="section-index observe">03 / 下一程</p>
        <h2 class="observe">把未来，<br />也过成值得收藏的日子。</h2>
        <div class="promises">
          <article class="promise observe"><span>01</span><h3>认真奋斗</h3><p>为热爱的事业努力，也给彼此最踏实的支持。</p></article>
          <article class="promise observe"><span>02</span><h3>好好生活</h3><p>照顾好自己，也用心经营属于我们的日常。</p></article>
          <article class="promise observe"><span>03</span><h3>继续出发</h3><p>去没去过的地方，拍下一张又一张新的合影。</p></article>
          <article class="promise observe"><span>∞</span><h3>始终并肩</h3><p>遇见风雨不松手，迎着阳光一起向前。</p></article>
        </div>
      </section>

      <section class="finale section">
        <div class="finale__stars" aria-hidden="true"></div>
        <p class="eyebrow observe">TO BE CONTINUED</p>
        <h2 class="observe">这不是故事的结尾，<br /><em>是下一段旅程的开始。</em></h2>
        <div class="finale__heart observe">${icon('heart')}</div>
        <p class="finale__names observe">森林 <span>×</span> 鲜艳</p>
        <p class="finale__date observe">2025.07.15 — FOREVER</p>
        ${remaining > 0 ? `<p class="finale__countdown">距离一周年还有 ${remaining} 天</p>` : ''}
      </section>
    </main>

    <dialog class="lightbox" aria-label="照片大图浏览">
      <button class="lightbox__close" aria-label="关闭">${icon('close')}</button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="上一张">${icon('prev')}</button>
      <figure><img alt="" /><figcaption></figcaption></figure>
      <button class="lightbox__nav lightbox__nav--next" aria-label="下一张">${icon('next')}</button>
    </dialog>
  `

  setupInteractions(memories)
  setupMusicPlayer()
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
    toggle.innerHTML = icon(playing ? 'pause' : 'play')
    toggle.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐')
    mute.innerHTML = icon(audio.muted ? 'muted' : 'volume')
    mute.setAttribute('aria-label', audio.muted ? '取消静音' : '静音')
    status.textContent = playing ? '正在播放 · OUR SONG' : '轻触开启音乐'
  }

  const tryPlay = async () => {
    try {
      await audio.play()
      render()
      return true
    } catch {
      player.classList.add('needs-gesture')
      render()
      return false
    }
  }

  // 有权限时立即有声播放；被浏览器拦截时，在第一次触摸/点击时启动。
  tryPlay()
  const unlock = async (event) => {
    if (player.contains(event.target)) return
    if (audio.paused) await tryPlay()
    player.classList.remove('needs-gesture')
    document.removeEventListener('pointerdown', unlock, true)
  }
  document.addEventListener('pointerdown', unlock, true)
  document.addEventListener('keydown', unlock, { once: true, capture: true })
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
  audio.addEventListener('timeupdate', () => {
    if (!seeking) progress.value = audio.currentTime
  })
  progress.addEventListener('pointerdown', () => { seeking = true })
  progress.addEventListener('input', () => { audio.currentTime = Number(progress.value) })
  progress.addEventListener('change', () => { seeking = false })
  render()
}

function chapterTemplate(memory, index) {
  const featured = memory.photos[0]
  const visible = memory.photos.slice(1, 5)
  return `
    <article class="chapter ${index % 2 ? 'chapter--right' : ''} observe" data-chapter="${index}">
      <div class="chapter__number">${String(index + 1).padStart(2, '0')}</div>
      <div class="chapter__visual">
        <button class="photo photo--hero" data-memory="${index}" data-photo="0" aria-label="查看${memory.title}的照片">
          <img src="${imageUrl(featured.thumb)}" data-full="${imageUrl(featured.full)}" alt="${featured.alt}" loading="lazy" width="${featured.width}" height="${featured.height}" />
        </button>
        ${visible.map((photo, photoIndex) => `
          <button class="photo photo--small photo--${photoIndex + 1}" data-memory="${index}" data-photo="${photoIndex + 1}" aria-label="查看${memory.title}的第${photoIndex + 2}张照片">
            <img src="${imageUrl(photo.thumb)}" data-full="${imageUrl(photo.full)}" alt="${photo.alt}" loading="lazy" width="${photo.width}" height="${photo.height}" />
          </button>
        `).join('')}
      </div>
      <div class="chapter__copy">
        <p class="chapter__date">${memory.date}</p>
        <h3>${memory.title}</h3>
        <p>${memory.story}</p>
        <blockquote>“${memory.quote}”</blockquote>
        <button class="view-all" data-memory="${index}" data-photo="0">查看全部 ${memory.photos.length} 张照片 <span>↗</span></button>
      </div>
    </article>
  `
}

function setupInteractions(memories) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible')
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.observe').forEach((el) => observer.observe(el))

  const line = document.querySelector('.timeline__line span')
  window.addEventListener('scroll', () => {
    const timeline = document.querySelector('.timeline')
    const rect = timeline.getBoundingClientRect()
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.35)))
    line.style.transform = `scaleY(${progress})`
  }, { passive: true })

  const dialog = document.querySelector('.lightbox')
  const dialogImage = dialog.querySelector('img')
  const caption = dialog.querySelector('figcaption')
  let activeMemory = 0
  let activePhoto = 0

  const showPhoto = () => {
    const memory = memories[activeMemory]
    const photo = memory.photos[activePhoto]
    dialogImage.src = imageUrl(photo.full)
    dialogImage.alt = photo.alt
    caption.textContent = `${memory.date} · ${memory.title}　${activePhoto + 1} / ${memory.photos.length}`
  }
  const open = (memoryIndex, photoIndex) => {
    activeMemory = memoryIndex
    activePhoto = photoIndex
    showPhoto()
    dialog.showModal()
    document.body.classList.add('no-scroll')
  }
  const close = () => {
    dialog.close()
    document.body.classList.remove('no-scroll')
  }
  const move = (direction) => {
    const length = memories[activeMemory].photos.length
    activePhoto = (activePhoto + direction + length) % length
    showPhoto()
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

init().catch((error) => {
  console.error(error)
  app.innerHTML = '<p class="error">故事暂时走丢了，请刷新页面再试一次。</p>'
})
