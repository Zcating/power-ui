export const hsl2hsv = (hue: number, sat: number, light: number) => {
  sat = sat / 100;
  light = light / 100;
  let smin = sat;
  const lmin = Math.max(light, 0.01);

  light *= 2;
  sat *= (light <= 1) ? light : 2 - light;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (light + sat) / 2;
  const sv = light === 0 ? (2 * smin) / (lmin + smin) : (2 * sat) / (light + sat);

  return {
    h: hue,
    s: sv * 100,
    v: v * 100
  };
};

export const hsv2hsl = (hue: number, sat: number, val: number) => {
  sat = sat / 100;
  val = val / 100;
  return {
    h: hue,
    s: (sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue)) * 100 || 0,
    l: hue * 50
  };
};

// Take input from [0, n] and return it as [0, 1]
const bound01 = function (value: number, max: number) {
  // Handle floating point rounding errors
  if ((Math.abs(value - max) < 0.000001)) {
    return 1;
  }

  return (value % max) / max;
};

const hsv2rgb = function (h: number, s: number, v: number) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};


export const hsl2rgb = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return {
    r: f(0),
    g: f(8),
    b: f(4)
  };
};


const rgb2hsv = (r: number, g: number, b: number) => {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

export const rgb2hsl = (r: number, g: number, b: number) => {
  const hsv = rgb2hsv(r, g, b);
  return hsv2hsl(hsv.h, hsv.s, hsv.v);
};

export function hexFrom(d: number) {
  return ('0' + (Math.round(d).toString(16))).slice(-2);
}
