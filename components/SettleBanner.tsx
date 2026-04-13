import { CircleCheckBig } from 'lucide-react';
import { motion } from "framer-motion"

export default function SettleBanner() {
  return (
    <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-8 glass-morphism rounded-xl border border-white/40 shadow-2xl shadow-primary/10">
      <div className="flex items-center space-x-6 mb-6 md:mb-0">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <CircleCheckBig className="text-on-primary" size={32} />
        </div>
        <div>
          <h4 className="text-xl font-bold font-headline">Ready to Settle?</h4>
          <p className="text-outline">Send individualized reminders to everyone&apos;s phone.</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all"
        >
          Edit Item Shares
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-12 py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-xl shadow-primary/20 transition-all text-lg"
        >
          Send Notifications
        </motion.button>
      </div>
    </div>
  );
}