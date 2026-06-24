import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal as TerminalIcon,
  Menu,
  X,
  User,
  FolderGit2,
  BookOpen,
  Gamepad2,
  Volume2,
  VolumeX,
  Radio,
  Tv,
  Paintbrush,
  Download,
  Trash2,
  Clock,
  Play,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react';
import { PageId, ThemeId, GuestbookEntry, Project } from './types';
import { THEMES, INITIAL_GUESTBOOK, PROJECTS, BIOGRAPHY_MARKDOWN, ASCII_LOGO } from './data';
import Terminal from './components/Terminal';
import SnakeGame from './components/SnakeGame';
import MatrixRain from './components/MatrixRain';

export default function App() {
  // Navigation & Theme State
  const [activePage, setActivePage] = useState<PageId>('home');
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('happyfun_theme') as ThemeId) || 'green-matrix';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Retro Options States
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('happyfun_sound') === 'true';
  });
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  // Guestbook Persistent State
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(() => {
    const cached = localStorage.getItem('happyfun_guestbook');
    if (cached) {
      try { return JSON.parse(cached); } catch { return INITIAL_GUESTBOOK; }
    }
    return INITIAL_GUESTBOOK;
  });

  // Project Interactive Workspaces: Pixelator & Synth
  const [pixelGrid, setPixelGrid] = useState<string[][]>(() =>
    Array(12).fill(null).map(() => Array(12).fill('transparent'))
  );
  const [activeColor, setActiveColor] = useState('#00ff66');
  const [synthOscType, setSynthOscType] = useState<OscillatorType>('sine');
  const [synthOctave, setSynthOctave] = useState<number>(4);

  // Active theme configuration
  const theme = THEMES[themeId] || THEMES['green-matrix'];

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save guestbook entries to local storage
  useEffect(() => {
    localStorage.setItem('happyfun_guestbook', JSON.stringify(guestbookEntries));
  }, [guestbookEntries]);

  // Handle media click synthesizer sounds
  const playClickSound = (frequency = 600, duration = 0.08, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      // Decaying volume profile
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Browser blocked autoplays
    }
  };

  const handleActionClick = () => {
    playClickSound(800, 0.05, 'sine');
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem('happyfun_sound', String(nextState));
    if (nextState) {
      // Small beep indicator
      setTimeout(() => {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.15);
        } catch {}
      }, 50);
    }
  };

  const handleThemeToggle = (selectedId: ThemeId) => {
    setThemeId(selectedId);
    localStorage.setItem('happyfun_theme', selectedId);
    playClickSound(440, 0.12, 'triangle');
  };

  // Add guestbook log
  const handleAddGuestbookEntry = (name: string, message: string) => {
    if (!name.trim() || !message.trim()) return;
    const newEntry: GuestbookEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim().substring(0, 20),
      message: message.trim().substring(0, 100),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setGuestbookEntries((prev) => [newEntry, ...prev]);
    playClickSound(987.77, 0.15, 'sine'); // B5 chime
  };

  // Synth key notes frequencies mapping (Octave 4)
  const NOTES: Record<string, number> = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
  };

  const playSynthNote = (noteName: string) => {
    const baseFreq = NOTES[noteName];
    if (!baseFreq) return;
    
    // Scale according to chosen octave
    const multiplier = Math.pow(2, synthOctave - 4);
    const frequency = baseFreq * multiplier;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = synthOscType;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  };

  // Pixel grid click toggles
  const handlePixelClick = (rIdx: number, cIdx: number) => {
    handleActionClick();
    setPixelGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[rIdx][cIdx] = copy[rIdx][cIdx] === 'transparent' ? activeColor : 'transparent';
      return copy;
    });
  };

  // Export pixel art as CSS box-shadows
  const exportPixelArtShadows = () => {
    handleActionClick();
    let shadows = [];
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        if (pixelGrid[r][c] !== 'transparent') {
          shadows.push(`${c * 8}px ${r * 8}px 0 ${pixelGrid[r][c]}`);
        }
      }
    }
    const cssCode = `box-shadow: ${shadows.join(', ')};`;
    navigator.clipboard.writeText(cssCode);
    alert('Box-shadow styling code copied to clipboard! Frame is 12x12 scaling by 8px offsets.');
  };

  const clearPixelGrid = () => {
    handleActionClick();
    setPixelGrid(Array(12).fill(null).map(() => Array(12).fill('transparent')));
  };

  // Nav items helper
  const NAV_ITEMS = [
    { id: 'home', label: 'Dashboard', icon: Tv },
    { id: 'about', label: 'About_Jim', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'guestbook', label: 'Guestbook', icon: BookOpen },
    { id: 'snake', label: 'System_Snake', icon: Gamepad2 },
    { id: 'terminal', label: 'TUI_Terminal', icon: TerminalIcon }
  ];

  return (
    <div
      className={`min-h-screen relative flex flex-col crt-screen overflow-hidden ${theme.bgClass} ${theme.textClass} ${theme.selectionClass} font-mono transition-colors duration-500`}
      id="app-root-container"
    >
      {/* Dynamic Scanlines Overlay */}
      {scanlinesEnabled && (
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[size:100%_4px] opacity-70" />
      )}

      {/* Falling Matrix Rain in the Background */}
      {matrixEnabled && (
        <MatrixRain themeId={themeId} opacity={theme.isDark ? 0.12 : 0.05} />
      )}

      {/* HEADER BAR (Highly Mobile & Desktop Responsive) */}
      <header
        className={`flex items-center justify-between px-4 py-2 border-b ${theme.borderClass} z-40 bg-opacity-95 bg-inherit shrink-0`}
        id="app-header"
      >
        <div className="flex items-center gap-3">
          {/* Hamburger toggle for mobile drawer, slide toggle for desktop sidebar */}
          <button
            onClick={() => {
              handleActionClick();
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-1 border rounded cursor-pointer active:scale-95 transition-transform"
            aria-label="Toggle navigation bar"
            id="nav-toggle-btn"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          
          <div className="flex flex-col">
            <span className={`text-base font-bold tracking-widest ${theme.accentClass}`}>HAPPYFUN.ZONE</span>
            <span className="text-[10px] opacity-40 hidden xs:inline">STABLE PORTAL INTERFACE</span>
          </div>
        </div>

        {/* Global Hardware Utilities */}
        <div className="flex items-center gap-2 text-xs">
          {/* System UTC/Local Clock */}
          <div className="hidden md:flex items-center gap-1 opacity-70">
            <Clock size={12} />
            <span>{systemTime}</span>
          </div>

          <span className="hidden sm:inline opacity-30">|</span>

          {/* Sound Toggle Beep */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-2 py-1 border rounded hover:bg-emerald-500/5 cursor-pointer`}
            title={soundEnabled ? 'Mute System Beeps' : 'Enable System Beeps'}
            id="sound-toggle-btn"
          >
            {soundEnabled ? <Volume2 size={13} className="text-emerald-500 animate-pulse" /> : <VolumeX size={13} className="opacity-50" />}
            <span className="hidden xs:inline">{soundEnabled ? 'SOUND: ON' : 'SOUND: OFF'}</span>
          </button>

          {/* Matrix Toggle */}
          <button
            onClick={() => {
              handleActionClick();
              setMatrixEnabled(!matrixEnabled);
            }}
            className={`flex items-center gap-1.5 px-2 py-1 border rounded hover:bg-emerald-500/5 cursor-pointer`}
            title="Toggle Background digital rainfall"
            id="matrix-toggle-btn"
          >
            {matrixEnabled ? <Eye size={13} className="text-emerald-500" /> : <EyeOff size={13} className="opacity-50" />}
            <span className="hidden xs:inline">MATRIX</span>
          </button>

          {/* Quick theme toggler (Dark / Light print theme quickly) */}
          <button
            onClick={() => {
              if (theme.isDark) {
                handleThemeToggle('retro-paper');
              } else {
                handleThemeToggle('green-matrix');
              }
            }}
            className={`p-1.5 border rounded hover:bg-emerald-500/5 cursor-pointer`}
            title="Toggle dark/light paper theme"
            id="theme-quick-btn"
          >
            {theme.isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative" id="layout-body">
        
        {/* DESKTOP SIDEBAR - COLLAPSIBLE */}
        <aside
          className={`hidden md:flex flex-col border-r ${theme.borderClass} transition-all duration-300 overflow-hidden bg-opacity-95 bg-inherit z-30 shrink-0`}
          style={{ width: sidebarOpen ? '240px' : '0px' }}
          id="desktop-sidebar"
        >
          {/* Theme Selector Widget */}
          <div className={`p-4 border-b ${theme.borderClass}`}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Tv size={14} />
              <span className="text-xs font-bold uppercase opacity-85 tracking-wider">CRT DISPLAY SYSTEM</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => (
                <button
                  key={tId}
                  onClick={() => handleThemeToggle(tId)}
                  className={`w-full text-left px-2.5 py-1 border transition-all cursor-pointer uppercase ${
                    themeId === tId
                      ? 'bg-current text-black font-bold border-current'
                      : 'border border-transparent opacity-60 hover:opacity-100 hover:bg-current/10'
                  }`}
                  id={`theme-select-${tId}`}
                >
                  &gt; {THEMES[tId].name}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] opacity-50 border-t border-current pt-2.5">
              <span>SCANLINES:</span>
              <button
                onClick={() => { handleActionClick(); setScanlinesEnabled(!scanlinesEnabled); }}
                className="hover:underline font-bold"
              >
                [{scanlinesEnabled ? 'ENABLED' : 'DISABLED'}]
              </button>
            </div>
          </div>

          {/* Directory Navigation */}
          <nav className="flex-1 p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-3">SYSTEM FILE DIRECTORY</div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleActionClick();
                    setActivePage(item.id as PageId);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left cursor-pointer uppercase ${
                    activePage === item.id
                      ? 'bg-current text-black font-bold border-current'
                      : 'border border-transparent opacity-70 hover:opacity-100 hover:bg-current/10'
                  }`}
                  id={`sidebar-nav-${item.id}`}
                >
                  <Icon size={14} />
                  <span className="text-xs">/{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer branding */}
          <div className="p-4 border-t border-current text-[10px] opacity-40 text-center">
            HAPPYFUN.ZONE © 2026<br />
            NODE // jim.oler@gmail.com
          </div>
        </aside>

        {/* MOBILE SLIDEOUT DRAWER / MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Back Drop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden absolute inset-0 bg-black/80 z-30"
              />

              {/* Slider Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className={`md:hidden absolute top-0 bottom-0 left-0 w-64 border-r ${theme.borderClass} ${theme.bgClass} z-40 p-4 flex flex-col`}
                id="mobile-drawer"
              >
                <div className="flex items-center justify-between mb-4 border-b border-current pb-2">
                  <span className="font-bold tracking-widest text-sm uppercase">/HAPPYFUN/ROOT</span>
                  <button
                    onClick={() => { handleActionClick(); setMobileMenuOpen(false); }}
                    className="p-1 border rounded"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Directory list */}
                <nav className="space-y-1.5 flex-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleActionClick();
                          setActivePage(item.id as PageId);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 border transition-all text-left uppercase ${
                          activePage === item.id
                            ? 'bg-current text-black font-bold border-current'
                            : 'border-transparent opacity-80 hover:bg-current/10'
                        }`}
                        id={`mobile-nav-${item.id}`}
                      >
                        <Icon size={14} />
                        <span className="text-xs">/{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Display Theme Picker */}
                <div className="border-t border-current pt-4 mt-4 text-xs">
                  <span className="font-bold block mb-2 opacity-50 uppercase tracking-wider">Change Color Palette:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(THEMES) as ThemeId[]).map((tId) => (
                      <button
                        key={tId}
                        onClick={() => handleThemeToggle(tId)}
                        className={`px-2 py-1.5 border text-center text-xs truncate uppercase ${
                          themeId === tId ? 'bg-current text-black font-bold border-current' : 'opacity-60 border-current/20 hover:opacity-100 hover:bg-current/5'
                        }`}
                        id={`mobile-theme-${tId}`}
                      >
                        {THEMES[tId].name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN STAGE CONTENT (With subtle Page Slide/Fade transitions) */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 relative" id="app-main-stage">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col max-w-4xl mx-auto w-full"
            >
              
              {/* PAGE: HOME (System Neofetch & Quick Hub) */}
              {activePage === 'home' && (
                <div className="space-y-6" id="view-home">
                  {/* Decorative ascii banner card */}
                  <div className={`p-4 border ${theme.borderClass} ${theme.isDark ? 'bg-black/40' : 'bg-transparent'}`}>
                    <pre className="text-[5px] xs:text-[7px] sm:text-[9px] md:text-xs leading-none text-center select-none whitespace-pre overflow-x-auto text-cyan-400">
                      {ASCII_LOGO}
                    </pre>
                  </div>

                  {/* Dual Grid Layout: System overview on left, fast widgets on right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* System Parameters Card (Neofetch mockup) */}
                    <div className={`md:col-span-7 border p-4 ${theme.borderClass}`}>
                      <div className="flex items-center gap-2 mb-4 border-b border-current pb-2">
                        <Tv size={16} />
                        <h2 className="text-sm font-bold uppercase tracking-wider">HappyfunOS Core Neofetch</h2>
                      </div>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p><span className={theme.accentClass}>USER@NODE</span>: happyfun.zone</p>
                        <p><span className="opacity-50">----------------------------</span></p>
                        <p><span className="opacity-60">OS</span>: HappyfunOS v3.5.2-LTS</p>
                        <p><span className="opacity-60">Kernel</span>: WebRuntime-React19.0.1</p>
                        <p><span className="opacity-60">Uptime</span>: 42m 12s</p>
                        <p><span className="opacity-60">Shell</span>: ReactTSH v1.1.0 (Interactive CLI)</p>
                        <p><span className="opacity-60">Resolution</span>: Flexible Responsive Layout</p>
                        <p><span className="opacity-60">Font</span>: Courier New (Monospaced)</p>
                        <p><span className="opacity-60">CPU</span>: Gemini Pro Multi-Core V4</p>
                        <p><span className="opacity-60">Primary Email</span>: jim.oler@gmail.com</p>
                        <p><span className="opacity-60">Domain Admin</span>: Jim Oler</p>
                      </div>

                      <div className="mt-5 flex gap-1.5 flex-wrap">
                        <span className="w-6 h-4 bg-red-600 inline-block"></span>
                        <span className="w-6 h-4 bg-green-600 inline-block"></span>
                        <span className="w-6 h-4 bg-yellow-500 inline-block"></span>
                        <span className="w-6 h-4 bg-blue-600 inline-block"></span>
                        <span className="w-6 h-4 bg-purple-600 inline-block"></span>
                        <span className="w-6 h-4 bg-cyan-500 inline-block"></span>
                        <span className="w-6 h-4 bg-slate-300 inline-block"></span>
                      </div>
                    </div>

                    {/* Operational Commands Prompt Card */}
                    <div className={`md:col-span-5 flex flex-col justify-between border p-4 ${theme.borderClass}`}>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">QUICK TELEMETRY</h3>
                        <p className="text-xs opacity-70 mb-4 leading-relaxed">
                          Welcome to the personal sandbox of Jim Oler. This domain Happyfun.zone hosts lightweight, micro-functional, non-destructive web emulators.
                        </p>
                        <p className="text-xs opacity-70 mb-4">
                          You are currently accessing a clean monospaced layout built for speed, performance, and cross-device accessibility.
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-current">
                        <button
                          onClick={() => { handleActionClick(); setActivePage('terminal'); }}
                          className={`w-full py-2 border border-current font-bold text-center text-xs hover:bg-current hover:text-black block transition-all cursor-pointer`}
                          id="btn-goto-cli"
                        >
                          [ LAUNCH INTERACTIVE SHELL ]
                        </button>
                        <button
                          onClick={() => { handleActionClick(); setActivePage('snake'); }}
                          className={`w-full py-2 border border-current font-bold text-center text-xs hover:bg-current hover:text-black block transition-all cursor-pointer`}
                          id="btn-goto-snake"
                        >
                          [ BOOT TUI arcade SNAKE ]
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE: ABOUT (Biography / Mission) */}
              {activePage === 'about' && (
                <div className={`border p-4 md:p-6 ${theme.borderClass} space-y-6 leading-relaxed`} id="view-about">
                  <div className="flex items-center gap-2 border-b border-current pb-2">
                    <User size={18} />
                    <h2 className="text-base font-bold uppercase tracking-widest">ABOUT_JIM_OLER.md</h2>
                  </div>

                  <article className="prose prose-invert text-xs sm:text-sm space-y-4 max-w-none text-current leading-relaxed">
                    <p className="font-bold text-sm sm:text-base text-yellow-500">SYSTEM ARCHIVIST / RETRO EXPERIMENTALIST</p>
                    <p>
                      Jim Oler is an independent digital designer, full-stack engineer, and the curator of the original 
                      <span className={theme.accentClass}> happyfun.zone</span> sandbox domain.
                    </p>
                    <p>
                      In a web heavily over-engineered with multi-megabyte script frameworks, Jim champions absolute 
                      mechanical simplicity. By using lightweight custom-buffered drawing canvases, procedural Web Audio synth oscillators, 
                      and local-first web memory indexes, Jim crafts highly performant web environments that are as engaging as they are ultra-fast.
                    </p>

                    <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mt-6 mb-1">■ TECHNICAL SPECIALIST MODULES</h3>
                    <ul className="list-disc pl-5 space-y-1 opacity-90">
                      <li><strong>TUI & Canvas Graphics</strong>: High-speed, responsive CRT and matrix graphic emulations.</li>
                      <li><strong>Web Synthesis</strong>: Dynamic tone generation via procedural Web Audio API nodes.</li>
                      <li><strong>Performance Architecture</strong>: Heavy responsive testing across Android, iPhone, and wide desktop screens.</li>
                    </ul>

                    <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mt-6 mb-1">■ DIGITAL CONTACT TRANSMISSIONS</h3>
                    <p className="opacity-90">
                      Jim maintains open network routing ports. You are encouraged to dispatch a message on his personal email: 
                      <span className="underline ml-1 text-emerald-400">jim.oler@gmail.com</span>, or log your name and arrival timestamp 
                      into the interactive ledger.
                    </p>
                  </article>

                  <div className="pt-4 border-t border-current flex justify-between">
                    <button
                      onClick={() => { handleActionClick(); setActivePage('guestbook'); }}
                      className="text-xs hover:underline font-bold cursor-pointer"
                      id="about-btn-guestbook"
                    >
                      &gt; Open local Guestbook log
                    </button>
                    <span className="text-[10px] opacity-30">Status: Verified</span>
                  </div>
                </div>
              )}

              {/* PAGE: PROJECTS (Retro workspaces: Synth & Pixelator) */}
              {activePage === 'projects' && (
                <div className="space-y-6" id="view-projects">
                  
                  {/* Grid layout of projects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* WORKSPACE 1: Synthesizer */}
                    <div className={`border p-4 rounded ${theme.borderClass} flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center gap-2 border-b border-current pb-2 mb-3">
                          <Radio size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">SYSTEM AUDIO SYNTHESIZER</h3>
                        </div>
                        <p className="text-xs opacity-70 mb-4 leading-relaxed">
                          An interactive 8-bit synthesizer using the browser Web Audio API. Procedurally triggers waveforms.
                        </p>

                        {/* Synth controls */}
                        <div className="bg-black/20 p-3 rounded border border-current mb-4 text-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span>WAVEFORM:</span>
                            <div className="flex gap-1.5">
                              {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((type) => (
                                <button
                                  key={type}
                                  onClick={() => { handleActionClick(); setSynthOscType(type); }}
                                  className={`px-1.5 py-0.5 border text-[10px] rounded uppercase ${
                                    synthOscType === type ? 'font-bold bg-current/10 border-current' : 'opacity-60 border-transparent'
                                  }`}
                                  id={`synth-wave-${type}`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>OCTAVE:</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => { handleActionClick(); synthOctave > 1 && setSynthOctave(o => o - 1); }}
                                className="px-1.5 border rounded cursor-pointer"
                                id="synth-octave-down"
                              >
                                -
                              </button>
                              <span className="font-bold">{synthOctave}</span>
                              <button
                                onClick={() => { handleActionClick(); synthOctave < 7 && setSynthOctave(o => o + 1); }}
                                className="px-1.5 border rounded cursor-pointer"
                                id="synth-octave-up"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Piano Keys */}
                        <div className="flex gap-1 w-full overflow-x-auto pb-2 justify-center" id="synth-keyboard">
                          {Object.keys(NOTES).map((n) => {
                            const isSharp = n.includes('#');
                            return (
                              <button
                                key={n}
                                onClick={() => playSynthNote(n)}
                                className={`px-2.5 py-6 border rounded font-bold text-xs select-none active:scale-90 transition-transform cursor-pointer ${
                                  isSharp 
                                    ? 'bg-black text-white border-slate-700 font-normal py-4' 
                                    : 'bg-transparent text-current border-current'
                                }`}
                                id={`synth-key-${n.replace('#', 's')}`}
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* WORKSPACE 2: Pixelator */}
                    <div className={`border p-4 rounded ${theme.borderClass} flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center gap-2 border-b border-current pb-2 mb-3">
                          <Paintbrush size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">THE 8-BIT PIXELATOR</h3>
                        </div>
                        <p className="text-xs opacity-70 mb-4 leading-relaxed">
                          Design custom sprites inside this 12x12 retro bitmap matrix. Tap pixels to draw!
                        </p>

                        {/* Pixelator workspace */}
                        <div className="flex flex-col items-center gap-3">
                          {/* Grid drawing canvas */}
                          <div className="border border-current p-1 bg-black/10">
                            <div className="grid grid-cols-12 gap-0.5 w-44 sm:w-52">
                              {pixelGrid.map((row, rIdx) =>
                                row.map((cell, cIdx) => (
                                  <button
                                    key={`${rIdx}-${cIdx}`}
                                    onClick={() => handlePixelClick(rIdx, cIdx)}
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 border border-current/10 cursor-crosshair hover:bg-current/20"
                                    style={{ backgroundColor: cell }}
                                    aria-label={`Pixel row ${rIdx}, col ${cIdx}`}
                                    id={`pixel-${rIdx}-${cIdx}`}
                                  />
                                ))
                              )}
                            </div>
                          </div>

                          {/* Drawing tools */}
                          <div className="flex items-center justify-between w-full text-xs">
                            <div className="flex gap-2">
                              {['#00ff66', '#ffb000', '#00f0ff', '#ef4444'].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => { handleActionClick(); setActiveColor(color); }}
                                  className="w-5 h-5 rounded border border-current cursor-pointer"
                                  style={{ backgroundColor: color, transform: activeColor === color ? 'scale(1.15)' : 'none' }}
                                  id={`pixel-color-${color.replace('#', '')}`}
                                />
                              ))}
                            </div>

                            <div className="flex gap-1.5">
                              <button
                                onClick={exportPixelArtShadows}
                                className="px-2 py-1 border rounded flex items-center gap-1 hover:bg-emerald-500/10 cursor-pointer"
                                id="pixel-btn-export"
                              >
                                <Download size={11} />
                                <span>COPY CSS</span>
                              </button>
                              <button
                                onClick={clearPixelGrid}
                                className="px-2 py-1 border rounded flex items-center gap-1 hover:bg-red-500/10 cursor-pointer"
                                id="pixel-btn-clear"
                              >
                                <Trash2 size={11} />
                                <span>RESET</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Standard descriptions list of all other projects */}
                  <div className={`border p-4 rounded ${theme.borderClass}`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b border-current pb-2">ALL ARCHIVES REFERENCE LEDGER</h3>
                    <div className="space-y-4 text-xs sm:text-sm">
                      {PROJECTS.map((p) => {
                        return (
                          <div key={p.id} className="border-b border-current/20 pb-3 last:border-0 last:pb-0">
                            <p className="font-bold text-yellow-500">{p.title} <span className="text-[10px] border border-current px-1 uppercase opacity-60 ml-2">{p.status}</span></p>
                            <p className="opacity-70 mt-1">{p.description}</p>
                            <div className="flex gap-1.5 mt-2 flex-wrap text-[10px]">
                              {p.tags.map(t => <span key={t} className="px-1.5 py-0.5 border border-current/30 rounded">{t}</span>)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* PAGE: GUESTBOOK (Durable Local persistence guestbook ledger) */}
              {activePage === 'guestbook' && (
                <div className="space-y-6" id="view-guestbook">
                  {/* Ledger display box */}
                  <div className={`border p-4 md:p-6 rounded ${theme.borderClass}`}>
                    <div className="flex items-center gap-2 border-b border-current pb-2 mb-4">
                      <BookOpen size={16} />
                      <h2 className="text-xs font-bold uppercase tracking-wider">HAPPYFUN DATABASE LEDGER</h2>
                    </div>

                    <p className="text-xs opacity-70 mb-5 leading-relaxed">
                      Leave your signature stamp below to record your arrival into Happyfun.zone! 
                      Signatures are securely saved directly within your browser local index database.
                    </p>

                    {/* Submit stamp Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target as HTMLFormElement;
                        const name = (target.elements.namedItem('g_name') as HTMLInputElement).value;
                        const msg = (target.elements.namedItem('g_msg') as HTMLInputElement).value;
                        if (!name || !msg) return;
                        handleAddGuestbookEntry(name, msg);
                        target.reset();
                      }}
                      className="space-y-3 text-xs bg-black/10 p-4 border border-current rounded mb-6"
                      id="guestbook-form"
                    >
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 space-y-1">
                          <label htmlFor="g_name" className="font-bold opacity-80 uppercase block">NODE IDENTITY (Name):</label>
                          <input
                            type="text"
                            id="g_name"
                            name="g_name"
                            maxLength={20}
                            required
                            className="w-full bg-transparent border border-current rounded px-2 py-1.5 focus:outline-none font-mono text-current text-xs"
                            placeholder="e.g. RetroHacker"
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label htmlFor="g_msg" className="font-bold opacity-80 uppercase block">MESSAGE (Max 100 chars):</label>
                          <input
                            type="text"
                            id="g_msg"
                            name="g_msg"
                            maxLength={100}
                            required
                            className="w-full bg-transparent border border-current rounded px-2 py-1.5 focus:outline-none font-mono text-current text-xs"
                            placeholder="e.g. Awesome retro console UI!"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 border border-current font-bold hover:bg-current hover:text-black cursor-pointer active:scale-95 transition-transform"
                          id="guestbook-submit-btn"
                        >
                          [ SUBMIT LOG ENTRY ]
                        </button>
                      </div>
                    </form>

                    {/* Records List */}
                    <div className="space-y-3" id="guestbook-list">
                      <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">■ ARCHIVED TRANSMISSIONS</h3>
                      {guestbookEntries.length === 0 ? (
                        <p className="text-xs opacity-40 text-center py-4">No logged transmissions found.</p>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {guestbookEntries.map((e) => (
                            <div key={e.id} className="p-3 border border-current/20 rounded text-xs hover:bg-current/5 transition-colors">
                              <div className="flex justify-between border-b border-current/10 pb-1 mb-1 opacity-65">
                                <span className={`font-bold ${theme.accentClass}`}>{e.name}</span>
                                <span>{e.timestamp}</span>
                              </div>
                              <p className="opacity-90">{e.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE: ARCADE SNAKE GAME */}
              {activePage === 'snake' && (
                <div className={`border p-4 rounded ${theme.borderClass} space-y-4`} id="view-snake">
                  <div className="flex items-center gap-2 border-b border-current pb-2 mb-2 justify-between">
                    <div className="flex items-center gap-2">
                      <Gamepad2 size={16} />
                      <h2 className="text-xs font-bold uppercase tracking-wider">RETRO_SNAKE.EXE SYSTEM</h2>
                    </div>
                    <button
                      onClick={() => { handleActionClick(); setActivePage('home'); }}
                      className="text-[10px] hover:underline cursor-pointer"
                      id="snake-btn-exit"
                    >
                      [ EXIT ]
                    </button>
                  </div>
                  <SnakeGame theme={theme} />
                </div>
              )}

              {/* PAGE: COMMAND TERMINAL CLI */}
              {activePage === 'terminal' && (
                <div className={`border rounded flex-1 flex flex-col min-h-[400px] ${theme.borderClass}`} id="view-terminal">
                  {/* Status strip top */}
                  <div className={`flex items-center justify-between px-3 py-1.5 border-b ${theme.borderClass} text-xs bg-opacity-10 bg-current`}>
                    <span className="font-bold opacity-80 uppercase flex items-center gap-1.5">
                      <TerminalIcon size={13} className="text-emerald-500" />
                      interactive_react_bash.sh
                    </span>
                    <span className="opacity-40">VT100 (80x24)</span>
                  </div>
                  {/* Interactive Terminal */}
                  <Terminal
                    theme={theme}
                    onThemeChange={handleThemeToggle}
                    guestbookEntries={guestbookEntries}
                    onAddGuestbookEntry={handleAddGuestbookEntry}
                    onToggleMatrix={() => setMatrixEnabled(!matrixEnabled)}
                    onNavigate={(pId) => setActivePage(pId as PageId)}
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
