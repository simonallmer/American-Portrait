const fs = require('fs');
const svgPath = './games/american-playing-cards/3d-box/A1 AmericanPlayingCardsLogo_v2.svg';
const jsPath = './games/american-playing-cards/3d-box/tuck-box-3d.js';

let svgContent = fs.readFileSync(svgPath, 'utf8');

// The original EAGLE uses ${GOLD} color.
// We need to inject the gold color to the SVG. VTracer usually sets fill="#000000" or similar, 
// but wait, the SVG provided doesn't seem to have a fill color in the <path> tag. 
// Let's add fill="${GOLD}" into the <svg> tag.
svgContent = svgContent.replace('<svg ', '<svg fill="${GOLD}" ');

const b64 = Buffer.from(svgContent).toString('base64');
const eagleStr = 'const EAGLE = `<image href="data:image/svg+xml;base64,' + b64 + '" x="0" y="0" width="100" height="100"/>`;';

let jsContent = fs.readFileSync(jsPath, 'utf8');
jsContent = jsContent.replace(/const EAGLE = `<path d="M50 20.*?\/>`;/, eagleStr);

fs.writeFileSync(jsPath, jsContent);
console.log("Updated EAGLE successfully!");
