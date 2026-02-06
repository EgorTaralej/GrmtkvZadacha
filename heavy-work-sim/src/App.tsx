import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<'idle' | 'running' | 'stopped' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(10000);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [xClickCount, setXClickCount] = useState<number>(0); 
  const [isDestroyed, setIsDestroyed] = useState<boolean>(false); 
  const timerRef = useRef<number | null>(null);

  const exitPhotoUrl = "https://scontent.fsof8-1.fna.fbcdn.net/v/t39.30808-6/512946973_4087921118020873_6232917326026984555_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=JS6TMzru8qsQ7kNvwFzeIXk&_nc_oc=Adl61LZI3kGZJIPsNatQesAQ5EbZDbt3Jfb1VDT9A18z1PKUYiiLvy3jpPOT3mu5V6o&_nc_zt=23&_nc_ht=scontent.fsof8-1.fna&_nc_gid=Wne7VBmS4HT3znIwW--bGg&oh=00_AfuVF1RFCFaAM1HOemfchFcz1WXO3nt2EOsgaaDxI0Y5xQ&oe=698B6B91";
  const successPhotoUrl = "https://scontent.fsof8-1.fna.fbcdn.net/v/t39.30808-6/505594973_4062759423870376_3292071255603296687_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=OAqiqs2avkUQ7kNvwG2txk7&_nc_oc=Admw8aWV_sZYUl1rxrhnPS61l2jS-yUIBtQNo9k4Q0kE5ev7TRBR3i-Xj6oN0TZTuTc&_nc_zt=23&_nc_ht=scontent.fsof8-1.fna&_nc_gid=mAP-UDJYORfKCxsjg3dIig&oh=00_AfvnxK1Jiwty4nzY7wZZu-RyZSH2xumYAq5InZ7u5X1NlQ&oe=698B8AF4";

  const getExitMessage = () => {
    switch (xClickCount) {
      case 1: return "НЯМА ИЗХОД ОТТУК.";
      case 2: return "Нали ти казах, че няма изход!";
      case 3: return "АБЕ НЯМА ИЗХОД БЕ!";
      case 4: return "Сигурен ли си, че искаш да ме изоставиш?";
      default: return "";
    }
  };

  const handleXClick = () => {
    const nextCount = xClickCount + 1;
    setXClickCount(nextCount);
    if (nextCount === 5) {
      window.close();
      setIsDestroyed(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const startSimulation = () => {
    if (status === 'running') return;
    setStatus('running');
    const duration = timeLeft;
    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        stopTimer();
        setStatus('done');
      }
    }, 10);
  };

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  const handleStop = () => { stopTimer(); setStatus('stopped'); };
  const reset = () => { stopTimer(); setTimeLeft(10000); setStatus('idle'); };
  useEffect(() => { return () => stopTimer(); }, []);

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const msecs = ms % 1000;
    return (
      <div className="flex gap-2 tabular-nums font-bold">
        <span>{mins}</span>:<span>{secs.toString().padStart(2, '0')}</span>:
        <span className="text-blue-500">{msecs.toString().padStart(3, '0')}</span>
      </div>
    );
  };

  if (isDestroyed) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/20 italic font-medium">Процесът е терминиран успешно.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-6 relative overflow-hidden select-none">
      
      {/* ОСНОВЕН ПРОЗОРЕЦ */}
      <motion.div 
        drag dragMomentum={false}
        className="w-full max-w-md bg-[#16161a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="bg-white/5 p-5 border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing">
          <button 
            onClick={handleXClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
          <span className="text-sm text-white/50 font-semibold italic">Системен модул</span>
          <div className="w-9" />
        </div>

        <div className="p-10 flex flex-col items-center">
          <div className="mb-8">
             {status === 'running' ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                 <Cpu className="w-12 h-12 text-blue-500" />
               </motion.div>
             ) : status === 'done' ? (
               <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                 <img src={successPhotoUrl} alt="Success" className="w-full h-full object-cover" />
               </div>
             ) : (
               <Cpu className="w-12 h-12 text-white/10" />
             )}
          </div>

          <h2 className="text-white text-3xl font-bold mb-1 tracking-tight text-center">Тежка симулация</h2>
          <p className="text-white/30 text-sm mb-10 font-medium italic">Системен анализ</p>

          <div className="text-7xl font-bold mb-10 text-white tracking-tighter">
            {formatTime(timeLeft)}
          </div>

          <div className="w-full h-2 bg-white/5 rounded-full mb-10 overflow-hidden">
            <motion.div animate={{ width: `${((10000 - timeLeft) / 10000) * 100}%` }} className={`h-full ${status === 'done' ? 'bg-emerald-500' : 'bg-blue-600'}`} />
          </div>

          <div className="w-full flex flex-col gap-4">
            {status !== 'running' && status !== 'done' && (
              <button onClick={startSimulation} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-bold cursor-pointer flex justify-center items-center gap-2">
                Стартирай процеса
              </button>
            )}
            {status === 'running' && (
              <button onClick={handleStop} className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-lg font-bold cursor-pointer">
                Спри процеса
              </button>
            )}
            {(status === 'done' || status === 'stopped') && (
              <div className="flex flex-col gap-3 w-full">
                {status === 'done' && <div className="text-center text-emerald-500 text-lg font-bold pb-2">Приключено успешно!</div>}
                <button onClick={reset} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-lg font-bold border border-white/10 cursor-pointer">
                  Нулирай
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ЗАТЪМНЕН ФОН ПРИ МОДАЛИТЕ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            /* bg-black/60 прави фона затъмнен, а не черен */
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-[#1c1c21] p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-white/5"
            >
              <div className="w-56 h-56 mx-auto mb-8 rounded-3xl overflow-hidden border border-white/10">
                <img src={exitPhotoUrl} alt="Exit" className="w-full h-full object-cover" />
              </div>
              <p className="text-white font-bold text-2xl mb-10 italic leading-tight">{getExitMessage()}</p>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-2xl cursor-pointer"
              >
                Разбрах
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;