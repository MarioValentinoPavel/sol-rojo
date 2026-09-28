/* Sol Rojo — el sol cruza el cielo de 9 a 21 h mientras bajas */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const SKY = [ // hora, arriba, abajo
  [9, '#f7c3a4', '#fde6d2'], [11, '#cfe6f3', '#f4ede3'], [13, '#b7dcf3', '#eef6fa'], [15, '#a6d2ef', '#e9f3f7'],
  [17, '#f1b278', '#fbdcb3'], [19, '#df5c52', '#f6a56d'], [20.2, '#5b3a6e', '#c56a6a'], [21, '#171b36', '#352c52']
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
function skyAt(h) {
  for (let i = 0; i < SKY.length - 1; i++) if (h <= SKY[i + 1][0]) { const t = (h - SKY[i][0]) / (SKY[i + 1][0] - SKY[i][0]); return [mix(SKY[i][1], SKY[i + 1][1], t), mix(SKY[i][2], SKY[i + 1][2], t)]; }
  return [SKY.at(-1)[1], SKY.at(-1)[2]];
}
const sky = $('#sky'), sun = $('#sun'), clock = $('#clock'), stars = $('.stars');
const state = { p: 0, rise: 1 };
function render() {
  const h = 9 + state.p * 12;
  const [top, bot] = skyAt(h);
  sky.style.background = `linear-gradient(180deg, ${top}, ${bot} 78%, ${h > 20 ? '#2a2440' : '#f3ede1'} 78.2%)`;
  const W = innerWidth, H = innerHeight, S = sun.offsetWidth;
  const q = Math.min(1, (h - 9) / 11); // 9 → 20 h: arco del sol
  const x = W * (.1 + .8 * q);
  const hy = H * .78;
  let y = hy - Math.sin(Math.PI * q) * H * .58;
  if (h > 20) y = hy + (h - 20) * S * 1.2;
  y += state.rise * H * .3;
  sun.style.transform = `translate(${(x - S / 2).toFixed(1)}px,${(y - S / 2).toFixed(1)}px)`;
  const mm = Math.floor((h % 1) * 60);
  clock.textContent = `${String(Math.floor(Math.min(h, 21))).padStart(2, '0')}:${String(h >= 21 ? 0 : mm).padStart(2, '0')}`;
  const night = h > 20.3;
  document.body.classList.toggle('is-night', night);
  stars.style.opacity = Math.max(0, (h - 20) / 1);
}
ScrollTrigger.create({ trigger: 'main', start: 'top top', end: 'bottom bottom', onUpdate: s => { state.p = s.progress; render(); } });
addEventListener('resize', render);
render();

/* ---------- amanecer ---------- */
gsap.to(state, { rise: 0, duration: 2.4, ease: 'power3.out', onUpdate: render, delay: .2 });
gsap.from('.hero .hour__body > *', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, delay: .8 });

/* ---------- maneki-neko ---------- */
(function neko() {
  const say = $('#nekoSay');
  const lines = ['¡Suerte para tu próxima cita!', 'Hoy te toca un buen día de pelo.', 'Uñas nuevas, suerte nueva.', 'El gato dice: pide cita antes de las 21 h.', '¡Que el sol te acompañe!'];
  let i = 0;
  $('#neko').addEventListener('click', () => {
    gsap.fromTo('#paw', { rotation: 0 }, { rotation: -28, duration: .18, yoyo: true, repeat: 5, ease: 'sine.inOut' });
    say.textContent = lines[i++ % lines.length];
    gsap.fromTo(say, { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' });
  });
  gsap.to('#paw', { rotation: -14, duration: .6, yoyo: true, repeat: -1, repeatDelay: 1.6, ease: 'sine.inOut' });
})();

/* ---------- apariciones ---------- */
$$('.hour:not(.hero) .hour__body').forEach(n => gsap.from(n, { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 85%' } }));
