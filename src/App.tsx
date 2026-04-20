import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Lock, Cpu, Database, ShieldCheck, 
  Trash2, MapPin, MessageSquare, UserCheck, HardDrive, 
  Activity, Wifi, Search, Unlock, X, 
  Instagram, Facebook, Youtube, Send, MessageCircle
} from 'lucide-react';

type Stage = 'login' | 'entry' | 'handshake' | 'bruteforce' | 'dashboard' | 'deleteSequence' | 'dataDump';

interface LogEntry {
  text: string;
  type: 'system' | 'network' | 'critical' | 'success' | 'raw';
}

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: <Send className="w-5 h-5" />, color: '#ff0050' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: '#1877f2' },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: '#e4405f' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: '#ff0000' },
  { id: 'snapchat', name: 'Snapchat', icon: <Zap className="w-5 h-5 text-yellow-400" />, color: '#fffc00' },
  { id: 'twitter', name: 'Twitter (X)', icon: <X className="w-5 h-5" />, color: '#ffffff' },
  { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5 text-green-500" />, color: '#25d366' },
];

export default function App() {
  const [stage, setStage] = useState<Stage>('login');
  const [rootPass, setRootPass] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [targetPlatform, setTargetPlatform] = useState(PLATFORMS[0]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cpuLoad, setCpuLoad] = useState(0);
  const [memUsage, setMemUsage] = useState(0);
  const [bruteRate, setBruteRate] = useState(0);
  const [isAlert, setIsAlert] = useState(false);
  const [dataDetail, setDataDetail] = useState<string | null>(null);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const playBeep = (freq = 800, type: OscillatorType = 'square', duration = 0.05) => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const osc = audioContext.current.createOscillator();
      const gain = audioContext.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);
      gain.gain.setValueAtTime(0.05, audioContext.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioContext.current.destination);
      osc.start();
      osc.stop(audioContext.current.currentTime + duration);
    } catch (e) { console.warn('Audio blocked'); }
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, bruteRate, progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(82 + Math.random() * 16);
      setMemUsage(5.4 + Math.random() * 2.8);
      if (stage === 'bruteforce') setBruteRate(12400 + Math.random() * 2000);
    }, 400);
    return () => clearInterval(interval);
  }, [stage]);

  const handleLogin = () => {
    if (rootPass === 'FKG_ROOT') {
      playBeep(400, 'sine', 0.1);
      setStage('entry');
    } else {
      playBeep(150, 'sawtooth', 0.2);
      setIsAlert(true);
      setTimeout(() => setIsAlert(false), 500);
    }
  };

  const startExploit = () => {
    setStage('handshake');
    setLogs([]);
    playBeep(1000, 'square', 0.1);
    const extractionLogs = [
      `[!] Connecting to ${targetPlatform.name} Mainframe...`,
      `[!] Uplink Node: 0x${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      '[*] Initializing SYN-ACK handshake...',
      '[*] Injecting SSL Stripping payload...',
      `[*] Bypassing ${targetPlatform.name} 2FA protocols...`,
      '[*] Intercepting packet fragments...',
      '[*] Decrypting handshake entropy...',
      '[*] Tunnel established. Security headers stripped.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < extractionLogs.length) {
        setLogs(prev => [...prev, { text: extractionLogs[i], type: 'network' }]);
        playBeep(800 + i * 40, 'sine', 0.02);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => startBruteforce(), 1000);
      }
    }, 800);
  };

  const startBruteforce = () => {
    setStage('bruteforce');
    setProgress(0);
    const bruteTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(bruteTimer);
          setLogs(prev => [...prev, { text: 'CREDENTIAL MATCH DETECTED. BYPASS SUCCESSFUL.', type: 'success' }]);
          playBeep(600, 'sine', 0.3);
          setTimeout(() => setStage('dashboard'), 1500);
          return 100;
        }
        if (Math.random() > 0.85) {
          setLogs(prev => [...prev, { text: `[HASH] TESTING BLOCK 0x${Math.random().toString(16).slice(2, 6).toUpperCase()}... [FAIL]`, type: 'system' }]);
          playBeep(1200, 'square', 0.01);
        }
        return p + 1.2;
      });
    }, 100);
  };

  const runDelete = () => {
    setStage('deleteSequence');
    setProgress(0);
    setLogs([]);
    const deleteLogs = ['ERASING_DATA...', 'OVERWRITING_METADATA...', 'WIPING_LOGS...', 'TERMINATING_SES...'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < deleteLogs.length) {
        setLogs(prev => [...prev, { text: `[!] ${deleteLogs[i]}`, type: 'critical' }]);
        playBeep(400, 'sawtooth', 0.1);
        i++;
      }
    }, 2000);
    const pInt = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(pInt);
          clearInterval(interval);
          setLogs(prev => [...prev, { text: 'UID_STATUS: ACCOUNT_DELETED_SUCCESSFULLY', type: 'success' }]);
          return 100;
        }
        return p + 1;
      });
    }, 100);
  };

  const resetTool = () => {
    setStage('entry');
    setTargetUser('');
    setLogs([]);
    playBeep(500, 'sine', 0.1);
  };

  return (
    <div className={`min-h-screen bg-black text-[#39FF14] font-mono select-none flex flex-col p-4 md:p-8 relative overflow-hidden ${isAlert ? 'animate-[shake_0.2s_infinite]' : ''}`}>
      {/* CRT Overlays */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 bg-[radial-gradient(circle,transparent_60%,#000_100%),linear-gradient(#12101000_50%,#0000001a_50%),linear-gradient(90deg,#ff000005,#00ff0003,#0000ff05)]" />
      <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(transparent_0%,#39ff1405_10%,transparent_20%)] bg-[length:100%_200%] animate-[scan_6s_linear_infinite]" />

      <header className="flex justify-between items-center border-b border-[#39FF14]/30 pb-6 mb-8 z-10">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter animate-[glitch_2s_infinite]">
            FKG HACKER TOOL <span className="text-xs align-top opacity-50">v5.0 PRO</span>
          </h1>
          <div className="text-[9px] opacity-40 font-bold tracking-[0.4em] mt-1">BIOMETRIC_PENETRATION_ENGINE_ACTIVE</div>
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] font-bold">
          <div className="flex justify-between gap-4"><span>CPU_SYS:</span><span className={cpuLoad > 92 ? 'text-red-500' : ''}>{cpuLoad.toFixed(1)}%</span></div>
          <div className="flex justify-between gap-4"><span>MEM_DYNAM:</span><span>{memUsage.toFixed(1)}GB</span></div>
          <div className="flex justify-between gap-4"><span>NODE:</span><span className="text-white brightness-125">FKG_EXT_9</span></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col z-10 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {stage === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-auto w-full max-w-md border border-[#39FF14]/40 p-8 bg-black/80 space-y-8">
              <div className="text-center space-y-2">
                <Lock className="w-12 h-12 mx-auto mb-4 opacity-70" />
                <h2 className="text-sm font-black tracking-widest uppercase text-[#39FF14]/60">Key Authorization</h2>
              </div>
              <div className="space-y-4">
                <input type="password" value={rootPass} onChange={(e) => setRootPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="FKG_ROOT_IDENTIFIER" autoFocus className="w-full bg-[#050505] border border-[#39FF14]/40 p-4 text-center text-[#39FF14] focus:outline-none focus:border-[#39FF14] h-[55px] text-lg uppercase" />
                <button onClick={handleLogin} className="w-full border-2 border-[#39FF14] bg-[#39FF14]/10 h-[60px] font-black uppercase tracking-[0.2em] hover:bg-[#39FF14] hover:text-black transition-all">INITIALIZE BOOT</button>
              </div>
            </motion.div>
          )}

          {stage === 'entry' && (
            <motion.div key="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="m-auto w-full max-w-3xl space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Select Target Vector</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input value={targetUser} onChange={(e) => setTargetUser(e.target.value)} placeholder="ENTER_USERNAME" className="w-full bg-[#080808] border border-[#39FF14]/30 p-4 pl-12 focus:border-[#39FF14] h-[65px] text-lg uppercase" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Target Database Cluster</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PLATFORMS.map(p => (
                        <button key={p.id} onClick={() => {setTargetPlatform(p); playBeep(1200, 'sine', 0.02);}} className={`flex items-center justify-center gap-2 border p-3 h-[55px] transition-all min-w-0 ${targetPlatform.id === p.id ? 'bg-[#39FF14] text-black font-bold border-[#39FF14]' : 'border-[#39FF14]/20 hover:border-[#39FF14]'}`}>
                          {p.icon} <span className="text-[9px] truncate">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border border-[#39FF14]/20 bg-[#39FF14]/5 p-6 flex flex-col justify-between italic text-xs leading-relaxed opacity-60">
                   <div>&gt; SYSTEM_ID: FKG_v5_A01<br/>&gt; TARGETING: {targetPlatform.name.toUpperCase()}<br/>&gt; EXPLOIT_TYPE: R_BUFFER_OVERFLOW<br/>&gt; STATUS: AWAITING_COMMAND</div>
                   <div className="mt-4 border-t border-[#39FF14]/20 pt-4 font-bold text-[9px] uppercase tracking-wider">!! Unauthorized access is strictly logged !!</div>
                </div>
              </div>
              <button onClick={startExploit} disabled={!targetUser} className="w-full bg-[#39FF14]/10 border-2 border-[#39FF14] h-[75px] font-black text-xl uppercase tracking-[0.3em] hover:bg-[#39FF14] hover:text-black transition-all disabled:opacity-20 animate-pulse">EXECUTE PENETRATION</button>
            </motion.div>
          )}

          {(stage === 'handshake' || stage === 'bruteforce' || stage === 'deleteSequence') && (
            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-6">
              <div className="flex-1 border border-[#39FF14]/40 bg-black/90 relative overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-3 border-b border-[#39FF14]/20 flex justify-between items-center text-[9px] font-bold">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${stage === 'deleteSequence' ? 'bg-red-600 animate-ping' : 'bg-[#39FF14] animate-pulse'}`} />
                    <span>FKG_TERMINAL_v5 [{targetPlatform.id}]</span>
                  </div>
                  <div className="opacity-40 uppercase">Cluster: 0x992B // User: {targetUser}</div>
                </div>
                <div ref={logContainerRef} className={`flex-1 overflow-y-scroll p-6 font-mono text-[11px] space-y-2 custom-scrollbar ${stage === 'deleteSequence' ? 'custom-scrollbar-red' : ''}`} style={{height: '60vh'}}>
                  {logs.map((log, i) => (
                    <div key={i} className={`flex gap-4 ${log.type === 'network' ? 'text-white' : log.type === 'critical' ? 'text-red-500 font-bold' : ''}`} style={{ color: log.type === 'success' ? (stage === 'deleteSequence' ? '#dc2626' : '#39FF14') : undefined }}>
                      <span className="opacity-30 shrink-0">[{i.toString(16).padStart(3, '0')}]</span>
                      <span className={log.type === 'success' ? 'font-black tracking-widest' : ''}>{log.text}</span>
                    </div>
                  ))}
                  {stage === 'bruteforce' && <div className="text-lg font-black text-center py-10 opacity-70 italic animate-pulse">TESTING_HASH_0x{Math.random().toString(16).slice(2, 8).toUpperCase()}...</div>}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
                   <span className="opacity-40 uppercase">System_Pressure</span>
                   <span className={stage === 'deleteSequence' ? 'text-red-500' : ''}>{Math.round(progress)}%</span>
                </div>
                <div className={`h-10 border p-1 ${stage === 'deleteSequence' ? 'border-red-600 bg-red-600/5' : 'border-[#39FF14] bg-[#39FF14]/5'}`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${stage === 'deleteSequence' ? 'bg-red-600 shadow-[0_0_20px_red]' : 'bg-[#39FF14] shadow-[0_0_20px_#39fff14]'}`} />
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-auto w-full max-w-4xl space-y-12">
               <div className="text-center space-y-4">
                  <div className="inline-block border-2 border-[#39FF14] p-5 bg-[#39FF14]/10 animate-bounce">
                    <ShieldCheck className="w-14 h-14" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">BREACH_STABLE</h2>
                  <p className="text-sm border-l-2 border-[#39FF14] pl-4 opacity-70 tracking-[0.4em] font-bold inline-block uppercase">Administrator Access Enabled: {targetUser}</p>
               </div>
               <div className="grid sm:grid-cols-2 gap-6">
                  <button onClick={runDelete} className="group border-2 border-red-600 bg-red-600/5 h-[150px] flex flex-col items-center justify-center gap-4 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 className="w-10 h-10 group-hover:scale-125 transition-transform" />
                    <span className="font-black text-lg tracking-widest uppercase">[ DELETE_ACCOUNT ]</span>
                  </button>
                  <button onClick={() => setStage('dataDump')} className="group border-2 border-[#39FF14] bg-[#39FF14]/5 h-[150px] flex flex-col items-center justify-center gap-4 text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                    <Database className="w-10 h-10 group-hover:scale-125 transition-transform" />
                    <span className="font-black text-lg tracking-widest uppercase">[ VIEW_PRIVATE_DATA ]</span>
                  </button>
               </div>
            </motion.div>
          )}

          {stage === 'dataDump' && (
            <motion.div key="dump" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
               <div className="flex-1 flex flex-col border border-[#39FF14]/40 bg-[#050505] p-6 space-y-6">
                  <h3 className="text-xs font-black uppercase flex items-center gap-2 text-white"><Search className="w-4 h-4" /> UPLINK_DATA_BROWSER</h3>
                  <div className="grid gap-4">
                    {[
                      { id: 'chats', title: 'Encrypted_Chats', icon: <MessageSquare/>, detail: 'Deciphering chat logs... [!] Found sensitive string: "Backup passwords in office vault". [!] Captured 42 pending threads.' },
                      { id: 'gallery', title: 'Gallery_Cloud_Backup', icon: <HardDrive/>, detail: 'Synchronizing thumbnails... [!] 1.4GB encrypted media found. Metadata suggests 82 locations cached.' },
                      { id: 'cookies', title: 'Browser_Cookies', icon: <Wifi/>, detail: 'Target cookies extracted: AUTH_TOKEN=0x921A, SESSION_ID=FKG_PRO_V... Auto-login potential: 98%.' }
                    ].map(cat => (
                      <button key={cat.id} onClick={() => { setDataDetail(cat.detail); playBeep(2400, 'sine', 0.01); }} className={`flex items-center justify-between p-6 border-b transition-all ${dataDetail === cat.detail ? 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]' : 'border-[#39FF14]/10 hover:border-[#39FF14]/40 text-[#39FF14]/60'}`}>
                        <div className="flex items-center gap-5">
                          {cat.icon} <span className="font-black text-xs uppercase tracking-[0.3em]">{cat.title}</span>
                        </div>
                        <Unlock className="w-4 h-4 opacity-30" />
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {dataDetail && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 border border-[#39FF14]/30 bg-black p-6 font-mono text-[11px] leading-relaxed opacity-90 custom-scrollbar overflow-y-scroll max-h-[40vh]">
                         <div className="text-[#39FF14]/40 mb-6 uppercase tracking-widest border-b border-[#39FF14]/20 pb-2">Technical_Details_Dump_v5</div>
                         {dataDetail}
                         <div className="mt-8 text-white/40 break-all animate-pulse">0x{Math.random().toString(16).slice(2, 40).toUpperCase()}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <div className="w-full lg:w-[320px] flex flex-col gap-6">
                 <div className="border border-[#39FF14]/20 p-6 bg-[#39FF14]/5 space-y-4">
                    <h4 className="text-[10px] font-black opacity-40 uppercase">Cluster_Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
                       <div className="opacity-30">HOST_NODE:</div><div className="text-white">FKG_X_CORE</div>
                       <div className="opacity-30">LATENCY:</div><div className="text-white">12ms</div>
                       <div className="opacity-30">SECURITY:</div><div className="text-red-500">NULL_STATE</div>
                    </div>
                 </div>
                 <button onClick={() => setStage('dashboard')} className="w-full border-2 border-[#39FF14] bg-[#39FF14]/5 h-[65px] font-black uppercase text-xs tracking-widest hover:bg-[#39FF14] hover:text-black transition-all">RETURN_TO_ROOT</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {stage !== 'login' && (
        <footer className="mt-8 flex justify-center z-20">
           <button onClick={resetTool} className="px-12 h-[55px] border-2 border-red-600 bg-red-600/10 text-red-500 font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_20px_#dc262622] hover:bg-red-600 hover:text-white transition-all animate-pulse">
             [ ABORT / BACK TO HOME ]
           </button>
        </footer>
      )}

      <style>{`
        @keyframes scan { from { background-position: 0 -100vh; } to { background-position: 0 100vh; } }
        @keyframes shake { 0%, 100% { transform: translate(0); } 20% { transform: translate(-4px,-4px); } 80% { transform: translate(4px,4px); } }
        @keyframes glitch { 0% { text-shadow: 2px 0 #dc2626, -2px 0 #2563eb; } 25% { text-shadow: -2px 0 #dc2626, 2px 0 #2563eb; } 50% { text-shadow: 2px 2px #dc2626, -2px -2px #2563eb; } 75% { text-shadow: -2px -2px #dc2626, 2px 2px #2563eb; } 100% { text-shadow: 2px 0 #dc2626, -2px 0 #2563eb; } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #39FF14; border-radius: 10px; box-shadow: 0 0 10px #39FF14; }
        .custom-scrollbar-red::-webkit-scrollbar-thumb { background: #dc2626; box-shadow: 0 0 10px #dc2626; }
      `}</style>
    </div>
  );
}
