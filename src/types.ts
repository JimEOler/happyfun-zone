export type PageId = 'home' | 'about' | 'projects' | 'guestbook' | 'terminal' | 'snake';

export type ThemeId = 'green-matrix' | 'phosphor-amber';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  bgClass: string;
  textClass: string;
  borderClass: string;
  accentClass: string;
  cursorClass: string;
  mutedClass: string;
  titleClass: string;
  selectionClass: string;
  gridColor: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  category: string;
  iconName: string;
  status: 'online' | 'beta' | 'wip';
}

export interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'ascii';
  timestamp: string;
}
