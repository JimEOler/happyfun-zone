import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { TerminalLine, ThemeConfig, Project, GuestbookEntry, ThemeId } from '../types';
import { NEOFETCH_INFO, ASCII_LOGO, PROJECTS } from '../data';

interface TerminalProps {
  theme: ThemeConfig;
  onThemeChange: (themeId: ThemeId) => void;
  guestbookEntries: GuestbookEntry[];
  onAddGuestbookEntry: (name: string, message: string) => void;
  onToggleMatrix: () => void;
  onNavigate: (pageId: string) => void;
}

export default function Terminal({
  theme,
  onThemeChange,
  guestbookEntries,
  onAddGuestbookEntry,
  onToggleMatrix,
  onNavigate
}: TerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'welcome-logo',
      text: ASCII_LOGO,
      type: 'ascii',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'welcome-msg',
      text: `*** WELCOME TO HAPPYFUN.ZONE SHELL v3.5 ***\nType 'help' to see available commands or click sidebar directories.\n`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const COMMANDS = [
    'help',
    'about',
    'projects',
    'skills',
    'contact',
    'guestbook',
    'neofetch',
    'snake',
    'matrix',
    'theme',
    'clear',
    'time'
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click of terminal area
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus input automatically on mount
  useEffect(() => {
    focusInput();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = inputVal.trim();
      if (!command) return;

      // Add to command history
      const nextHistory = [command, ...commandHistory];
      setCommandHistory(nextHistory);
      setHistoryPointer(-1);

      // Execute
      executeCommand(command);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextPointer = historyPointer + 1;
      if (nextPointer < commandHistory.length) {
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextPointer = historyPointer - 1;
      if (nextPointer >= 0) {
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      } else {
        setHistoryPointer(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentWord = inputVal.trim();
      if (!currentWord) return;

      const matched = COMMANDS.find((cmd) => cmd.startsWith(currentWord));
      if (matched) {
        setInputVal(matched);
      }
    }
  };

  const executeCommand = (fullCmd: string) => {
    const args = fullCmd.split(' ');
    const command = args[0].toLowerCase();
    const timestamp = new Date().toLocaleTimeString();
    const id = Math.random().toString(36).substr(2, 9);

    // Insert original command echo
    const newLines: TerminalLine[] = [
      {
        id: `echo-${id}`,
        text: `happyfun@guest:~$ ${fullCmd}`,
        type: 'input',
        timestamp
      }
    ];

    switch (command) {
      case 'help':
        newLines.push({
          id: `out-${id}`,
          text: `AVAILABLE TERMINAL DIRECTIVES:
  help               Display this operational registry
  about              Learn about Jim Oler & happyfun.zone
  projects           List experimental visual & audio software
  skills             Display specialist engineering areas
  contact            Acquire digital transmission endpoints
  guestbook          Inspect log entries or sign (see below)
  neofetch           Output full system specification parameters
  snake              Boot up the retro monospaced Snake arcade game
  matrix             Toggle interactive background digital rain
  theme [style]      Configure CRT aesthetics: green | retro
  clear              Purge all terminal console rows
  time               Request current synchronized local timestamp

GUESTBOOK USAGE:
  To sign, type: guestbook sign [your_name] [your_message]
  Example: guestbook sign Alice Great terminal emulator!`,
          type: 'output',
          timestamp
        });
        break;

      case 'about':
        newLines.push({
          id: `out-${id}`,
          text: `JIM OLER - CORE SYSTEMS SPECIALIST
Independent digital experimentalist, retro archivist, and operator of happyfun.zone.
He specializes in browser-based text layout renderers, custom retro-game cycles, 
and low-overhead software engineering. Jim is on a mission to build authentic,
engaging web structures that evoke the classic computer terminal days.

Select 'about' directory on side menu to read full biographical ledger.`,
          type: 'output',
          timestamp
        });
        break;

      case 'projects':
        const projectsStr = PROJECTS.map(
          (p) => `* [${p.title}] - STATUS: ${p.status.toUpperCase()}
  ${p.description}
  Tech stack: ${p.tags.join(', ')}`
        ).join('\n\n');

        newLines.push({
          id: `out-${id}`,
          text: `RETRO EXPERIMENTS ON GUEST DIRECTORY:\n\n${projectsStr}`,
          type: 'output',
          timestamp
        });
        break;

      case 'skills':
        newLines.push({
          id: `out-${id}`,
          text: `DIRECT TECHNICAL STACK OVERVIEW:
- Programming: TypeScript, JavaScript (ESNext), HTML5/Canvas
- Architecture: Responsive Single Page Apps, Full-Stack Express, Micro-API proxy routers
- Interactive Engines: Web Audio Synth Engines, Retro Game Loops, CRT Shader Renderers
- System Integration: Persistent Database synchronization, OAuth secure bindings`,
          type: 'output',
          timestamp
        });
        break;

      case 'contact':
        newLines.push({
          id: `out-${id}`,
          text: `TRANSMISSION MODES:
  Email: jim.oler@gmail.com
  Domain: happyfun.zone
  Github: https://github.com/jim-oler (simulated)
  
You can also leave a message in the local Guestbook database!`,
          type: 'output',
          timestamp
        });
        break;

      case 'guestbook':
        if (args[1] === 'sign') {
          const name = args[2];
          const msg = args.slice(3).join(' ');

          if (!name || !msg) {
            newLines.push({
              id: `err-${id}`,
              text: `Error: Format incorrect. Please use: guestbook sign [name] [message]`,
              type: 'error',
              timestamp
            });
          } else {
            onAddGuestbookEntry(name, msg);
            newLines.push({
              id: `success-${id}`,
              text: `Success: Message successfully stamped into database log!`,
              type: 'success',
              timestamp
            });
          }
        } else {
          const entriesStr = guestbookEntries
            .map((e) => `[${e.timestamp}] ${e.name}: "${e.message}"`)
            .join('\n');

          newLines.push({
            id: `out-${id}`,
            text: `LOCAL SITE RECIPIENTS LOG:\n${entriesStr}\n\nTo leave your own mark on the terminal, type:\nguestbook sign [name] [your message]`,
            type: 'output',
            timestamp
          });
        }
        break;

      case 'neofetch':
        const neofetchStr = `
     _  _  
    (0)(0)    OS: ${NEOFETCH_INFO.os}
   /      \\   Host: ${NEOFETCH_INFO.host}
  |  \\__/  |  Uptime: ${NEOFETCH_INFO.uptime}
   \\______/   Kernel: ${NEOFETCH_INFO.kernel}
    /    \\    Shell: ${NEOFETCH_INFO.shell}
   /______\\   Resolution: ${NEOFETCH_INFO.resolution}
   \\      /   Font: ${NEOFETCH_INFO.font}
    \\____/    Memory: ${NEOFETCH_INFO.memory}
              CPU: ${NEOFETCH_INFO.cpu}
              Author: ${NEOFETCH_INFO.author}
        `;
        newLines.push({
          id: `out-${id}`,
          text: neofetchStr,
          type: 'output',
          timestamp
        });
        break;

      case 'snake':
        newLines.push({
          id: `out-${id}`,
          text: `Loading Snake System in core virtual memory... Done. Navigating to retro terminal sandbox.`,
          type: 'success',
          timestamp
        });
        // Call navigation callback
        setTimeout(() => onNavigate('snake'), 1200);
        break;

      case 'matrix':
        onToggleMatrix();
        newLines.push({
          id: `out-${id}`,
          text: `Toggling background digital rain system simulation... Done.`,
          type: 'success',
          timestamp
        });
        break;

      case 'theme':
        const requestedTheme = args[1]?.toLowerCase();
        if (['green', 'matrix'].includes(requestedTheme)) {
          onThemeChange('green-matrix');
          newLines.push({ id: `out-${id}`, text: 'Aesthetics adjusted to: Matrix Green (CRT)', type: 'success', timestamp });
        } else if (['amber', 'retro', 'orange', 'yellow'].includes(requestedTheme)) {
          onThemeChange('phosphor-amber');
          newLines.push({ id: `out-${id}`, text: 'Aesthetics adjusted to: Amber CRT (Retro)', type: 'success', timestamp });
        } else {
          newLines.push({
            id: `err-${id}`,
            text: `Error: Theme '${args[1] || ''}' not recognized. Use: theme [green | retro]`,
            type: 'error',
            timestamp
          });
        }
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'time':
        newLines.push({
          id: `out-${id}`,
          text: `Current local node time: ${new Date().toLocaleString()}`,
          type: 'output',
          timestamp
        });
        break;

      default:
        newLines.push({
          id: `err-${id}`,
          text: `command not found: '${command}'. Type 'help' for registration registry.`,
          type: 'error',
          timestamp
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
  };

  return (
    <div
      onClick={focusInput}
      className="flex-1 flex flex-col h-full min-h-[350px] p-3 overflow-hidden cursor-text text-sm sm:text-base leading-relaxed font-mono relative"
      id="terminal-wrapper"
    >
      {/* Scrollable Output Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar scroll-smooth"
        id="terminal-scroll-area"
      >
        {history.map((line) => {
          let colorClass = '';
          if (line.type === 'input') colorClass = 'opacity-100 font-semibold';
          else if (line.type === 'error') colorClass = 'text-red-500 font-bold';
          else if (line.type === 'success') colorClass = 'text-emerald-400 font-bold';
          else if (line.type === 'ascii') colorClass = 'text-cyan-400 select-none whitespace-pre leading-none text-[8px] sm:text-xs overflow-x-auto';
          else if (line.type === 'system') colorClass = 'opacity-80 font-bold border-b border-dashed border-current pb-1 mb-2';
          else colorClass = 'opacity-90';

          return (
            <div key={line.id} className={`${colorClass} break-words whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Input Prompt row */}
      <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-dashed border-current opacity-95">
        <span className="text-emerald-500 font-bold shrink-0">happyfun@guest:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 m-0 font-mono resize-none caret-current"
          placeholder="Type command..."
          id="terminal-prompt-input"
          aria-label="Terminal command prompt"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
