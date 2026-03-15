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
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="layout-container">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo with hover animation ── */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-10 w-10">
              <Briefcase
                className="h-8 w-8 text-purple-600 transition-transform duration-300
                           group-hover:rotate-12 group-hover:scale-110"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-gray-900">Job Listing Portal</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Find your dream job</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}>
                {link.icon}{link.name}
              </Link>
            ))}
            {isEmployer && (
              <Link to="/employer/post-job"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/employer/post-job")
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
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
                    className="relative p-2 rounded-lg text-gray-600 hover:text-primary-600
                               hover:bg-gray-50 transition-colors">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white
                                       text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg
                                    border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">You have {unreadCount} unread</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id}
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                              !n.read ? "bg-blue-50" : ""}`}>
                            <p className="text-sm text-gray-800">{n.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link to="/notifications"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          onClick={() => setIsNotificationsOpen(false)}>
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-9 w-9 bg-purple-100 rounded-full flex items-center justify-center">
                      {isJobSeeker
                        ? <UserCircle className="h-5 w-5 text-purple-600" />
                        : <Building className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg
                                    border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.username}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role}</p>
                      </div>

                      {isJobSeeker && (
                        <>
                          <Link to="/jobseeker/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Briefcase className="h-4 w-4" />Dashboard
                          </Link>
                          <Link to="/jobseeker/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <User className="h-4 w-4" />My Profile
                          </Link>
                          <Link to="/jobseeker/applications"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Bookmark className="h-4 w-4" />My Applications
                          </Link>
                        </>
                      )}

                      {isEmployer && (
                        <>
                          <Link to="/employer/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Briefcase className="h-4 w-4" />Dashboard
                          </Link>
                          <Link to="/employer/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Building className="h-4 w-4" />Company Profile
                          </Link>
                          <Link to="/employer/jobs"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <PlusCircle className="h-4 w-4" />My Job Postings
                          </Link>
                          <Link to="/employer/applicants"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}>
                            <Users className="h-4 w-4" />Applicants
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3
                                     text-sm text-red-600 hover:bg-red-50">
                          <LogOut className="h-4 w-4" />Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login"    className="btn-outline px-5 py-2.5 text-sm font-medium">Login</Link>
                <Link to="/register" className="btn-primary px-5 py-2.5 text-sm font-medium">Register</Link>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900
                         hover:bg-gray-100 transition-colors">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  {link.icon}{link.name}
                </Link>
              ))}
              {isEmployer && (
                <Link to="/employer/post-job"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg
                             text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle className="h-5 w-5" />Post Job
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200">
                  <Link to="/login"    className="block px-4 py-3 text-center btn-outline mb-3"
                    onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block px-4 py-3 text-center btn-primary"
                    onClick={() => setIsMenuOpen(false)}>Register</Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-4 py-3 mb-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{user?.username}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  {isJobSeeker && (
                    <>
                      <Link to="/jobseeker/dashboard"    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}><Briefcase className="h-5 w-5" />Dashboard</Link>
                      <Link to="/jobseeker/profile"      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}><User className="h-5 w-5" />My Profile</Link>
                      <Link to="/jobseeker/applications" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}><Bookmark className="h-5 w-5" />My Applications</Link>
                    </>
                  )}
                  {isEmployer && (
                    <>
                      <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}><Briefcase className="h-5 w-5" />Dashboard</Link>
                      <Link to="/employer/profile"   className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}><Building className="h-5 w-5" />Company Profile</Link>
                      <Link to="/employer/jobs"      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}><PlusCircle className="h-5 w-5" />My Jobs</Link>
                    </>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3
                               text-red-600 hover:bg-red-50 mt-3">
                    <LogOut className="h-5 w-5" />Logout
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