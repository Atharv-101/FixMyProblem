import React, { useState } from 'react';
import { Mail, Phone, MapPin, FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react';

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
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">Get in Touch</h1>
                
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <Phone className="w-6 h-6 mr-3 text-blue-600" /> Our Details
                        </h2>
                        <div className="space-y-6 text-gray-700">
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 mr-4 text-gray-500" />
                                <span className="font-semibold">Email:</span> <a href="mailto:support@fixmyproblem.com" className="ml-2 text-blue-600 hover:underline">support@fixmyproblem.com</a>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 mr-4 text-gray-500" />
                                <span className="font-semibold">Phone:</span> <a href="tel:+11234567890" className="ml-2 text-blue-600 hover:underline">+1 (123) 456-7890</a>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-4 mt-1 text-gray-500 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold block">Address:</span> 
                                    <p className="ml-0 mt-1">123 Problem Solving Ave,<br/>Innovation City, Code Land, 90210</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 mt-6">
                                <p className="text-sm text-gray-500">
                                    We're here to help! Whether you have questions about posting a problem, submitting a solution, or general inquiries, feel free to reach out.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
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
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Mail className="w-5 h-5 mr-2" />}
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center">
                                    <CheckCircle2 className="w-5 h-5 mr-2" /> Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg flex items-center">
                                    <XCircle className="w-5 h-5 mr-2" /> Failed to send message. Please try again later.
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
