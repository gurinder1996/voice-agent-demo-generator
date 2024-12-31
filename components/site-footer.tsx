import { IconType } from 'react-icons';

interface SocialLink {
  href: string;
  icon: IconType;
}

function SocialLinks({ className }: { className?: string }) {
  const socialLinks: SocialLink[] = [
    // Add your social links here if needed
  ];

  return (
    <div className={`flex ${className}`}>
      {socialLinks.map((social, index) => (
        <span key={index}>
          <a href={social.href} target="_blank" rel="noopener noreferrer">
            <social.icon
              size={24}
              className="text-white transition-all duration-200 mx-2 ease-in-out hover:text-background hover:scale-125"
            />
          </a>
        </span>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="">
      
    </footer>
  );
}
