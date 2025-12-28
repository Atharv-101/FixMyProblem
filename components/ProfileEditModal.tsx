
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { UserCircle, Edit2, Globe } from 'lucide-react';
import Modal from './Modal.tsx';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useStore();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
    const [website, setWebsite] = useState(user?.websiteUrl || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(user) {
            setName(user.name);
            setBio(user.bio || '');
            setSkills(user.skills?.join(', ') || '');
            setWebsite(user.websiteUrl || '');
        }
    }, [user, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(
                name, 
                bio, 
                skills.split(',').map(s => s.trim()).filter(s => s), 
                undefined, // Skipping file
                website
            );
            onClose();
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSave} className="space-y-4">
                <div className="flex justify-center mb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                             <UserCircle className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input type="text" required className="w-full border p-2.5 rounded-lg" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Bio / About</label>
                    <textarea className="w-full border p-2.5 rounded-lg h-24 text-sm" placeholder="Tell us about yourself..." value={bio} onChange={e => setBio(e.target.value)} />
                </div>

                {user?.role === UserRole.STUDENT && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Skills (comma separated)</label>
                        <input type="text" className="w-full border p-2.5 rounded-lg" placeholder="React, Python, SQL..." value={skills} onChange={e => setSkills(e.target.value)} />
                    </div>
                )}

                {user?.role === UserRole.COMPANY && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Website URL</label>
                        <input type="url" className="w-full border p-2.5 rounded-lg" placeholder="https://company.com" value={website} onChange={e => setWebsite(e.target.value)} />
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </Modal>
    );
};

export default ProfileEditModal;
