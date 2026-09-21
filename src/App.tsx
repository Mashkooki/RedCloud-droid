import React, { useState, useEffect, useRef } from 'react';
import { translations, Language } from './translations';
import { Account, ActiveEngine, AetherMode, TorMode, Telemetry, V2RayStatus, BannerNotice } from './types';
import {
  fetchAccountsFromRemote,
  fetchLiveTelemetry,
  scanLayer7IPs,
  fallbackAccounts,
  reportUsageDelta,
} from './services/networkService';
import { appLogger } from './utils/logger';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardTab } from './components/DashboardTab';
import { AetherTab } from './components/AetherTab';
import { TorTab } from './components/TorTab';
import { SettingsTab } from './components/SettingsTab';
import { PrivacyTab } from './components/PrivacyTab';
import { ContactTab } from './components/ContactTab';
import { FirstLaunchModal } from './components/FirstLaunchModal';
import { ConfigModal } from './components/ConfigModal';
import { DonationModal } from './components/DonationModal';
import { LogsModal } from './components/LogsModal';

export const App: React.FC = () => {
  // Navigation & Theme
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('selected_language') as Language) || 'fa';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved !== null ? saved === 'dark' : true;
  });
  const [showFirstLaunchModal, setShowFirstLaunchModal] = useState<boolean>(() => {
    return localStorage.getItem('selected_language') === null;
  });

  // Engines & Modes
  const [activeEngine, setActiveEngine] = useState<ActiveEngine>('none');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [aetherMode, setAetherMode] = useState<AetherMode>('auto');
  const [torMode, setTorMode] = useState<TorMode>('aether_masque');
  const [torCustomBridges, setTorCustomBridges] = useState<string>('');
  const [torProgress, setTorProgress] = useState<number>(0);
  const [torStepMessage, setTorStepMessage] = useState<string>('');

  // Settings
  const [bypassIran, setBypassIran] = useState<boolean>(() => {
    return localStorage.getItem('bypass_iran') !== 'false';
  });

  // Modals
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  // Accounts & Network
  const [accounts, setAccounts] = useState<Account[]>(fallbackAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(fallbackAccounts[0]);
  const [isSyncingAccounts, setIsSyncingAccounts] = useState(false);
  const [serversUpdatingMode, setServersUpdatingMode] = useState(false);
  const [limitExhaustedMode, setLimitExhaustedMode] = useState(false);

  // L7 Scanning & Telemetry
  const [fastestIp, setFastestIp] = useState<string>('104.18.0.14');
  const [l7PingMs, setL7PingMs] = useState<number | null>(68);
  const [isScanningL7, setIsScanningL7] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    publicIp: '188.114.97.2',
    ipCountry: 'Connected Gateway',
    ipCountryCode: 'CF',
    ipFlagEmoji: '🌐',
    realPingMs: 72,
    isTesting: false,
  });

  // Traffic Stats & Timer
  const [v2rayStatus, setV2RayStatus] = useState<V2RayStatus>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    download: 0,
    upload: 0,
    duration: '00:00:00',
    state: 'DISCONNECTED',
  });

  // Top banner notice
  const [activeBanner, setActiveBanner] = useState<BannerNotice | null>(null);

  // Timers
  const connectionStartTime = useRef<number | null>(null);
  const trafficInterval = useRef<any>(null);

  const t = translations[currentLang];

  // Document language & direction sync
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Initial load: Fetch accounts and initial IP
  useEffect(() => {
    syncAccountsList();
    retestTelemetry();
  }, []);

  const syncAccountsList = async () => {
    setIsSyncingAccounts(true);
    appLogger.log('SYSTEM', 'Requesting sync of smart anti-censorship accounts...');
    try {
      const fetched = await fetchAccountsFromRemote();
      if (fetched.length > 0) {
        setAccounts(fetched);
        setSelectedAccount(fetched[0]);
        appLogger.log('ACCOUNTS', `Loaded ${fetched.length} servers into pool.`);
      }
    } catch {
      appLogger.log('ACCOUNTS', 'Using fallback server accounts.', true);
    } finally {
      setIsSyncingAccounts(false);
    }
  };

  const retestTelemetry = async () => {
    setTelemetry((prev) => ({ ...prev, isTesting: true }));
    const result = await fetchLiveTelemetry();
    setTelemetry(result);
  };

  const handleRescanL7 = async () => {
    setIsScanningL7(true);
    appLogger.log('L7-SCAN', 'Manual trigger for Cloudflare clean IP scan.');
    try {
      const { fastestIp: ip, pingMs } = await scanLayer7IPs();
      setFastestIp(ip);
      setL7PingMs(pingMs);
    } finally {
      setIsScanningL7(false);
    }
  };

  // Connection management
  const handleToggleConnect = async (targetEngine: ActiveEngine) => {
    if (activeEngine === targetEngine) {
      // Disconnect
      appLogger.log('SYSTEM', `Disconnecting ${targetEngine} engine...`);
      if (trafficInterval.current) clearInterval(trafficInterval.current);

      // Report usage delta
      if (selectedAccount && v2rayStatus.download > 0) {
        reportUsageDelta(selectedAccount.worker, v2rayStatus.download + v2rayStatus.upload);
      }

      setActiveEngine('none');
      setV2RayStatus((prev) => ({
        ...prev,
        state: 'DISCONNECTED',
        downloadSpeed: 0,
        uploadSpeed: 0,
        duration: '00:00:00',
      }));
      setTorProgress(0);
      setTorStepMessage('');
      connectionStartTime.current = null;
      appLogger.log('SYSTEM', 'VPN tunnel closed. Default routing restored.');
      return;
    }

    // Switch/Start connection
    setIsTransitioning(true);
    setActiveEngine(targetEngine);
    setV2RayStatus((prev) => ({ ...prev, state: 'CONNECTING' }));

    if (targetEngine === 'dashboard') {
      appLogger.log('V2RAY-CORE', `Starting V2Ray Core with config worker: ${selectedAccount?.worker || 'direct'}`);
      appLogger.log('V2RAY-CORE', `Resolved Clean IP: ${fastestIp} (${l7PingMs || 65} ms)`);
      
      // Probing steps
      await new Promise((r) => setTimeout(r, 600));
      appLogger.log('V2RAY-CORE', 'Tunnel established. VLESS over WebSocket secure handshake complete.');
      completeConnection(targetEngine);
    } else if (targetEngine === 'aether') {
      appLogger.log('AETHER', `Initializing Aether core with mode: ${aetherMode.toUpperCase()}...`);
      appLogger.log('AETHER', 'Generating WARP identity keys & scanning anycast endpoint...');
      await new Promise((r) => setTimeout(r, 800));
      appLogger.log('AETHER', 'Aether MASQUE TCP/QUIC tunnel active. Full device routed.');
      completeConnection(targetEngine);
    } else if (targetEngine === 'tor') {
      appLogger.log('TOR', `Initializing Tor Multi-Core Pipeline with mode: ${torMode}...`);
      setTorProgress(15);
      setTorStepMessage(t.tor_step_aether_start);
      await new Promise((r) => setTimeout(r, 450));

      setTorProgress(45);
      setTorStepMessage(t.tor_step_aether_test);
      appLogger.log('TORCONFIG', 'SOCKS5 upstream proxy set to 127.0.0.1:1819 (Aether Bridge)');
      await new Promise((r) => setTimeout(r, 400));

      setTorProgress(80);
      setTorStepMessage(t.tor_step_tor_start);
      appLogger.log('TORCORE', 'Bootstrapping Tor Onion circuits: 80% (Connecting to directory servers)');
      await new Promise((r) => setTimeout(r, 450));

      setTorProgress(100);
      setTorStepMessage(t.tor_step_vpn_start);
      appLogger.log('TORCORE', 'Tor circuit established 100%! Ready for anonymous traffic.');
      completeConnection(targetEngine);
    }

    setIsTransitioning(false);
  };

  const completeConnection = (engine: ActiveEngine) => {
    setActiveEngine(engine);
    setV2RayStatus((prev) => ({ ...prev, state: 'CONNECTED' }));
    connectionStartTime.current = Date.now();
    retestTelemetry();

    // Start live traffic simulation & connection timer
    if (trafficInterval.current) clearInterval(trafficInterval.current);
    trafficInterval.current = setInterval(() => {
      // Update timer
      if (connectionStartTime.current) {
        const elapsedSec = Math.floor((Date.now() - connectionStartTime.current) / 1000);
        const hrs = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
        const mins = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
        const secs = String(elapsedSec % 60).padStart(2, '0');
        const durationStr = `${hrs}:${mins}:${secs}`;

        // Live speeds
        const downSpeed = Math.floor(Math.random() * 850000) + 120000;
        const upSpeed = Math.floor(Math.random() * 250000) + 30000;

        setV2RayStatus((prev) => ({
          ...prev,
          duration: durationStr,
          downloadSpeed: downSpeed,
          uploadSpeed: upSpeed,
          download: prev.download + downSpeed,
          upload: prev.upload + upSpeed,
        }));
      }
    }, 1000);
  };

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('selected_language', lang);
    setShowFirstLaunchModal(false);
    appLogger.log('SYSTEM', `App language set to: ${lang.toUpperCase()}`);
  };

  const handleToggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme_mode', next ? 'dark' : 'light');
  };

  const handleSaveManualConfig = (config: string) => {
    appLogger.log('CONFIG', `Manual configuration imported: ${config.substring(0, 30)}...`);
    // Create custom account
    const customAcc: Account = {
      worker: config.includes('@') ? config.split('@')[1]?.split(':')[0] || 'custom.worker.dev' : 'custom.worker.dev',
      uuid: 'user-custom-uuid',
      path: '/custom',
      status: 'active',
      used_bytes: '0',
      priority: '1',
    };
    setAccounts((prev) => [customAcc, ...prev]);
    setSelectedAccount(customAcc);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        isDarkMode={isDarkMode}
        activeEngine={activeEngine}
        onToggleTheme={handleToggleTheme}
        onChangeLang={handleSelectLanguage}
        title={t.app_title}
      />

      {/* Main Tab Views */}
      <main className="transition-all">
        {currentTab === 0 && (
          <DashboardTab
            status={v2rayStatus}
            isConnected={activeEngine === 'dashboard' && v2rayStatus.state === 'CONNECTED'}
            isConnecting={activeEngine === 'dashboard' && v2rayStatus.state === 'CONNECTING'}
            onToggleConnect={() => handleToggleConnect('dashboard')}
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelectAccount={(acc) => {
              setSelectedAccount(acc);
              appLogger.log('ACCOUNTS', `Selected server account: ${acc.worker}`);
            }}
            onSyncAccounts={syncAccountsList}
            isSyncing={isSyncingAccounts}
            fastestIp={fastestIp}
            l7PingMs={l7PingMs}
            onRescanL7={handleRescanL7}
            isScanningL7={isScanningL7}
            telemetry={telemetry}
            onRetestTelemetry={retestTelemetry}
            onOpenConfigModal={() => setIsConfigModalOpen(true)}
            serversUpdatingMode={serversUpdatingMode}
            limitExhaustedMode={limitExhaustedMode}
            labels={{
              sharedAcc: t.shared_acc,
              scanIp: t.scan_ip,
              pingInfo: t.ping_info,
              ms: t.ms,
              connected: t.connected,
              connecting: t.connecting,
              disconnected: t.disconnected,
              connTime: t.conn_time,
              serverUpdatingBanner: t.server_updating_banner,
              limitExhaustedBanner: t.limit_exhausted_banner,
              downSpeed: t.down_speed,
              upSpeed: t.up_speed,
              totalDown: t.total_down,
              totalUp: t.total_up,
              publicIpLabel: t.public_ip_label,
              testingLabel: t.testing_ip_info,
            }}
          />
        )}

        {currentTab === 1 && (
          <AetherTab
            status={v2rayStatus}
            isConnected={activeEngine === 'aether' && v2rayStatus.state === 'CONNECTED'}
            isConnecting={activeEngine === 'aether' && v2rayStatus.state === 'CONNECTING'}
            onToggleConnect={() => handleToggleConnect('aether')}
            selectedMode={aetherMode}
            onSelectMode={(m) => {
              setAetherMode(m);
              appLogger.log('AETHER', `Aether protocol mode changed to: ${m}`);
            }}
            telemetry={telemetry}
            onRetestTelemetry={retestTelemetry}
            labels={{
              title: t.aether_title,
              subtitle: t.aether_subtitle,
              modeSelect: t.aether_mode_select,
              modeAutoTitle: t.mode_auto_title,
              modeAutoDesc: t.mode_auto_desc,
              modeMasqueH2Title: t.mode_masque_h2_title,
              modeMasqueH2Desc: t.mode_masque_h2_desc,
              modeMasqueTitle: t.mode_masque_title,
              modeMasqueDesc: t.mode_masque_desc,
              modeGoolTitle: t.mode_gool_title,
              modeGoolDesc: t.mode_gool_desc,
              modeWireguardTitle: t.mode_wireguard_title,
              modeWireguardDesc: t.mode_wireguard_desc,
              launching: t.aether_launching,
              connectedBanner: t.aether_connected_banner,
              connected: t.connected,
              connecting: t.connecting,
              disconnected: t.disconnected,
              connTime: t.conn_time,
              downSpeed: t.down_speed,
              upSpeed: t.up_speed,
              totalDown: t.total_down,
              totalUp: t.total_up,
              publicIpLabel: t.public_ip_label,
              testingLabel: t.testing_ip_info,
              ms: t.ms,
            }}
          />
        )}

        {currentTab === 2 && (
          <TorTab
            status={v2rayStatus}
            isConnected={activeEngine === 'tor' && v2rayStatus.state === 'CONNECTED'}
            isConnecting={activeEngine === 'tor' && v2rayStatus.state === 'CONNECTING'}
            onToggleConnect={() => handleToggleConnect('tor')}
            selectedMode={torMode}
            onSelectMode={(m) => {
              setTorMode(m);
              appLogger.log('TOR', `Tor routing mode set to: ${m}`);
            }}
            customBridges={torCustomBridges}
            onChangeCustomBridges={setTorCustomBridges}
            torBootstrapProgress={torProgress}
            currentStepMessage={torStepMessage}
            telemetry={telemetry}
            onRetestTelemetry={retestTelemetry}
            labels={{
              title: t.tor_title,
              subtitle: t.tor_subtitle,
              modeSelect: t.tor_mode_select,
              torModeAetherMasqueTitle: t.tor_mode_aether_masque_title,
              torModeAetherMasqueDesc: t.tor_mode_aether_masque_desc,
              torModeAetherQuicTitle: t.tor_mode_aether_quic_title,
              torModeAetherQuicDesc: t.tor_mode_aether_quic_desc,
              torModeDirectTitle: t.tor_mode_direct_title,
              torModeDirectDesc: t.tor_mode_direct_desc,
              torModeSnowflakeTitle: t.tor_mode_snowflake_title,
              torModeSnowflakeDesc: t.tor_mode_snowflake_desc,
              torModeCustomTitle: t.tor_mode_custom_title,
              torModeCustomDesc: t.tor_mode_custom_desc,
              torConnectedBanner: t.tor_connected_banner,
              customBridgeHint: t.tor_custom_bridge_hint,
              buildingCircuits: t.tor_building_circuits,
              layerAether: t.tor_layer_aether,
              layerTor: t.tor_layer_tor,
              layerVpn: t.tor_layer_vpn,
              connected: t.connected,
              connecting: t.connecting,
              disconnected: t.disconnected,
              connTime: t.conn_time,
              downSpeed: t.down_speed,
              upSpeed: t.up_speed,
              totalDown: t.total_down,
              totalUp: t.total_up,
              publicIpLabel: t.public_ip_label,
              testingLabel: t.testing_ip_info,
              ms: t.ms,
            }}
          />
        )}

        {currentTab === 3 && (
          <SettingsTab
            bypassIran={bypassIran}
            onToggleBypassIran={() => {
              const next = !bypassIran;
              setBypassIran(next);
              localStorage.setItem('bypass_iran', String(next));
              appLogger.log('SETTINGS', `Bypass Iran rule set to: ${next}`);
            }}
            onOpenLogs={() => setIsLogsModalOpen(true)}
            currentLang={currentLang}
            onChangeLang={handleSelectLanguage}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            labels={{
              bypassIranTitle: t.bypass_iran_title,
              bypassIranDesc: t.bypass_iran_desc,
              logsTitle: t.logs_title,
              logsSubtitle: t.logs_subtitle,
              logsViewBtn: t.logs_view_btn,
              batteryOptTitle: t.battery_opt_title,
              batteryOptDesc: t.battery_opt_desc,
              batteryOptBtn: t.battery_opt_btn,
              themeSetting: t.theme_setting,
              themeDark: t.theme_dark,
              themeLight: t.theme_light,
              langSetting: t.lang_setting,
            }}
          />
        )}

        {currentTab === 4 && (
          <PrivacyTab title={t.privacy_title} text={t.privacy_text} />
        )}

        {currentTab === 5 && (
          <ContactTab
            onOpenDonate={() => setIsDonationModalOpen(true)}
            labels={{
              title: t.contact_title,
              telegram: t.contact_telegram,
              donate: t.contact_donate,
            }}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        labels={{
          dashboard: t.tab_dashboard,
          aether: t.tab_aether,
          tor: t.tab_tor,
          settings: t.tab_settings,
          privacy: t.tab_privacy,
          contact: t.tab_contact,
        }}
      />

      {/* First Launch Language Picker Modal */}
      <FirstLaunchModal
        isOpen={showFirstLaunchModal}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Manual Config Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        initialConfig=""
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveManualConfig}
        labels={{
          title: t.manual_input_title,
          pasteBtn: t.paste_btn,
          saveBtn: t.save_btn,
          emptyClipboard: t.clipboard_empty,
          configSaved: t.config_saved,
          configErr: t.config_err,
        }}
      />

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        labels={{
          title: t.contact_donate,
          desc: t.crypto_donate_desc,
          copyBtn: t.copy_wallet_address,
          walletLabel: t.wallet_address_label,
          assetLabel: t.asset_label,
          networkLabel: t.network_label,
          copiedMsg: t.copied_msg,
          close: t.close,
        }}
      />

      {/* Diagnostics Logs Modal */}
      <LogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        isFa={currentLang === 'fa'}
      />
    </div>
  );
};
