

function createSVG(text) {
    let svgWidth = 1920;
    let svgHeight = 260;  
    let padding = 40;
    let rounded = 20;

    let sub = text.split(',');

    let svg = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="f1">
        <feDropShadow dx="10" dy="10" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
    </defs>
    <rect x="${padding}" y="${padding}" rx="${rounded}" ry="${rounded}" width="${svgWidth - (padding * 2) }" height="200" fill="white"  filter="url(#f1)"/>
    `;
    
    sub.forEach((s, index) => {
        svg += `<text x="940" y="${(index * 60) + 60}" font-size="30" text-anchor="middle" fill="black" font-weight="bold" font-family="arial" textLength="1800" lengthAdjust="spacingAndGlyphs">
            ${s}
        </text>`;
    });

    svg += '</svg>';
    
    return svg;    
}

module.exports = { createSVG };

/* <svg width="1920" height="220" xmlns="http://www.w3.org/2000/svg">
<rect x="20" y="20" rx="20" ry="20" width="1880" height="200" fill="blue" />
<text x="940" y="80" font-size="20" text-anchor="middle" fill="black" font-weight="bold" font-family="arial" textLength="1800" lengthAdjust="spacingAndGlyphs">Some super long text goes here and we can see if we can get this thing to start overlapping like a badman ting on crack and that. What is going on. Blablalalalalalalalalalalala</text>
</svg> */