'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProfileData {
  name: string;
  email: string; // Display email (read-only)
  logoUrl?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch profile data on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }

    const fetchProfile = async () => {
      setLoading(true); setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/restaurants/me`;
        const res = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.status === 401) throw new Error('Unauthorized');
        if (!res.ok) throw new Error('Failed to fetch profile.');
        const data: ProfileData = await res.json();
        setProfile(data);
        setNameInput(data.name); // Initialize form field
        setLogoPreview(data.logoUrl || null); // Show current logo
      } catch (err: any) {
         if (err.message === 'Unauthorized') { localStorage.removeItem('authToken'); router.push('/admin/login'); }
         else { setError(err.message); }
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [router]);

  // Handle logo file selection and create preview URL
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(profile?.logoUrl || null); // Revert to original if file deselected
    }
  };

  // Handle form submission to update profile
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null); setSuccess(null);
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/restaurants/me`;
      const formData = new FormData();
      formData.append('name', nameInput); // Add updated name
      if (selectedFile) {
        formData.append('image', selectedFile); // Add new logo file if selected
      }

      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }, // No 'Content-Type' for FormData
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update profile.');
      }

      const updatedProfile: ProfileData = await res.json();
      setProfile(updatedProfile); // Update displayed profile
      setNameInput(updatedProfile.name); // Update form field
      setLogoPreview(updatedProfile.logoUrl || null); // Update logo preview
      setSelectedFile(null); // Clear selected file
      setSuccess('Profile updated successfully!');
      // TODO: Update restaurant name in the header/sidebar globally if needed (requires state management/context)

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-brand-text-secondary animate-pulse">Loading Settings...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      <h1 className="text-3xl font-bold text-brand-text">Restaurant Settings</h1>

      {/* Display Errors/Success Messages */}
      {error && <div className="p-4 text-sm text-red-100 bg-red-800 bg-opacity-40 border border-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 text-sm text-green-100 bg-green-800 bg-opacity-40 border border-green-700 rounded-lg">{success}</div>}

      {profile && (
        <form onSubmit={handleSubmit} className="p-6 bg-brand-dark-secondary rounded-lg shadow-lg border border-gray-700 space-y-6 max-w-2xl">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
            <input type="email" value={profile.email} disabled className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-gray-400 cursor-not-allowed" />
          </div>

          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1" htmlFor="name">Restaurant Name</label>
            <input
              id="name" type="text" value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required
              className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold text-brand-text placeholder-gray-500"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1" htmlFor="logo">Logo</label>
            <div className="flex items-center space-x-4">
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo Preview" width={80} height={80} className="rounded-full object-cover border-2 border-brand-gold bg-gray-700" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-dark border border-gray-600 flex items-center justify-center text-gray-500 text-xs">No Logo</div>
              )}
              <input
                id="logo" type="file" name="image" accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-brand-text-secondary file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-brand-dark hover:file:bg-brand-gold-light cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold"
              />
            </div>
            <p className="text-xs text-brand-text-secondary mt-1">Recommended: Square image (e.g., 200x200px).</p>
          </div>

          {/* Submit Button */}
          <div className="pt-5 border-t border-gray-700/50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-center min-w-[120px] ${
                saving
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-brand-gold text-brand-dark hover:bg-brand-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark-secondary focus:ring-brand-gold'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}