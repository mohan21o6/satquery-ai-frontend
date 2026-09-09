import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Crescent Moon
const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="60%" stop-color="#93c5fd" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="moonNoise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="
        0.3 0.3 0.3 0 0
        0.3 0.3 0.3 0 0
        0.3 0.3 0.3 0 0
        0   0   0   1 0" in="noise" result="desat"/>
      <feComposite in="SourceGraphic" in2="desat" operator="arithmetic" k1="0.6" k2="0.6" k3="0.1" k4="0"/>
    </filter>
    <mask id="crescentMask">
      <circle cx="100" cy="100" r="70" fill="#fff"/>
      <circle cx="128" cy="94" r="62" fill="#000"/>
    </mask>
    <linearGradient id="crescentShade" x1="0%" y1="30%" x2="100%" y2="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
  </defs>
  
  <circle cx="100" cy="100" r="95" fill="url(#moonGlow)"/>
  <circle cx="100" cy="100" r="70" fill="url(#crescentShade)" mask="url(#crescentMask)" filter="url(#moonNoise)"/>
  
  <!-- Subtle crater rims -->
  <g mask="url(#crescentMask)" opacity="0.6">
    <ellipse cx="65" cy="85" rx="9" ry="7" fill="none" stroke="#475569" stroke-width="1.5"/>
    <ellipse cx="63" cy="84" rx="7" ry="5.5" fill="#1e293b" opacity="0.5"/>
    <ellipse cx="50" cy="115" rx="14" ry="11" fill="none" stroke="#475569" stroke-width="2"/>
    <ellipse cx="48" cy="114" rx="11" ry="8" fill="#1e293b" opacity="0.4"/>
    <ellipse cx="80" cy="55" rx="8" ry="6" fill="none" stroke="#475569" stroke-width="1.2"/>
    <circle cx="70" cy="135" r="5" fill="#334155" opacity="0.5"/>
    <circle cx="58" cy="65" r="4" fill="#334155" opacity="0.4"/>
  </g>
</svg>`;

// 2. Agriculture Monitoring
const agSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <filter id="agNoise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="
        0.2 0.8 0.1 0 0
        0.4 0.6 0.1 0 0
        0.1 0.3 0.1 0 0
        0   0   0   0.4 0" in="noise" result="colored"/>
      <feBlend in="SourceGraphic" in2="colored" mode="multiply"/>
    </filter>
    <linearGradient id="agSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#022c22" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#052e16" stop-opacity="0.2"/>
    </linearGradient>
  </defs>

  <rect width="600" height="450" fill="#143e22"/>
  
  <!-- Farmland Grid and Parcels -->
  <g opacity="0.9">
    <!-- Various crop field polygons -->
    <polygon points="0,0 180,0 200,160 0,140" fill="#15803d"/>
    <polygon points="180,0 360,0 380,180 200,160" fill="#166534"/>
    <polygon points="360,0 600,0 600,150 380,180" fill="#14532d"/>
    
    <polygon points="0,140 200,160 170,300 0,280" fill="#4d7c0f"/>
    <polygon points="200,160 380,180 350,330 170,300" fill="#16a34a"/>
    <polygon points="380,180 600,150 600,320 350,330" fill="#22c55e" fill-opacity="0.75"/>
    
    <polygon points="0,280 170,300 190,450 0,450" fill="#15803d"/>
    <polygon points="170,300 350,330 370,450 190,450" fill="#3f6212"/>
    <polygon points="350,330 600,320 600,450 370,450" fill="#14532d"/>

    <!-- Circular Pivot Irrigation fields -->
    <circle cx="100" cy="70" r="55" fill="#22c55e" fill-opacity="0.7"/>
    <circle cx="100" cy="70" r="50" fill="none" stroke="#15803d" stroke-width="4" stroke-dasharray="8 4"/>
    <circle cx="290" cy="80" r="65" fill="#84cc16" fill-opacity="0.6"/>
    <circle cx="490" cy="75" r="60" fill="#15803d" fill-opacity="0.8"/>

    <circle cx="260" cy="245" r="70" fill="#4ade80" fill-opacity="0.5"/>
    <circle cx="480" cy="235" r="68" fill="#16a34a" fill-opacity="0.7"/>
    <circle cx="85" cy="380" r="60" fill="#65a30d" fill-opacity="0.6"/>
    <circle cx="280" cy="390" r="55" fill="#15803d" fill-opacity="0.75"/>
    <circle cx="490" cy="390" r="65" fill="#22c55e" fill-opacity="0.6"/>

    <!-- Farm tracks & irrigation canals -->
    <line x1="0" y1="140" x2="600" y2="150" stroke="#713f12" stroke-width="3" opacity="0.6"/>
    <line x1="0" y1="280" x2="600" y2="320" stroke="#0ea5e9" stroke-width="3" opacity="0.7"/>
    <line x1="180" y1="0" x2="190" y2="450" stroke="#713f12" stroke-width="3" opacity="0.6"/>
    <line x1="370" y1="0" x2="360" y2="450" stroke="#0284c7" stroke-width="4" opacity="0.7"/>
  </g>

  <!-- High-altitude atmosphere haze & vignette -->
  <rect width="600" height="450" fill="url(#agSky)"/>
  <rect width="600" height="450" fill="none" stroke="#00e5ff" stroke-width="1" opacity="0.1"/>
</svg>`;

