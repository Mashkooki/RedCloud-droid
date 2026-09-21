export type ActiveEngine = 'none' | 'dashboard' | 'aether' | 'tor';

export type AetherMode = 'auto' | 'masque_h2' | 'masque' | 'gool' | 'wireguard';

export type TorMode = 'aether_masque' | 'aether_quic' | 'snowflake' | 'direct' | 'custom';

export interface Account {
  worker: string;
  uuid: string;
  path: string;
  status: string;
  used_bytes: string;
  priority: string;
}

export interface LogEntry {
  id: string;
  time: Date;
  tag: string;
  message: string;
  isError: boolean;
}

export interface V2RayStatus {
  downloadSpeed: number; // bytes/s
  uploadSpeed: number; // bytes/s
  download: number; // total bytes
  upload: number; // total bytes
  duration: string; // HH:MM:SS
  state: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
}

export interface Telemetry {
  publicIp: string | null;
  ipCountry: string | null;
  ipCountryCode: string | null;
  ipFlagEmoji: string | null;
  realPingMs: number | null;
  isTesting: boolean;
}

export interface BannerNotice {
  id: string;
  message: string;
  color: string;
  icon: 'info' | 'warning' | 'shield' | 'explore' | 'check';
}
