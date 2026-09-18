import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, FileSearch, Network, CheckCircle, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onNavigate: (path: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const pillars = [
    {
      number: '01',
      title: '24/7/365 Human-Led Threat Hunting',
      subhead: 'Live, round-the-clock threat isolation.',
      desc: 'We deploy enterprise-grade endpoint security integrations managed by a live, round-the-clock Security Operations Center (SOC). Unlike passive antivirus software that only reacts after damage is done, our active response engine hunts down and isolates threat actors in real-time the second they attempt to breach your network infrastructure.',
      objective: 'The objective: continuous vigilance across the systems you depend on.',
      icon: Eye,
      image: '/images/service_soc_sphere.jpg',
    },
    {
      number: '02',
      title: 'Next-Generation Cloud & Identity Protection',
      subhead: 'Proactive credential and tenant defense.',
      desc: 'Most modern data breaches happen through stolen employee credentials and compromised cloud environments. We continuously monitor your cloud identities, manage tenant administrator privileges, and integrate deeply with Windows Defender and Microsoft Defender platforms to ensure unauthorized users are blocked before accessing sensitive client records.',
      objective: 'The objective: protect user credentials, cloud tenants, and critical records.',
      icon: FileSearch,
      image: '/images/service_audit_grid.jpg',
    },
    {
      number: '03',
      title: 'Continuous Compliance Rating & Asset Inventory',
      subhead: 'Automated posture & underwriting evidence.',
      desc: 'We provide your firm with a real-time Security Posture Rating and maintain a meticulous, automated Asset Inventory of every device on your network footprint. This continuous reporting ensures your organization effortlessly satisfies strict cyber insurance underwriting standards and maintains total regulatory compliance year-round.',
      objective: 'The objective: satisfy underwriting standards and maintain total regulatory compliance.',
      icon: Network,
      image: '/images/service_cloud_rings.jpg',
    },
  ];

  const outcomes = [
    {
      title: 'Protect Your Insurance Position',
      desc: 'Address security gaps before they become renewal problems.',
    },
    {
      title: 'Maintain Continuous Visibility',
      desc: 'Know what\'s happening across protected systems instead of relying on periodic checkups.',
    },
    {
      title: 'Create the Proof',
      desc: 'Maintain evidence of the controls you\'re actually operating.',
    },
    {
      title: 'Reduce Renewal-Time Scrambling',
      desc: 'Identify requirements before a deadline forces the issue.',
    },
    {
      title: 'Strengthen Your Security Posture',
      desc: 'Address vulnerabilities across endpoints, networks and critical cloud environments.',
    },
    {
      title: 'Protect Confidential Information',
      desc: 'Strengthen the systems protecting client, patient and corporate data.',
    },
    {
      title: 'Reduce Business Disruption',
      desc: 'Address weaknesses before they become incidents capable of interrupting your practice.',
    },
    {
      title: 'Be Better Prepared for Security Reviews',
      desc: 'Have documented controls rather than relying on verbal assurances.',
    },
    {
      title: 'Sleep Without Wondering Who Is Watching',
      desc: 'Your security environment receives continuous attention, not just attention when something goes wrong.',
    },
  ];

  return (
    <section id="services" className="py-28 bg-white text-slate-900 relative border-b border-slate-200">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
        
        {/* Sticky Scroll Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Section Title */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              <span>THREE PILLARS. ONE SECURITY POSITION.</span>
            </div>

            <h2 className="text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold text-slate-900 tracking-tighter leading-tight">
              Three Pillars. <br />
              <span className="text-[#0284C7]">One Security Position.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We engineer a fortified, continuous security position tailored specifically for Georgia professional practices facing stringent cyber insurance audits and regulatory standards.
            </p>

            <div className="pt-4 hidden lg:block">
              <button
                onClick={() => onNavigate('/apply')}
                className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider px-6 py-4 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.03]"
              >
                <span>START YOUR SECURITY ASSESSMENT →</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Column: Light Mode Micro-Gravity Translucent Service Cards */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 70 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 90,
                    damping: 15,
                    delay: idx * 0.15 
                  }}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-soft-card hover:border-sky-400/60 hover:shadow-lg transition-all duration-300 space-y-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <span className="font-mono text-3xl font-black text-[#0284C7] group-hover:scale-110 transition-transform inline-block">
                          {p.number}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* 3D Floating Icon Asset */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl bg-slate-50/80 border border-slate-200/80 p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-sm">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-full h-full object-contain mix-blend-multiply rounded-xl select-none"
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{p.title}</h3>
                    <h4 className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest">{p.subhead}</h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">{p.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 text-xs font-mono font-semibold text-[#0284C7]">
                    {p.objective}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* What This Means for Your Practice (9 Outcomes) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-10 text-left shadow-2xl"
        >
          <div className="space-y-3 border-b border-slate-800 pb-6">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What This Means for Your Practice
            </h3>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              You're not buying another piece of IT software. You're building a security environment designed to withstand scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {outcomes.map((o, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-[#0284C7] transition-colors"
              >
                <div className="flex items-start gap-2.5 text-emerald-400">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <h4 className="font-bold text-white text-base sm:text-lg leading-snug">{o.title}</h4>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{o.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <p className="text-sm font-mono text-slate-400">
              Start with the documentation provided by your broker or carrier.
            </p>
            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary shrink-0 bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs sm:text-sm tracking-wider px-7 py-4 rounded-full flex items-center gap-2 shadow-md transition-all hover:scale-[1.03]"
            >
              <span>START YOUR SECURITY ASSESSMENT →</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
