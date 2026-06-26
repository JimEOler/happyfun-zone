import { ThemeConfig, Project, GuestbookEntry } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  'green-matrix': {
    id: 'green-matrix',
    name: 'Matrix Green (CRT)',
    isDark: true,
    bgClass: 'bg-zinc-950',
    textClass: 'text-[#00ff41] font-mono',
    borderClass: 'border-[#00ff41]/35',
    accentClass: 'text-[#ff00ff]',
    cursorClass: 'bg-[#00ff41] shadow-[0_0_8px_#00ff41]',
    mutedClass: 'text-[#00aa2d]',
    titleClass: 'text-[#00ff41] font-bold cyber-glow-text',
    selectionClass: 'selection:bg-[#330033] selection:text-[#ff00ff]',
    gridColor: 'rgba(0, 255, 65, 0.05)'
  },
  'phosphor-amber': {
    id: 'phosphor-amber',
    name: 'Amber CRT (Retro)',
    isDark: true,
    bgClass: 'bg-[#070500]',
    textClass: 'text-[#ffb000] font-mono',
    borderClass: 'border-[#ffb000]/35',
    accentClass: 'text-[#fbbf24]',
    cursorClass: 'bg-[#ffb000] shadow-[0_0_8px_#ffb000]',
    mutedClass: 'text-[#78350f]',
    titleClass: 'text-[#ffb000] font-bold cyber-glow-text',
    selectionClass: 'selection:bg-[#3d1900] selection:text-[#ffb000]',
    gridColor: 'rgba(255, 176, 0, 0.05)'
  }
};

export const VGA_PALETTE = [
  '#000000', // Black
  '#0000aa', // Blue
  '#00aa00', // Green
  '#00aaaa', // Cyan
  '#aa0000', // Red
  '#aa00aa', // Magenta
  '#aa5500', // Brown
  '#aaaaaa', // Light Gray
  '#555555', // Dark Gray
  '#5555ff', // Light Blue
  '#55ff55', // Light Green
  '#55ffff', // Light Cyan
  '#ff5555', // Light Red
  '#ff55ff', // Light Magenta
  '#ffff55', // Yellow
  '#ffffff'  // White
];

export const ASCII_LOGO = `
 ██░ ██  ▄▄▄       ██▓███   ██▓███ ▓██   ██▓  ██████ █    ██  ███▄    █ ▓█████ 
▓██░ ██▒▒████▄    ▓██░  ██▒▓██░  ██▒▒██  ██▒▒██    ▒ ██  ▓██▒ ██ ▀█   █ ▓█   ▀ 
▒██▀▀██░▒██  ▀█▄  ▓██░ ██▓▒▓██░ ██▓▒ ▒██ ██░░ ▓██▄   ▓██  ▒██░██ ▀█ │ █ ▒███   
░▓█ ░██ ░██▄▄▄▄██ ▒██▄█▓▒ ▒▒██▄█▓▒ ▒ ░ ▐██▓░  ▒   ██▒▓██  ░██░██  ▀█ ██▒▒▓█  ▄ 
░▓█▒░██▓ ▓█   ▓██▒▒██▒ ░  ░▒██▒ ░  ░  ██▒ ░ ▒██████▒▒▒██████▒▒██▒  ▐▌██▒░▒████▒
 ▒ ░░▒░▒ ▒▒   ▓▒█░▒▓▒░ ░  ░▒▓▒░ ░  ░  ██▒ ░ ▒ ▒▓▒ ▒ ░░ ▒░▓  ░░ ▒░   ▓ ▒ ░░ ▐░ ░
 ▒ ░▒░ ░  ▒   ▒▒ ░░▒ ░     ░▒ ░       ▒ ░░  ░ ░▒  ░ ░░ ░ ▒  ░░ ░░   ▒ ▒░ ░ ░  ░
 ░  ░░ ░  ░   ▒   ░░       ░░         ░ ░   ░  ░  ░    ░ ░ ░     ░   ░ ░    ░   
 ░  ░  ░      ░  ░                    ░           ░      ░           ░    ░  ░ 
                                      ░                                        
`;

