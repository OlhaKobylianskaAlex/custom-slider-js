import SwipeCarousel from './advanced-carousel.js';

// const carousel = new SwipeCarousel('.slider', '.item');
const carousel = new SwipeCarousel({
  // containerID: '.slider',
  // slideID: '.item',
  interval: 1500,
  isPlaying: true
});

carousel.init()
