
import React, { useState } from 'react';
import { Mail, Phone, MapPin, FileText, Loader2, CheckCircle2, XCircle, Users, Zap, ShieldCheck, Copy, ExternalLink, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [copied, setCopied] = useState(false);

    const targetEmail = "athinnnovations05@gmail.com";
    const targetPhone = "+91 9423109991";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(targetEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleManualDispatch = () => {
        const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject || 'Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.open(mailtoLink, '_blank');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            // Using Formspree for real email delivery. 
            // Note: The user may need to verify their email on Formspree if they haven't used it before.
            const response = await fetch("https://formspree.io/f/xpwzyvql", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    subject, 
                    message,
                    _replyto: email,
                    _subject: `FixMyProblem Grid: ${subject}`
                })
            });

            if (response.ok) {
                setStatus('success');
                setName(''); setEmail(''); setSubject(''); setMessage('');
            } else {
                // Fallback to error state which allows manual dispatch
                setStatus('error');
            }
        } catch (err) {
            console.error("Grid Transmission Error:", err);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-paper pt-32 px-4 md:px-10 pb-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Mail className="w-[500px] h-[500px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16 reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(255,95,95,1)] mb-6">
                        <Zap className="w-3.5 h-3.5 text-citrus fill-citrus" />
                        Communication Protocol Active
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-citrus decoration-8 underline-offset-8">
                        Get in Touch.
                    </h1>
                    <p className="mt-10 text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto">
                        Bridge the gap. Reach out to the <span className="text-black">ATHinnovations</span> core team for high-stakes technical inquiries.
                    </p>
                </div>
                
                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Contact Information Sidebar */}
                    <div className="lg:col-span-2 space-y-8 reveal-left">
                        <div className="tactile-card p-10 bg-black text-white rounded-[3rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck className="w-32 h-32" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-3 relative z-10">
                                <Phone className="w-6 h-6 text-citrus" /> Core Intel
                            </h2>
                            <div className="space-y-8 relative z-10">
                                <div className="space-y-2 group">
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">General Enquiries</p>
                                    <div className="flex items-center gap-3">
                                        <a href={`mailto:${targetEmail}`} className="text-lg font-bold text-citrus hover:underline decoration-2 underline-offset-4 block truncate">
                                            {targetEmail}
                                        </a>
                                        <button onClick={copyToClipboard} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Protocol Hotline</p>
                                    <a href={`tel:${targetPhone.replace(/\s+/g, '')}`} className="text-lg font-bold text-white hover:text-citrus transition-colors block truncate">
                                        {targetPhone}
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Global HQ</p>
                                    <p className="text-sm font-bold leading-relaxed text-gray-300">
                                        ATHinnovations Command Center<br/>
                                        Innovation Hub, Nashik<br/>
                                        Maharashtra, IN
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="tactile-card p-8 bg-citrus/10 border-2 border-black rounded-[2rem]">
                            <h4 className="font-black text-lg mb-2 uppercase tracking-tighter">Direct Extraction</h4>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed italic mb-4">
                                Need an immediate bypass? Use our direct manual override to open your local mail client. 😁
                            </p>
                            <button onClick={handleManualDispatch} className="w-full py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-forest transition-colors">
                                <ExternalLink className="w-4 h-4" /> Manual Override
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3 reveal-right">
                        <div className="tactile-card bg-white p-8 md:p-12 rounded-[3rem] border-2 border-black">
                            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter mb-8 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-coral" /> Dispatch Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Your Identity</label>
                                        <input 
                                            type="text" id="name" name="name" required 
                                            className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold focus:bg-citrus/5 outline-none transition-all"
                                            value={name} onChange={e => setName(e.target.value)} 
                                            placeholder="Alex Murphy"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Digital Mail</label>
                                        <input 
                                            type="email" id="email" name="email" required 
                                            className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold focus:bg-citrus/5 outline-none transition-all"
                                            value={email} onChange={e => setEmail(e.target.value)} 
                                            placeholder="user@grid.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Topic Header</label>
                                    <input 
                                        type="text" id="subject" name="subject" required 
                                        className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold focus:bg-citrus/5 outline-none transition-all"
                                        value={subject} onChange={e => setSubject(e.target.value)} 
                                        placeholder="Partnership Opportunity"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Communication Brief</label>
                                    <textarea 
                                        id="message" name="message" rows={6} required 
                                        className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold focus:bg-citrus/5 outline-none transition-all resize-none"
                                        value={message} onChange={e => setMessage(e.target.value)} 
                                        placeholder="Transmission details..."
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-4">
                                    <button 
                                        type="submit" 
                                        disabled={status === 'submitting'}
                                        className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-forest disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> Deploy Transmission</>}
                                    </button>

                                    {status === 'success' && (
                                        <div className="bg-forest/10 text-forest p-4 rounded-xl border-2 border-forest flex items-center text-[10px] font-black uppercase tracking-widest animate-pop">
                                            <CheckCircle2 className="w-5 h-5 mr-3" /> Grid synchronized. Message received at {targetEmail}. 🪄
                                        </div>
                                    )}
                                    {status === 'error' && (
                                        <div className="bg-coral/10 text-coral p-4 rounded-xl border-2 border-coral flex flex-col gap-3 animate-pop">
                                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                                                <XCircle className="w-5 h-5 mr-3" /> Signal lost via automated portal. 
                                            </div>
                                            <button type="button" onClick={handleManualDispatch} className="text-[9px] font-black uppercase bg-black text-white p-2 rounded-lg hover:bg-coral transition-colors flex items-center justify-center gap-2">
                                                <ExternalLink className="w-3 h-3" /> Use Manual Dispatch Override
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
