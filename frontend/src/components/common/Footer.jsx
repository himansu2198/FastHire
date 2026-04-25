import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Heart,
  Globe,
  Shield,
  Users,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Facebook,  href: "#", label: "Facebook"  },
    { Icon: Twitter,   href: "#", label: "Twitter"   },
    { Icon: Linkedin,  href: "#", label: "LinkedIn"  },
    { Icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Top accent bar */}
      <div className="h-1 bg-blue-600" />

      <div className="layout-container py-14 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 bg-blue-600 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">FastHire</h2>
                <p className="text-xs text-gray-400">Where Talent Meets Opportunity</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting exceptional talent with extraordinary opportunities. Build your career or your team — all in one place.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 bg-gray-800 rounded-lg text-gray-400
                             hover:bg-blue-600 hover:text-white hover:scale-110
                             transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Globe className="h-4 w-4 text-blue-400" /> Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home",         path: "/"            },
                { label: "Browse Jobs",  path: "/jobs"        },
                { label: "Companies",    path: "/companies"   },
                { label: "Career Tips",  path: "/career-tips" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link to={path}
                    className="text-sm text-gray-400 hover:text-blue-400
                               transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Users className="h-4 w-4 text-blue-400" /> Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Resume Builder",   path: "/resume-builder"  },
                { label: "Interview Prep",   path: "/interview-prep"  },
                { label: "Blog",             path: "/blog"            },
                { label: "Success Stories",  path: "/success-stories" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link to={path}
                    className="text-sm text-gray-400 hover:text-blue-400
                               transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Shield className="h-4 w-4 text-blue-400" /> Contact
            </h3>
            <ul className="space-y-3">
              {[
                { Icon: Mail,   text: "support@fasthire.in"  },
                { Icon: Phone,  text: "+91 98765 43210"      },
                { Icon: MapPin, text: "Bengaluru, India"     },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-gray-400">
                  <Icon className="h-4 w-4 text-gray-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-red-500" /> for job seekers across India
          </p>
          <p>© {currentYear} FastHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
