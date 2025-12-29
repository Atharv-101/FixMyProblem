import React, { useState } from 'react';
import { Mail, Phone, MapPin, FileText, Loader2, CheckCircle2, XCircle, Users } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // In a real application, you would send this data to a backend API.
        // For this demo, we'll just simulate a submission.
        setTimeout(() => {
            console.log("Contact form submitted:", { name, email, subject, message });
            if (Math.random() > 0.1) { // Simulate 90% success rate
                setStatus('success');
                setName(''); setEmail(''); setSubject(''); setMessage('');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 flex items-center justify-center">
                    <Users className="w-8 h-8 mr-3 text-indigo-600" /> Get in Touch
                </h1>
                <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    We're here to help you navigate your journey with FixMyProblem. Whether it's a query about challenges, solutions, or a partnership opportunity, reach out to us!
                </p>
                
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <Phone className="w-6 h-6 mr-3 text-blue-600" /> Our Details
                        </h2>
                        <div className="space-y-6 text-gray-700">
                            <div className="flex items-center text-sm md:text-base">
                                <Mail className="w-5 h-5 mr-4 text-gray-500" aria-hidden="true" />
                                <span className="font-semibold">General Inquiries:</span> <a href="mailto:info@fixmyproblem.com" className="ml-2 text-blue-600 hover:underline">info@fixmyproblem.com</a>
                            </div>
                            <div className="flex items-center text-sm md:text-base">
                                <Mail className="w-5 h-5 mr-4 text-gray-500" aria-hidden="true" />
                                <span className="font-semibold">Support:</span> <a href="mailto:support@fixmyproblem.com" className="ml-2 text-blue-600 hover:underline">support@fixmyproblem.com</a>
                            </div>
                            <div className="flex items-center text-sm md:text-base">
                                <Phone className="w-5 h-5 mr-4 text-gray-500" aria-hidden="true" />
                                <span className="font-semibold">Phone:</span> <a href="tel:+11234567890" className="ml-2 text-blue-600 hover:underline">+1 (123) 456-7890</a>
                            </div>
                            <div className="flex items-start text-sm md:text-base">
                                <MapPin className="w-5 h-5 mr-4 mt-1 text-gray-500 flex-shrink-0" aria-hidden="true" />
                                <div>
                                    <span className="font-semibold block">Headquarters:</span> 
                                    <p className="ml-0 mt-1">123 Innovation Drive,<br/>Tech Hub City, TL 90210, Country</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 mt-6">
                                <p className="text-xs md:text-sm text-gray-500">
                                    Our dedicated team is available to assist you during business hours, Monday to Friday, 9 AM to 5 PM (local time).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FileText className="w-6 h-6 mr-3 text-green-600" /> Send Us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    required 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    aria-label="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Your Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    required 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    aria-label="Your Email Address"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    required 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={subject} 
                                    onChange={e => setSubject(e.target.value)} 
                                    aria-label="Subject of your message"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea 
                                    id="message" 
                                    rows={5} 
                                    required 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
                                    value={message} 
                                    onChange={e => setMessage(e.target.value)} 
                                    aria-label="Your Message"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                                aria-live="polite"
                            >
                                {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" /> : <Mail className="w-5 h-5 mr-2" aria-hidden="true" />}
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center text-sm" role="alert">
                                    <CheckCircle2 className="w-5 h-5 mr-2" aria-hidden="true" /> Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg flex items-center text-sm" role="alert">
                                    <XCircle className="w-5 h-5 mr-2" aria-hidden="true" /> Failed to send message. Please try again later.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;