// 3. Disaster Management (Flood inundation satellite view)
const disasterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c4a6e"/>
      <stop offset="50%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#082f49"/>
    </linearGradient>
    <filter id="disasterHaze">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="turb"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.9  0 0 0 0 1  0 0 0 0.25 0" result="clouds"/>
      <feBlend in="SourceGraphic" in2="clouds" mode="screen"/>
    </filter>
  </defs>

  <!-- Land base -->
  <rect width="600" height="450" fill="#2d3748"/>
  
  <!-- River basin & catastrophic flood plain -->
  <path d="M-20,120 Q120,80 220,140 T440,110 T620,160 L620,380 Q480,420 320,340 T120,400 T-20,320 Z" fill="url(#waterFlow)" opacity="0.95"/>
  
  <!-- Submerged urban grid lines -->
  <g stroke="#94a3b8" stroke-width="1" opacity="0.4">
    <line x1="50" y1="180" x2="250" y2="180"/>
    <line x1="50" y1="210" x2="250" y2="210"/>
    <line x1="50" y1="240" x2="250" y2="240"/>
    <line x1="80" y1="160" x2="80" y2="260"/>
    <line x1="120" y1="160" x2="120" y2="260"/>
    <line x1="160" y1="160" x2="160" y2="260"/>
    <line x1="200" y1="160" x2="200" y2="260"/>
  </g>

  <!-- Silt plumes and emergency zones highlighted -->
  <path d="M180,170 Q280,210 380,190 T560,240" stroke="#0284c7" stroke-width="22" stroke-linecap="round" opacity="0.6"/>
  <path d="M80,260 Q200,310 360,280 T590,320" stroke="#38bdf8" stroke-width="12" opacity="0.7"/>

  <!-- Inundation warning polygons -->
  <polygon points="140,160 210,170 230,220 160,240" fill="#ef4444" fill-opacity="0.35" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="320,220 420,210 440,290 350,310" fill="#ef4444" fill-opacity="0.3" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2"/>

  <!-- Atmosphere -->
  <rect width="600" height="450" fill="#040d1a" fill-opacity="0.3" filter="url(#disasterHaze)"/>
