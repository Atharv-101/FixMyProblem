
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, User } from '../types.ts';
import { UserCircle, Terminal, Globe, Linkedin, Github, MapPin, GraduationCap, Building2, Users, Save, Sparkles, Camera } from 'lucide-react';
import Modal from './Modal.tsx';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useStore();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        if(user && isOpen) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                skills: user.skills || [],
                websiteUrl: user.websiteUrl || '',
                linkedin: user.linkedin || '',
                github: user.github || '',
                location: user.location || '',
                university: user.university || '',
                major: user.major || '',
                gradYear: user.gradYear || '',
                companyName: user.companyName || '',
                teamSize: user.teamSize || '',
            });
        }
    }, [user, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(formData);
            onClose();
        } catch (error) {
            alert("Protocol update failed.");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof User, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Identity Reconfiguration">
            <form onSubmit={handleSave} className="space-y-8 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                {/* Preview Card */}
                <div className="tactile-card bg-black text-white p-6 rounded-3xl relative overflow-hidden mb-10">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Terminal className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-citrus border-2 border-white flex items-center justify-center text-black font-black text-3xl group cursor-pointer relative">
                             {user?.name?.charAt(0)}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                             </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter">{formData.name || 'Anonymous User'}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-citrus">{user?.role} PROTOCOL ACTIVE</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                            <UserCircle className="w-3 h-3" /> Full Identity
                        </label>
                        <input 
                            type="text" required 
                            className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all" 
                            value={formData.name} onChange={e => updateField('name', e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Location Node
                        </label>
                        <input 
                            type="text" 
                            className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" 
                            placeholder="Bangalore, India"
                            value={formData.location} onChange={e => updateField('location', e.target.value)} 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                         Personal Manifesto / Bio
                    </label>
                    <textarea 
                        className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" 
                        placeholder="Tell the grid who you are..." 
                        value={formData.bio} onChange={e => updateField('bio', e.target.value)} 
                    />
                </div>

                {user?.role === UserRole.STUDENT && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                    <GraduationCap className="w-3 h-3" /> University Hub
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" 
                                    value={formData.university} onChange={e => updateField('university', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                    Major Focus
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" 
                                    placeholder="Computer Science"
                                    value={formData.major} onChange={e => updateField('major', e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Technical Skillset (Comma Separated)
                            </label>
                            <input 
                                type="text" 
                                className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" 
                                placeholder="React, Rust, AWS..."
                                value={formData.skills?.join(', ')} onChange={e => updateField('skills', e.target.value.split(',').map(s => s.trim()))} 
                            />
                        </div>
                    </div>
                )}

                {user?.role === UserRole.COMPANY && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                    <Building2 className="w-3 h-3" /> Entity Legal Name
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" 
                                    value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                    <Users className="w-3 h-3" /> Internal Team Size
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" 
                                    placeholder="50-100 Nodes"
                                    value={formData.teamSize} onChange={e => updateField('teamSize', e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 pt-6 border-t-2 border-black/5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Social Sync Protocols</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                <Linkedin className="w-3 h-3" /> LinkedIn
                            </label>
                            <input 
                                type="url" 
                                className="w-full border-2 border-black p-3 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all text-xs" 
                                value={formData.linkedin} onChange={e => updateField('linkedin', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                <Github className="w-3 h-3" /> GitHub
                            </label>
                            <input 
                                type="url" 
                                className="w-full border-2 border-black p-3 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all text-xs" 
                                value={formData.github} onChange={e => updateField('github', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Website
                            </label>
                            <input 
                                type="url" 
                                className="w-full border-2 border-black p-3 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all text-xs" 
                                value={formData.websiteUrl} onChange={e => updateField('websiteUrl', e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="tactile-btn w-full bg-black text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-forest disabled:opacity-50 mt-10 transition-all"
                >
                    {loading ? <Terminal className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Sync to Grid</>}
                </button>
            </form>
        </Modal>
    );
};

export default ProfileEditModal;
