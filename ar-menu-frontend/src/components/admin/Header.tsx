import Image from 'next/image';

interface HeaderProps {
    profile: { name?: string; logoUrl?: string } | null;
    loading: boolean;
}

const Header = ({ profile, loading }: HeaderProps) => {
  return (
    <header className="h-16 bg-brand-dark-secondary border-b  flex items-center justify-between px-6 flex-shrink-0">
      {/* Display Restaurant Name */}
      <div className="text-lg font-semibold text-brand-text">
        {loading ? 'Loading...' : (profile?.name || 'Dashboard')}
      </div>

      {/* Display Logo (Optional) */}
      {profile?.logoUrl && (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold bg-white">
          <Image
            src={profile.logoUrl}
            alt="Restaurant Logo"
            width={45}
            height={45}
            className="object-cover"
            unoptimized // May be needed depending on R2/Next.js config
          />
        </div>
      )}
      {/* Add profile dropdown menu later if needed */}
    </header>
  );
};

export default Header;