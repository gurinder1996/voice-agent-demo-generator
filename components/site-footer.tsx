import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex ${className}`}>
      {[
      ].map((social, index) => (
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
