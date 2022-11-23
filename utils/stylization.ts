const COLORS = [
  {
    hex: "#a4bdfc",
    value: CalendarApp.EventColor.PALE_BLUE,
  },
  {
    hex: "#7ae7bf",
    value: CalendarApp.EventColor.PALE_GREEN,
  },
  {
    hex: "#bdadff",
    value: CalendarApp.EventColor.MAUVE,
  },
  {
    hex: "#ff887c",
    value: CalendarApp.EventColor.PALE_RED,
  },
  {
    hex: "#AB8B00",
    value: CalendarApp.EventColor.YELLOW,
  },
  {
    hex: "#BE6D00",
    value: CalendarApp.EventColor.ORANGE,
  },
  {
    hex: "#46d6db",
    value: CalendarApp.EventColor.CYAN,
  },
  {
    hex: "#5a6986",
    value: CalendarApp.EventColor.GRAY,
  },
  {
    hex: "#2952a3",
    value: CalendarApp.EventColor.BLUE,
  },
  {
    hex: "#0d7813",
    value: CalendarApp.EventColor.GREEN,
  },
  {
    hex: "#a32929",
    value: CalendarApp.EventColor.RED,
  },
] as {
  hex: string;
  value: any;
}[];
const SHORTHAND_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

type RGB = { r: number; g: number; b: number };

function distance(a: RGB, b: RGB) {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2)
  );
}

function hexToRgb(hex: string): null | RGB {
  hex = hex.replace(SHORTHAND_REGEX, function (_: any, r: any, g: any, b: any) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return !result
    ? null
    : {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
}

function nearestColor(colorHex: string): any {
  let tmp = 0;
  let index = 0;
  let lowest = Number.POSITIVE_INFINITY;

  COLORS.forEach((el, i) => {
    tmp = distance(hexToRgb(colorHex), hexToRgb(el.hex));
    if (tmp > lowest) return;

    index = i;
    lowest = tmp;
  });
  return COLORS[index].value;
}