</svg>`;

// 4. Urban Planning
const urbanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <linearGradient id="urbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="600" height="450" fill="url(#urbanGrad)"/>
  
  <!-- Coastal water edge -->
  <path d="M450,0 Q430,200 490,450 L600,450 L600,0 Z" fill="#0369a1" opacity="0.8"/>

  <!-- Dense high-rise building footprints with shadows -->
  <g fill="#475569" stroke="#334155" stroke-width="1">
    <!-- Sector 1 -->
    <rect x="40" y="40" width="45" height="35" fill="#64748b"/>
    <rect x="43" y="43" width="45" height="35" fill="#0f172a" opacity="0.4"/>
    <rect x="95" y="40" width="60" height="35" fill="#94a3b8"/>
    <rect x="165" y="40" width="40" height="35" fill="#64748b"/>
    <rect x="215" y="40" width="55" height="35" fill="#cbd5e1"/>
    
    <rect x="40" y="90" width="70" height="40" fill="#64748b"/>
    <rect x="120" y="90" width="45" height="40" fill="#cbd5e1"/>
    <rect x="175" y="90" width="65" height="40" fill="#94a3b8"/>

    <!-- Sector 2 Skyscrapers -->
    <rect x="40" y="160" width="80" height="60" fill="#e2e8f0"/>
    <rect x="130" y="160" width="90" height="50" fill="#94a3b8"/>
    <rect x="230" y="160" width="70" height="60" fill="#cbd5e1"/>
    <rect x="310" y="150" width="80" height="70" fill="#f8fafc"/>

    <rect x="40" y="240" width="55" height="70" fill="#64748b"/>
    <rect x="105" y="240" width="75" height="60" fill="#94a3b8"/>
    <rect x="190" y="230" width="100" height="80" fill="#e2e8f0"/>
    <rect x="300" y="240" width="90" height="70" fill="#cbd5e1"/>

    <!-- Port containers -->
    <rect x="410" y="120" width="25" height="60" fill="#38bdf8" opacity="0.8"/>
    <rect x="410" y="200" width="30" height="70" fill="#f97316" opacity="0.8"/>
    <rect x="410" y="290" width="28" height="80" fill="#eab308" opacity="0.8"/>
  </g>

  <!-- Highway arteries (cyan/yellow night illumination) -->
  <line x1="0" y1="145" x2="450" y2="145" stroke="#38bdf8" stroke-width="4" opacity="0.8"/>
  <line x1="280" y1="0" x2="280" y2="450" stroke="#00e5ff" stroke-width="4" opacity="0.8"/>
  <line x1="0" y1="330" x2="470" y2="330" stroke="#38bdf8" stroke-width="3" opacity="0.7"/>
  <circle cx="280" cy="145" r="25" fill="none" stroke="#00e5ff" stroke-width="3"/>

  <!-- Subtle zoning overlays -->
  <polygon points="180,220 300,220 300,320 180,320" fill="#00e5ff" fill-opacity="0.12" stroke="#00e5ff" stroke-width="1.5" stroke-dasharray="4 2"/>
</svg>`;

// 5. Forest Monitoring
const forestSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <radialGradient id="canopy" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="50%" stop-color="#14532d"/>
      <stop offset="100%" stop-color="#052e16"/>
    </radialGradient>
  </defs>

  <rect width="600" height="450" fill="url(#canopy)"/>
  
  <!-- Meandering Amazonian River -->
  <path d="M-10,80 C150,140 180,20 320,120 C420,200 400,380 610,340" fill="none" stroke="#164e63" stroke-width="45" stroke-linecap="round"/>
  <path d="M-10,80 C150,140 180,20 320,120 C420,200 400,380 610,340" fill="none" stroke="#0891b2" stroke-width="32" stroke-linecap="round" opacity="0.85"/>
  <path d="M-10,80 C150,140 180,20 320,120 C420,200 400,380 610,340" fill="none" stroke="#67e8f9" stroke-width="8" stroke-linecap="round" opacity="0.5"/>

  <!-- Canopy clusters -->
  <g fill="#22c55e" opacity="0.3">
    <circle cx="90" cy="280" r="45"/>
    <circle cx="160" cy="330" r="55"/>
    <circle cx="480" cy="80" r="60"/>
    <circle cx="530" cy="140" r="40"/>
    <circle cx="120" cy="50" r="35"/>
    <circle cx="490" cy="220" r="50"/>
  </g>

  <!-- Deforestation monitoring boundary -->
  <polygon points="350,300 480,280 510,410 380,430" fill="#eab308" fill-opacity="0.2" stroke="#facc15" stroke-width="2" stroke-dasharray="6 3"/>
  <text x="390" y="370" fill="#fde047" font-family="monospace" font-size="12" font-weight="bold">CANOPY LOSS ALERT</text>
