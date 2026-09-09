import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'public', 'assets');

// High-fidelity scene matching Reference Screenshot 3
const riverSceneSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 650" width="800" height="650">
  <defs>
    <linearGradient id="riverWater" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c3a4d"/>
      <stop offset="35%" stop-color="#114f66"/>
      <stop offset="70%" stop-color="#0e4256"/>
      <stop offset="100%" stop-color="#092d3c"/>
    </linearGradient>
    <linearGradient id="eastFields" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14361c"/>
      <stop offset="50%" stop-color="#1c4826"/>
      <stop offset="100%" stop-color="#0e2a14"/>
    </linearGradient>
  </defs>

  <!-- Base Terrain Background -->
  <rect width="800" height="650" fill="#131e17"/>

  <!-- WEST SIDE: Dense Urban Grid (Left bank) -->
  <g opacity="0.95">
    <rect x="0" y="0" width="410" height="650" fill="#243038"/>

    <!-- Urban block parcels -->
    <rect x="20" y="30" width="80" height="60" fill="#384955"/>
    <rect x="110" y="30" width="100" height="70" fill="#475b6a"/>
    <rect x="220" y="20" width="90" height="60" fill="#384955"/>
    
    <rect x="15" y="110" width="90" height="80" fill="#30404c"/>
    <rect x="120" y="120" width="110" height="90" fill="#4f6374"/>
    <rect x="250" y="100" width="80" height="70" fill="#384955"/>

    <rect x="30" y="220" width="120" height="90" fill="#475b6a"/>
    <rect x="170" y="230" width="100" height="110" fill="#384955"/>
    <rect x="290" y="200" width="60" height="80" fill="#4f6374"/>

    <rect x="20" y="340" width="130" height="120" fill="#30404c"/>
    <rect x="170" y="360" width="120" height="100" fill="#475b6a"/>

    <rect x="30" y="480" width="140" height="140" fill="#384955"/>
    <rect x="190" y="480" width="150" height="130" fill="#475b6a"/>

    <!-- Dense building footprints & rooftops -->
    <g fill="#9cb4c5" opacity="0.8">
      <rect x="35" y="45" width="22" height="18"/>
      <rect x="65" y="45" width="25" height="16"/>
      <rect x="125" y="45" width="35" height="20"/>
      <rect x="170" y="48" width="30" height="25"/>
      <rect x="235" y="35" width="28" height="20"/>

      <rect x="35" y="125" width="30" height="22"/>
      <rect x="75" y="125" width="20" height="25"/>
      <rect x="135" y="135" width="40" height="30"/>
      <rect x="185" y="140" width="35" height="25"/>
      <rect x="260" y="115" width="25" height="30"/>

      <rect x="45" y="235" width="45" height="30"/>
      <rect x="100" y="240" width="35" height="25"/>
      <rect x="185" y="245" width="40" height="35"/>
      <rect x="235" y="250" width="25" height="30"/>

      <rect x="40" y="360" width="50" height="35"/>
      <rect x="105" y="370" width="35" height="30"/>
      <rect x="185" y="380" width="45" height="40"/>
      <rect x="240" y="390" width="35" height="30"/>

      <rect x="50" y="500" width="45" height="40"/>
      <rect x="110" y="510" width="40" height="35"/>
      <rect x="210" y="500" width="55" height="40"/>
      <rect x="280" y="510" width="40" height="45"/>
    </g>

    <!-- West Urban Roads & Arteries -->
    <g stroke="#627d92" stroke-width="3.5" stroke-linecap="round">
      <line x1="0" y1="100" x2="350" y2="100"/>
      <line x1="0" y1="210" x2="350" y2="210"/>
      <line x1="0" y1="330" x2="380" y2="330"/>
      <line x1="0" y1="465" x2="430" y2="465"/>
      <line x1="105" y1="0" x2="105" y2="650"/>
      <line x1="220" y1="0" x2="220" y2="650"/>
      <line x1="335" y1="0" x2="335" y2="650"/>
    </g>
  </g>

  <!-- EAST SIDE: Agricultural Land & Vegetation (Right bank) -->
  <g fill="url(#eastFields)">
    <rect x="430" y="0" width="370" height="650"/>
    
    <!-- Agricultural Field Polygons -->
    <polygon points="440,20 580,10 590,140 450,130" fill="#2d5e35"/>
    <polygon points="590,10 740,20 730,150 590,140" fill="#3f7a49"/>
    <polygon points="740,20 800,20 800,160 730,150" fill="#224b29"/>

    <polygon points="460,150 600,160 590,290 470,280" fill="#4d8b58"/>
    <polygon points="610,160 740,170 750,300 600,290" fill="#346a3d"/>
    <polygon points="750,170 800,170 800,320 750,300" fill="#275530"/>

    <polygon points="480,300 620,310 610,450 490,430" fill="#285a31"/>
    <polygon points="630,310 770,320 760,460 620,450" fill="#478051"/>
    <polygon points="770,320 800,320 800,470 760,460" fill="#1b4122"/>

    <polygon points="510,460 640,470 630,620 520,600" fill="#397343"/>
    <polygon points="650,470 780,480 770,630 640,620" fill="#23502b"/>
    <polygon points="780,480 800,480 800,640 770,630" fill="#42784b"/>

    <!-- Forest Canopies (Dense green clusters) -->
    <circle cx="530" cy="80" r="35" fill="#123519" opacity="0.8"/>
    <circle cx="680" cy="90" r="45" fill="#173f1f" opacity="0.8"/>
    <circle cx="520" cy="220" r="40" fill="#13381a" opacity="0.85"/>
    <circle cx="700" cy="240" r="50" fill="#184221" opacity="0.8"/>
    <circle cx="540" cy="380" r="45" fill="#113317" opacity="0.8"/>
    <circle cx="710" cy="400" r="55" fill="#1a4523" opacity="0.8"/>
    <circle cx="560" cy="540" r="40" fill="#153c1c" opacity="0.8"/>
    <circle cx="730" cy="560" r="48" fill="#123519" opacity="0.85"/>

    <!-- Rural farm tracks -->
    <line x1="430" y1="140" x2="800" y2="155" stroke="#8c7d65" stroke-width="2.5" opacity="0.7"/>
    <line x1="450" y1="290" x2="800" y2="305" stroke="#8c7d65" stroke-width="2.5" opacity="0.7"/>
    <line x1="470" y1="440" x2="800" y2="460" stroke="#8c7d65" stroke-width="2.5" opacity="0.7"/>
    <line x1="600" y1="0" x2="630" y2="650" stroke="#8c7d65" stroke-width="3" opacity="0.7"/>
    <line x1="740" y1="0" x2="760" y2="650" stroke="#8c7d65" stroke-width="2.5" opacity="0.7"/>
  </g>

  <!-- MAJOR RIVER: Flows Diagonally from top-left to bottom-right -->
  <path d="M370,-20 
           C390,120 340,240 430,380 
           C490,480 540,570 590,670 
           L690,670 
           C630,550 580,450 510,340 
           C440,220 480,100 460,-20 
           Z" 
        fill="url(#riverWater)" 
        stroke="#1a5a75" 
        stroke-width="3"/>

  <!-- Water Surface Reflections & Currents -->
  <path d="M400,30 Q440,150 390,260 T480,420 T580,620" fill="none" stroke="#257291" stroke-width="6" opacity="0.5" stroke-linecap="round"/>
  <path d="M420,80 Q450,180 410,290 T500,450 T610,640" fill="none" stroke="#4898b8" stroke-width="2" opacity="0.6" stroke-linecap="round"/>

  <!-- ROAD BRIDGE: Spanning Across the River -->
  <!-- Bridge shadow -->
  <line x1="290" y1="365" x2="570" y2="315" stroke="#061822" stroke-width="16" opacity="0.6"/>
  <!-- Bridge deck -->
  <line x1="290" y1="360" x2="570" y2="310" stroke="#cbd5e1" stroke-width="11"/>
  <!-- Highway lane divider -->
  <line x1="290" y1="360" x2="570" y2="310" stroke="#334155" stroke-width="2" stroke-dasharray="8 6"/>
  <!-- Bridge Piers in water -->
  <ellipse cx="400" cy="340" rx="6" ry="12" fill="#475569" transform="rotate(-10 400 340)"/>
  <ellipse cx="460" cy="330" rx="6" ry="12" fill="#475569" transform="rotate(-10 460 330)"/>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'workspace_river_scene.svg'), riverSceneSvg.trim());
console.log('workspace_river_scene.svg generated successfully!');
