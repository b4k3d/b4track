import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 72; // px needed to trigger refresh

export default function PullToRefresh({ onRefresh, darkMode, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const scrollRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    // Only activate when scrolled to top
    if (scrollRef.current && scrollRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (startY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      // Dampen pull with sqrt for rubber-band feel
      setPullY(Math.min(Math.sqrt(delta) * 5, THRESHOLD + 20));
    }
  }, [refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (pullY >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullY(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    setPullY(0);
    startY.current = null;
  }, [pullY, refreshing, onRefresh]);

  const triggered = pullY >= THRESHOLD;
  const iconColor = darkMode ? 'text-cyan-400' : 'text-violet-600';

  return (
    <div className="relative overflow-hidden flex-1 flex flex-col">
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullY > 8 || refreshing) && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex justify-center items-center z-10 pointer-events-none"
            style={{ height: refreshing ? THRESHOLD : pullY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : triggered ? 180 : pullY * 2 }}
              transition={refreshing ? { repeat: Infinity, duration: 0.7, ease: 'linear' } : { duration: 0 }}
            >
              <RefreshCw className={`w-5 h-5 ${triggered || refreshing ? iconColor : darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ transform: `translateY(${pullY}px)`, transition: pullY === 0 ? 'transform 0.3s ease' : 'none' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}