export const NEOFETCH_INFO = {
  os: "HappyfunOS v3.5.2-LTS",
  host: "happyfun.zone",
  kernel: "WebRuntime-React19.0.1",
  uptime: "42m 12s",
  shell: "ReactTSH v1.1.0 (Interactive CLI)",
  terminal: "Xterm-Xft-TUI (VT100 Emulation)",
  resolution: "Flexible Responsive Layout",
  font: "JetBrains Mono (Monospaced)",
  cpu: "Gemini Pro Multi-Core V4",
  memory: "512MB / 1024MB allocated",
  author: "Jim Oler (jim.oler@gmail.com)"
};

export const BIOGRAPHY_MARKDOWN = `
# SYSTEM OVERVIEW: JIM OLER

Jim Oler is an independent digital experimentalist, software engineer, and the founder of the original **happyfun.zone** digital playground. With a heavy appreciation for vintage systems, text-based interactive software, and lightweight, performant web standards, Jim designs minimalist experiences that combine nostalgic retro computing styles with cutting-edge capabilities.

---

## INTELLECT / DISCIPLINARY DIRECTIVES

*   **Retro UI / TUI Engineering**: Specializes in crafting full-fidelity text-user interfaces, terminal environments, and terminal gaming engines optimized directly for modern high-refresh browser rendering.
*   **Web Mechanics**: Committed to absolute page performance, zero-dependency visual layouts, and offline-first persistence architectures.
*   **Creative Experiments**: Believes the web should be an interactive adventure of play, curiosity, and aesthetic joy—thus, the birth of the **happyfun.zone** project sandbox.

---

## HISTORIC ARCHIVES

*   **THE ORIGINAL HAPPYFUN.ZONE**: First established as a playground to host experimental WebGL physics models, MIDI loop synthesizers, and pixel editors.
*   **CRT DIGITAL PRESERVATION**: Actively builds modern web wrappers that simulate Cathode-Ray Tube (CRT) visual dynamics, phosphor latency, scanlines, and tactile 8-bit audio feeds.
*   **EMULATORS & CONTEXTUAL TERMINALS**: Engineered multi-state retro shells inside high-performance client architectures to provide lightweight access portals to heavy-duty data sheets.
`;

export const PROJECTS: Project[] = [
  {
    id: 'pixelator',
    title: 'THE PIXELATOR (8-bit Canvas)',
    description: 'An interactive pixel canvas allowing you to design retro 8-bit sprites and export them as high-quality CSS box-shadow code or ANSI terminal escape blocks.',
    tags: ['React', 'HTML5 Canvas', 'ANSI Export'],
    category: 'Creativity',
    iconName: 'Paintbrush',
    status: 'online'
  },
  {
    id: 'audio-synth',
    title: 'HAPPYFUN SYNTHESIZER',
    description: 'A miniature Web Audio API synth that lets you trigger retro 8-bit key-notes, generate calming background white/pink static noise, and adjust frequency loops.',
    tags: ['Web Audio API', 'Waveform Synth', 'Oscillators'],
    category: 'Multimedia',
    iconName: 'Radio',
    status: 'online'
  },
  {
    id: 'matrix-rain',
    title: 'CRT DIGITAL RAIN SCREEN',
    description: 'A canvas-rendered implementation of the green matrix digital rainfall effect with variable densities, decay speeds, and character modes.',
    tags: ['Canvas 2D', 'Micro-Animation', 'CRT Shader'],
    category: 'Aesthetics',
    iconName: 'Zap',
    status: 'online'
  },
  {
    id: 'system-snake',
    title: 'TUI SYSTEM SNAKE',
    description: 'A fully functional arcade Snake game embedded within a monospaced text grid. Playable on both touch-screen swipes and keyboard arrow keys!',
    tags: ['Monospaced Engine', 'Arcade Game', 'High Score System'],
    category: 'Gaming',
    iconName: 'Gamepad2',
    status: 'online'
  }
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: '1',
    name: 'RetroFan_99',
    message: 'Oh wow! This TUI is incredibly smooth. The CRT effect feels so authentic. Loving the vibe!',
    timestamp: '2026-06-23 14:24:10'
  },
  {
    id: '2',
    name: 'DevAlice',
    message: 'Awesome work Jim! The Snake game actually works flawlessly on my iPhone. The collapsing sidebar on mobile is great.',
    timestamp: '2026-06-24 09:12:05'
  },
  {
    id: '3',
    name: 'Linus_W',
    message: 'neofetch inside the terminal shows exactly what I wanted. Nice touch with the JetBrains Mono font.',
    timestamp: '2026-06-24 11:45:00'
  }
];
