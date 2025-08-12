export interface SaveData {
  version: number;
  seed: string;
  depth: number;
  player: { x: number; y: number; hp: number };
  options: { autoFire: boolean };
}

const KEY = 'rogue-save';

export function load(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function save(data: SaveData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}
