class Carousel {
  constructor(o) {
    const settings = {
      ...{
        containerID: '#carousel',
        slideID: '.slide',
        interval: 2000,
        isPlaying: true,
      },
      ...o,
    };

    this.contry = [
      { name: 'Швейцарія', link: 'assets/img/jpg/lucas-clara-hvPB-UCAmmU-unsplash.jpg' },
      { name: 'Норвегія', link: 'assets/img/jpg/nor.jpg' },
      { name: 'Аляска', link: 'assets/img/jpg/al.jpg' },
      { name: 'Шрі-Ланка', link: 'assets/img/jpg/shri-lanka-min.jpg' },
      { name: 'Греція', link: 'assets/img/jpg/gree.jpg' }
    ]

    this.container = document.querySelector(settings.containerID);
    this.slides = this.container.querySelectorAll(settings.slideID);

    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;

    this.slidesContainer = document.querySelector('#slides');
  }

  _initProps() {
    this.SLIDE_COUNT = this.slides.length;
    this.CODE_RIGHT_ARROW = 'ArrowRight';
    this.CODE_LEFT_ARROW = 'ArrowLeft';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="fa-solid fa-circle-pause"></i>';
    this.FA_PLAY = '<i class="fa-solid fa-circle-play"></i>';
    this.FA_PREV = '<i class="fa-solid fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fa-solid fa-angle-right"></i>';

    this.currentSlide = 0;
    // this.isPlaying = true;
  }

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span class="control control--pause" id="pause-btn">
    <span id="fa-pause-icon">${this.FA_PAUSE}</span>
    <span id="fa-play-icon">${this.FA_PLAY}</span>
    </span>`;
    const PREV = `<span class="control control--prev" id="prev-btn">${this.FA_PREV}</span>`;
    const NEXT = `<span class="control control--next" id="next-btn">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');
    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.append(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

    this.pauseIcon = this.container.querySelector('#fa-pause-icon');
    this.playIcon = this.container.querySelector('#fa-play-icon');

    this.menu = document.querySelector('.burger-menu');
    this.button = document.querySelector('.burger-menu__button');
    this.links = document.querySelector('.burger-menu__nav-link');
    this.overlay = document.querySelector('.burger-menu__nav-overlay');

    this.isPlaying ? this._pauseVisible() : this._playVisible();
  }

  _initIndicators() {
    const indicators = document.createElement('div');
    indicators.setAttribute('class', 'indicators');

    for (let i = 0, n = this.SLIDE_COUNT; i < n; i++) {
      const indicator = document.createElement('div');

      indicator.setAttribute(
        'class',
        i !== 0 ? 'indicator' : 'indicator active'
      );
      indicator.dataset.slideTo = `${i}`;

      indicators.append(indicator);
    }

    this.container.append(indicators);
    this.indicatorsContainer = this.container.querySelector('.indicators');
    this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
  }

  _initInfo() {
    for (let i = 0, n = this.SLIDE_COUNT; i < n; i++) {
      const info = document.createElement('div');
      info.setAttribute('class', 'slide__link');
      const infoLink = document.createElement('a');
      infoLink.setAttribute('class', 'slide__link-text');
      infoLink.setAttribute('href', '#');
      this.slides[i].style.backgroundImage = `url("${this.contry[i].link}")`
      infoLink.innerHTML = `${this.contry[i].name}`
      this.slides[i].append(info)
      info.append(infoLink)
    }
  }

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.indicatorsContainer.addEventListener(
      'click',
      this._indicate.bind(this)
    );
    this.pauseBtn.addEventListener('mouseenter', this._pause.bind(this));
    this.pauseBtn.addEventListener('mouseleave', this._play.bind(this));

    this.button.addEventListener('click', this._toggleChange.bind(this));
    this.links.addEventListener('click', this._toggleChange.bind(this));
    this.overlay.addEventListener('click', this._toggleChange.bind(this));

    document.addEventListener('keydown', this._pressKey.bind(this));
  }

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');

    this.currentSlide = (n + this.SLIDE_COUNT) % this.SLIDE_COUNT;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');

    if (this.isPlaying) {
      this._notVisible();
    }
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _pause() {
    if (this.isPlaying) {
      this._playVisible();
      this.isPlaying = false;
      clearInterval(this.timerId);
    }
  }

  _play() {
    if (!this.isPlaying) {
      this._pauseVisible();
      this.isPlaying = true;
      this._tick();
    }
  }

  _notVisible() {
    if (this._pauseVisible) {
      this.pauseIcon.style.opacity = 0;
      this.playIcon.style.opacity = 0;
    }
  }

  _pauseVisible(isVisible = true) {
    isVisible
      ? (this.pauseIcon.style.opacity = 1)
      : (this.pauseIcon.style.opacity = 0);
    !isVisible
      ? (this.playIcon.style.opacity = 1)
      : (this.playIcon.style.opacity = 0);
  }

  _playVisible() {
    this._pauseVisible(false);
  }

  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  }

  prev() {
    this._pause();
    this._gotoPrev();
  }

  next() {
    this._pause();
    this._gotoNext();
  }

  _indicate(e) {
    const target = e.target;

    if (target && target.classList.contains('indicator')) {
      this._pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  }

  _pressKey(e) {
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_SPACE) {
      e.preventDefault();
      this.pausePlay();
    }
  }

  _tick(flag = true) {
    if (!flag) return;
    this.timerId = setInterval(() => this._gotoNext(), this.interval);
  }

  _toggleActive() {
    this.menu.classList.toggle('burger-menu__active');
  }

  _toggleChange(e) {
    e.preventDefault();
    this._toggleActive();
  }

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initInfo()
    this._initListeners();

    this._notVisible();

    this._tick(this.isPlaying);
  }
}

export default Carousel;