</svg>`;

// 6. Water Resource Assessment
const waterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="40%" stop-color="#0369a1"/>
      <stop offset="80%" stop-color="#0c4a6e"/>
      <stop offset="100%" stop-color="#082f49"/>
    </linearGradient>
  </defs>

  <rect width="600" height="450" fill="url(#oceanGrad)"/>

  <!-- Sandbanks, atoll reefs and barrier islands -->
  <path d="M50,120 Q180,90 280,190 T520,160" fill="none" stroke="#38bdf8" stroke-width="70" stroke-linecap="round" opacity="0.4"/>
  <path d="M50,120 Q180,90 280,190 T520,160" fill="none" stroke="#a5f3fc" stroke-width="35" stroke-linecap="round" opacity="0.5"/>
  <path d="M70,125 Q180,95 280,195 T500,165" fill="none" stroke="#fef08a" stroke-width="12" stroke-linecap="round" opacity="0.8"/>

  <!-- Lake and reservoir contour lines -->
  <ellipse cx="200" cy="320" rx="140" ry="70" fill="#0284c7" opacity="0.6"/>
  <ellipse cx="200" cy="320" rx="100" ry="50" fill="#0369a1" opacity="0.8"/>
  <ellipse cx="200" cy="320" rx="60" ry="30" fill="#082f49"/>

  <!-- Turbidity / depth telemetry lines -->
  <circle cx="200" cy="320" r="8" fill="#00e5ff"/>
  <line x1="200" y1="320" x2="280" y2="280" stroke="#00e5ff" stroke-width="1.5"/>
  <rect x="280" y="270" width="95" height="24" rx="4" fill="#040914" fill-opacity="0.8" stroke="#00e5ff" stroke-width="1"/>
  <text x="288" y="286" fill="#38bdf8" font-family="monospace" font-size="11">DEPTH: 42.8m</text>
</svg>`;

// 7. Infrastructure Mapping
const infraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <rect width="600" height="450" fill="#1e293b"/>

  <!-- Waterway with massive suspension bridge -->
  <rect x="0" y="160" width="600" height="130" fill="#0f172a"/>
  <line x1="250" y1="0" x2="250" y2="450" stroke="#94a3b8" stroke-width="26"/>
  <line x1="250" y1="0" x2="250" y2="450" stroke="#f8fafc" stroke-width="4" stroke-dasharray="12 12"/>

  <!-- Cloverleaf Interchange -->
  <circle cx="450" cy="320" r="50" fill="none" stroke="#64748b" stroke-width="10"/>
  <circle cx="450" cy="320" r="30" fill="none" stroke="#00e5ff" stroke-width="3"/>
  <line x1="330" y1="320" x2="600" y2="320" stroke="#64748b" stroke-width="14"/>
  <line x1="450" y1="200" x2="450" y2="450" stroke="#64748b" stroke-width="14"/>

  <!-- Airport Runway Complex -->
  <rect x="30" y="30" width="180" height="28" rx="2" fill="#334155" transform="rotate(-25 120 44)"/>
  <line x1="20" y1="80" x2="210" y2="-10" stroke="#f8fafc" stroke-width="2" stroke-dasharray="10 8"/>

  <!-- Bounding box detection on terminal hub -->
  <rect x="380" y="40" width="140" height="90" rx="4" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="2"/>
  <text x="390" y="60" fill="#38bdf8" font-family="monospace" font-size="11">LOGISTICS HUB A-4</text>
