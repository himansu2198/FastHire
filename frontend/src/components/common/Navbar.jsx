import React, { useState } from 'react';
import { Users } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, X, Briefcase, User, Bell, LogOut,
  Home, Search, PlusCircle, Building,
  UserCircle, Bookmark,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isJobSeeker, isEmployer } = useAuth();
  const [isMenuOpen,          setIsMenuOpen]          = useState(false);
  const [isProfileMenuOpen,   setIsProfileMenuOpen]   = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => { logout(); setIsProfileMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/",     icon: <Home className="h-4 w-4" /> },
    { name: "Jobs", path: "/jobs", icon: <Search className="h-4 w-4" /> },
  ];

  const notifications = [
    { id: 1, text: "Your application for Frontend Developer was viewed", time: "2 hours ago", read: false },
    { id: 2, text: "Interview scheduled with TechCorp",                  time: "1 day ago",   read: true  },
    { id: 3, text: "New job matches your profile",                        time: "2 days ago",  read: true  },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="layout-container">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-center justify-center h-9 w-9 bg-blue-600 rounded-lg
                            group-hover:bg-blue-700 transition-colors duration-200">
              <Briefcase
                className="h-5 w-5 text-white transition-transform duration-300
                           group-hover:rotate-6 group-hover:scale-110"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">FastHire</h1>
              <p className="text-[10px] text-gray-400 hidden sm:block leading-none">Where Talent Meets Opportunity</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                {link.icon}{link.name}
              </Link>
            ))}
            {isEmployer && (
              <Link to="/employer/post-job"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/employer/post-job")
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                <PlusCircle className="h-4 w-4" />Post Job
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 rounded-lg text-gray-500 hover:text-blue-600
                               hover:bg-gray-100 transition-all duration-200 active:scale-95">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white
                                       text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg
                                    border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                        <p className="text-xs text-gray-500">You have {unreadCount} unread</p>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id}
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                              !n.read ? "bg-blue-50/60" : ""}`}>
                            <p className="text-sm text-gray-800">{n.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link to="/notifications"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => setIsNotificationsOpen(false)}>
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100
                               transition-all duration-200 active:scale-95">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {isJobSeeker
                        ? <UserCircle className="h-4 w-4 text-blue-600" />
                        : <Building className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.username}</p>
                      <p className="text-[10px] text-gray-400 capitalize leading-tight">{user?.role}</p>
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg
                                    border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1.5 text-[10px] bg-blue-50 text-blue-600
                                         px-2 py-0.5 rounded-full font-medium capitalize">{user?.role}</span>
                      </div>

                      {isJobSeeker && (
                        <>
                          <Link to="/jobseeker/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Briefcase className="h-4 w-4" />Dashboard
                          </Link>
                          <Link to="/jobseeker/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <User className="h-4 w-4" />My Profile
                          </Link>
                          <Link to="/jobseeker/applications"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Bookmark className="h-4 w-4" />My Applications
                          </Link>
                        </>
                      )}

                      {isEmployer && (
                        <>
                          <Link to="/employer/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Briefcase className="h-4 w-4" />Dashboard
                          </Link>
                          <Link to="/employer/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Building className="h-4 w-4" />Company Profile
                          </Link>
                          <Link to="/employer/jobs"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <PlusCircle className="h-4 w-4" />My Job Postings
                          </Link>
                          <Link to="/employer/applicants"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Users className="h-4 w-4" />Applicants
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5
                                     text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="h-4 w-4" />Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200
                             rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all
                             duration-200 active:scale-95">
                  Login
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600
                             rounded-lg hover:bg-blue-700 hover:shadow-md transition-all
                             duration-200 active:scale-95 shadow-sm">
                  Register
                </Link>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900
                         hover:bg-gray-100 transition-all duration-200 active:scale-95">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3">
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  {link.icon}{link.name}
                </Link>
              ))}
              {isEmployer && (
                <Link to="/employer/post-job"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm
                             font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle className="h-4 w-4" />Post Job
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="pt-3 border-t border-gray-100 flex gap-2 px-1">
                  <Link to="/login"
                    className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700
                               border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register"
                    className="flex-1 py-2.5 text-center text-sm font-medium text-white
                               bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>Register</Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100">
                  <div className="px-4 py-3 mb-1 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {isJobSeeker && (
                    <>
                      <Link to="/jobseeker/dashboard"    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}><Briefcase className="h-4 w-4" />Dashboard</Link>
                      <Link to="/jobseeker/profile"      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}><User className="h-4 w-4" />My Profile</Link>
                      <Link to="/jobseeker/applications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}><Bookmark className="h-4 w-4" />My Applications</Link>
                    </>
                  )}
                  {isEmployer && (
                    <>
                      <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}><Briefcase className="h-4 w-4" />Dashboard</Link>
                      <Link to="/employer/profile"   className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}><Building className="h-4 w-4" />Company Profile</Link>
                      <Link to="/employer/jobs"      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}><PlusCircle className="h-4 w-4" />My Jobs</Link>
                    </>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 mt-1
                               text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="h-4 w-4" />Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;