// Menú mobile: abrir/cerrar y cerrar al elegir un link
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});

// Animación de aparición al hacer scroll (tarjetas de nicho y de servicio)
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.niche-card, .service-card, .mockup-window');

  if (reduceMotion || !('IntersectionObserver' in window) || !cards.length) return;

  document.body.classList.add('js-reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(function (card, i) {
    card.style.transitionDelay = (i % 3) * 0.08 + 's';
    observer.observe(card);
  });
});

// Fondo: shader WebGL propio de ruido fluido tipo tinta/mármol (sin librerías),
// con los azules de la marca. Si WebGL no está disponible, el canvas queda vacío
// y se ve el color de fondo plano de <body> — no rompe nada.
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  var vertexSrc =
    'attribute vec2 a_position;' +
    'void main() { gl_Position = vec4(a_position, 0.0, 1.0); }';

  // Ruido de valor + fbm + "domain warping" (técnica clásica de I. Quilez) para
  // lograr el efecto de tinta/mármol fluido, coloreado con los azules de la marca:
  // azul marino, azul marino casi negro, negro y un azul medio más claro.
  var fragmentSrc =
    'precision mediump float;' +
    'uniform vec2 u_resolution;' +
    'uniform float u_time;' +
    'vec2 hash(vec2 p) {' +
    '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));' +
    '  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);' +
    '}' +
    'float noise(vec2 p) {' +
    '  vec2 i = floor(p);' +
    '  vec2 f = fract(p);' +
    '  vec2 u = f * f * (3.0 - 2.0 * f);' +
    '  return mix(' +
    '    mix(dot(hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)), dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),' +
    '    mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)), dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),' +
    '    u.y);' +
    '}' +
    'float fbm(vec2 p) {' +
    '  float v = 0.0;' +
    '  float a = 0.5;' +
    '  for (int i = 0; i < 5; i++) {' +
    '    v += a * noise(p);' +
    '    p *= 2.0;' +
    '    a *= 0.5;' +
    '  }' +
    '  return v;' +
    '}' +
    'void main() {' +
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;' +
    '  vec2 p = uv * 2.4;' +
    '  p.x *= u_resolution.x / u_resolution.y;' +
    '  float t = u_time * 0.045;' +
    '  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));' +
    '  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.7), fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.4));' +
    '  float f = fbm(p + 4.0 * r);' +
    // Rampa de 7 azules bien diferenciados (de negro a azul claro), como en la
    // referencia de Tranquiluxe pero en tonos de marca. El azul marino casi negro
    // (c1, color de marca) tiene la franja más ancha para que domine el fondo,
    // pero el resto de los tonos se ven claramente al fluir por la pantalla.
    '  vec3 c0 = vec3(0.0, 0.0, 0.0);' +          // negro
    '  vec3 c1 = vec3(0.039, 0.055, 0.102);' +    // #0a0e1a — azul marino casi negro (marca)
    '  vec3 c2 = vec3(0.075, 0.110, 0.204);' +    // #131c34
    '  vec3 c3 = vec3(0.109, 0.165, 0.322);' +    // #1c2a52 — azul marino
    '  vec3 c4 = vec3(0.157, 0.220, 0.424);' +    // #28386c
    '  vec3 c5 = vec3(0.2, 0.286, 0.619);' +      // #33499e — azul medio
    '  vec3 c6 = vec3(0.357, 0.498, 0.878);' +    // #5b7fe0 — azul claro (destello, franja angosta)
    '  float v = clamp(f * 0.9 + 0.5, 0.0, 1.0);' +
    '  vec3 color = c0;' +
    '  color = mix(color, c1, smoothstep(0.00, 0.12, v));' +
    '  color = mix(color, c2, smoothstep(0.38, 0.48, v));' +
    '  color = mix(color, c3, smoothstep(0.48, 0.60, v));' +
    '  color = mix(color, c4, smoothstep(0.60, 0.72, v));' +
    '  color = mix(color, c5, smoothstep(0.72, 0.86, v));' +
    '  color = mix(color, c6, smoothstep(0.86, 1.0, v));' +
    '  gl_FragColor = vec4(color, 1.0);' +
    '}';

  function compile(type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vs = compile(gl.VERTEX_SHADER, vertexSrc);
  var fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return;

  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  var quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  var posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  var resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
  var timeLoc = gl.getUniformLocation(program, 'u_time');

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  function render(timeMs) {
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, timeMs * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!reduceMotion) window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
});

// Al hacer scroll, la sección que va quedando por arriba de la pantalla se va achicando
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections = document.querySelectorAll('main > section');

  if (reduceMotion || !sections.length) return;

  var ticking = false;

  function updateShrink() {
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top < 0 && rect.height > 0) {
        var progress = Math.min(1, -rect.top / rect.height);
        section.style.transform = 'scale(' + (1 - progress * 0.12).toFixed(3) + ')';
        section.style.opacity = (1 - progress * 0.5).toFixed(3);
      } else {
        section.style.transform = '';
        section.style.opacity = '';
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateShrink);
      ticking = true;
    }
  }, { passive: true });

  updateShrink();
});

// "Así trabajamos": la ventana estilo mockup va mostrando un paso a la vez,
// avanzando solo cada pocos segundos, en loop. Con reduced-motion se queda
// fijo en el paso 1 (sin animar) en vez de rotar.
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var steps = document.querySelectorAll('.process-step');
  var slides = document.querySelectorAll('.mockup-slide');
  var layout = document.querySelector('.process-layout');

  if (reduceMotion || !steps.length || !slides.length) return;

  var current = 0;
  var interval = null;

  function setActive(index) {
    steps.forEach(function (step, i) { step.classList.toggle('is-active', i === index); });
    slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === index); });
  }

  function advance() {
    current = (current + 1) % steps.length;
    setActive(current);
  }

  function start() {
    if (!interval) interval = window.setInterval(advance, 3800);
  }
  function stop() {
    window.clearInterval(interval);
    interval = null;
  }

  start();

  if (layout) {
    layout.addEventListener('mouseenter', stop);
    layout.addEventListener('mouseleave', start);
  }

  // También se puede ir directo a un paso apretando su fila en la lista.
  steps.forEach(function (step, i) {
    step.addEventListener('click', function () {
      current = i;
      setActive(current);
      stop();
      start();
    });
  });
});