</svg>`;

// 8. Bitemporal 2022 (Natural river bend and rural agriculture)
const bi2022Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="#2d4030"/>
  
  <!-- River sweeping down center -->
  <path d="M220,0 C260,150 180,240 230,360 C260,430 240,480 250,500" fill="none" stroke="#164e63" stroke-width="50" stroke-linecap="round"/>
  <path d="M220,0 C260,150 180,240 230,360 C260,430 240,480 250,500" fill="none" stroke="#0891b2" stroke-width="36" stroke-linecap="round" opacity="0.8"/>

  <!-- Farmland parcels & natural forest (2022) -->
  <rect x="20" y="30" width="120" height="90" fill="#365314" opacity="0.8"/>
  <rect x="20" y="130" width="130" height="110" fill="#4d7c0f" opacity="0.7"/>
  <circle cx="80" cy="340" r="50" fill="#15803d" opacity="0.7"/>
  
  <!-- Eastern area: largely green/rural in 2022 -->
  <polygon points="320,60 460,40 480,180 340,160" fill="#3f6212" opacity="0.8"/>
  <polygon points="330,200 480,190 470,360 310,340" fill="#2e4a1f" opacity="0.85"/>
  <circle cx="400" cy="270" r="45" fill="#365314" opacity="0.6"/>

  <!-- Small existing hamlet -->
  <g fill="#94a3b8">
    <rect x="330" y="100" width="8" height="6"/>
    <rect x="345" y="102" width="10" height="7"/>
    <rect x="338" y="115" width="7" height="6"/>
  </g>

  <!-- Timestamp overlay -->
  <rect x="15" y="15" width="130" height="26" rx="4" fill="#000" fill-opacity="0.7"/>
  <text x="25" y="32" fill="#fff" font-family="sans-serif" font-size="12" font-weight="bold">OPTICAL · OCT 2022</text>
</svg>`;

// 9. Bitemporal 2024 (Urban expansion in eastern sector)
const bi2024Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="#2d4030"/>
  
  <!-- Same River -->
  <path d="M220,0 C260,150 180,240 230,360 C260,430 240,480 250,500" fill="none" stroke="#164e63" stroke-width="50" stroke-linecap="round"/>
  <path d="M220,0 C260,150 180,240 230,360 C260,430 240,480 250,500" fill="none" stroke="#0891b2" stroke-width="36" stroke-linecap="round" opacity="0.8"/>

  <!-- Western parcels remain similar -->
  <rect x="20" y="30" width="120" height="90" fill="#365314" opacity="0.8"/>
  <rect x="20" y="130" width="130" height="110" fill="#4d7c0f" opacity="0.7"/>
  <circle cx="80" cy="340" r="50" fill="#15803d" opacity="0.7"/>

  <!-- EASTERN REGION: NEW HEAVY URBAN EXPANSION (2024) -->
  <polygon points="320,60 460,40 480,180 340,160" fill="#64748b" opacity="0.9"/>
  <polygon points="330,200 480,190 470,360 310,340" fill="#475569" opacity="0.9"/>

  <!-- Dense new industrial/residential structures -->
  <g fill="#cbd5e1" stroke="#334155" stroke-width="0.5">
    <rect x="330" y="70" width="30" height="20"/>
    <rect x="370" y="65" width="40" height="25"/>
    <rect x="420" y="75" width="35" height="30"/>
    <rect x="340" y="110" width="50" height="30"/>
    <rect x="400" y="120" width="45" height="25"/>
    
    <rect x="330" y="210" width="35" height="30"/>
    <rect x="375" y="215" width="45" height="35"/>
    <rect x="430" y="220" width="30" height="30"/>
    <rect x="340" y="260" width="60" height="40"/>
    <rect x="410" y="270" width="50" height="35"/>
  </g>

  <!-- New highways connecting -->
  <line x1="280" y1="120" x2="480" y2="120" stroke="#f1f5f9" stroke-width="4"/>
  <line x1="390" y1="50" x2="390" y2="350" stroke="#f1f5f9" stroke-width="4"/>
  <line x1="260" y1="280" x2="480" y2="280" stroke="#f1f5f9" stroke-width="3"/>

  <!-- Timestamp overlay -->
  <rect x="15" y="15" width="130" height="26" rx="4" fill="#000" fill-opacity="0.7"/>
  <text x="25" y="32" fill="#fff" font-family="sans-serif" font-size="12" font-weight="bold">OPTICAL · OCT 2024</text>
</svg>`;

// 10. Bitemporal Change Map (Vivid red/crimson highlighting detected changes)
const biChangeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <filter id="changeGlow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Dark base image -->
  <rect width="500" height="500" fill="#18201a"/>
  
  <!-- Subtle River -->
  <path d="M220,0 C260,150 180,240 230,360 C260,430 240,480 250,500" fill="none" stroke="#0f2933" stroke-width="50" stroke-linecap="round"/>

  <!-- Unchanged areas in dim monochrome -->
  <rect x="20" y="30" width="120" height="90" fill="#1e2e1a" opacity="0.5"/>
  <rect x="20" y="130" width="130" height="110" fill="#22331c" opacity="0.5"/>

  <!-- DETECTED CHANGE POLYGONS IN RADIANT RED/ORANGE -->
  <g filter="url(#changeGlow)">
    <!-- Major Cluster North-East -->
    <polygon points="320,60 460,40 480,170 340,155" fill="#ef4444" fill-opacity="0.85" stroke="#f87171" stroke-width="3"/>
    
    <!-- Major Cluster South-East -->
    <polygon points="330,200 470,195 460,350 320,330" fill="#dc2626" fill-opacity="0.88" stroke="#f87171" stroke-width="3"/>

    <!-- Corridor connection -->
    <polygon points="380,155 410,155 410,200 380,200" fill="#f97316" fill-opacity="0.9" stroke="#fb923c" stroke-width="2"/>
  </g>

  <!-- Change labels -->
  <rect x="335" y="75" width="115" height="22" rx="3" fill="#000" fill-opacity="0.85" stroke="#ef4444" stroke-width="1"/>
  <text x="342" y="90" fill="#fee2e2" font-family="monospace" font-size="11" font-weight="bold">+ BUILT-UP (NEW)</text>

  <rect x="335" y="225" width="115" height="22" rx="3" fill="#000" fill-opacity="0.85" stroke="#ef4444" stroke-width="1"/>
  <text x="342" y="240" fill="#fee2e2" font-family="monospace" font-size="11" font-weight="bold">+ INFRASTRUCTURE</text>

  <!-- Legend & Timestamp -->
  <rect x="15" y="15" width="165" height="26" rx="4" fill="#000" fill-opacity="0.8"/>
  <circle cx="28" cy="28" r="5" fill="#ef4444"/>
  <text x="40" y="32" fill="#fff" font-family="sans-serif" font-size="11" font-weight="bold">CHANGE DETECTED (91%)</text>
</svg>`;

// Write all files
const files = {
  'crescent_moon.svg': moonSvg,
  'usecase_agriculture.svg': agSvg,
  'usecase_disaster.svg': disasterSvg,
  'usecase_urban.svg': urbanSvg,
  'usecase_forest.svg': forestSvg,
  'usecase_water.svg': waterSvg,
  'usecase_infrastructure.svg': infraSvg,
  'bitemporal_2022.svg': bi2022Svg,
  'bitemporal_2024.svg': bi2024Svg,
  'bitemporal_change.svg': biChangeSvg,
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(assetsDir, filename), content.trim());
  console.log('Generated:', filename);
}
console.log('All vector and remote-sensing assets generated successfully!');
