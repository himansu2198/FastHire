import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, Users, Shield, Building,
  CheckCircle, TrendingUp, DollarSign, Star,
  Zap, Search, Bell, FileText, Target,
  BarChart2, UserCheck, Globe, Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import FeatureCard from '../../components/FeatureCard';

const jobCategories = [
  { name: 'Technology', count: '1,234', icon: <Zap className="h-5 w-5" /> },
  { name: 'Marketing',  count: '856',   icon: <TrendingUp className="h-5 w-5" /> },
  { name: 'Design',     count: '723',   icon: <Star className="h-5 w-5" /> },
  { name: 'Finance',    count: '645',   icon: <DollarSign className="h-5 w-5" /> },
  { name: 'Healthcare', count: '432',   icon: <Shield className="h-5 w-5" /> },
  { name: 'Education',  count: '389',   icon: <Users className="h-5 w-5" /> },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Active Jobs',      icon: <Briefcase className="h-6 w-6" /> },
  { value: 5000,  suffix: '+', label: 'Companies',        icon: <Building className="h-6 w-6" />  },
  { value: 50000, suffix: '+', label: 'Job Seekers',      icon: <Users className="h-6 w-6" />     },
  { value: 95,    suffix: '%', label: 'Satisfaction Rate',icon: <Star className="h-6 w-6" />      },
];

const seekerFeatures = [
  { icon: <Search className="h-5 w-5" />,   title: 'Smart Job Search',  description: 'Filter by role, location, salary and experience to find your perfect match.'   },
  { icon: <Bell className="h-5 w-5" />,     title: 'Job Alerts',        description: 'Get notified instantly when roles matching your profile are posted.'             },
  { icon: <FileText className="h-5 w-5" />, title: 'One-Click Apply',   description: 'Apply to multiple jobs quickly using your saved resume and profile.'            },
  { icon: <Target className="h-5 w-5" />,   title: 'Career Guidance',   description: 'Access resources and tips to craft stronger applications and ace interviews.'   },
];

const employerFeatures = [
  { icon: <BarChart2 className="h-5 w-5" />,  title: 'Applicant Dashboard', description: 'Track and manage all applications with clear status and pipeline view.'       },
  { icon: <UserCheck className="h-5 w-5" />,  title: 'Verified Talent',     description: 'Access a pool of screened, job-ready candidates across domains.'              },
  { icon: <Globe className="h-5 w-5" />,      title: 'Wide Reach',          description: 'Your listings reach thousands of active job seekers every single day.'        },
  { icon: <Clock className="h-5 w-5" />,      title: 'Fast Hiring',         description: 'Cut time-to-hire with smart filters, quick shortlisting, and easy workflows.' },
];

const HomePage = () => {
  const { isAuthenticated, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold
                           px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            Trusted by 5,000+ Companies Across India
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900
                         leading-tight mb-5 tracking-tight">
            Where Talent Meets{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Opportunity
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            FastHire connects ambitious professionals with top companies — faster, smarter, and without the noise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 hover:shadow-lg
                         active:scale-95 hover:scale-105 text-white font-semibold px-8 py-3.5
                         rounded-lg transition-all duration-200 text-base shadow-sm"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => navigate('/employer/post-job')}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 hover:shadow-md
                         active:scale-95 hover:scale-105 text-gray-800 font-semibold px-8 py-3.5
                         rounded-lg border border-gray-200 hover:border-gray-300
                         transition-all duration-200 text-base"
            >
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Built for Everyone
            </h2>
            <p className="text-gray-500 text-lg">
              Whether you're hunting for work or hunting for talent — FastHire delivers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                  <Users className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold text-gray-800">For Job Seekers</h3>
              </div>
              <div className="flex flex-col gap-4">
                {seekerFeatures.map((f, i) => <FeatureCard key={i} {...f} />)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="p-1.5 bg-green-50 rounded-md text-green-600">
                  <Building className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold text-gray-800">For Employers</h3>
              </div>
              <div className="flex flex-col gap-4">
                {employerFeatures.map((f, i) => <FeatureCard key={i} {...f} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOB CATEGORIES */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-gray-500 text-lg">Find jobs in your field of expertise</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobCategories.map((cat, i) => (
              <Link
                key={i}
                to={`/jobs?category=${cat.name.toLowerCase()}`}
                className="group flex items-center justify-between bg-white border border-gray-200
                           rounded-xl px-5 py-4 hover:shadow-md hover:border-blue-200
                           hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 rounded-lg text-blue-600
                                   group-hover:bg-blue-100 transition-colors duration-200">
                    {cat.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.count} jobs</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500
                                group-hover:translate-x-1 transition-all duration-200"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-blue-600 rounded-2xl px-8 py-14 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Start Your Career Journey Today
            </h2>
            <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto">
              Join thousands of professionals who found their next opportunity on FastHire.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Free Registration', 'No Hidden Fees', '24/7 Support'].map((t, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span className="text-white text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register?type=job_seeker"
                    className="bg-white text-blue-600 hover:bg-gray-50 hover:shadow-md
                               active:scale-95 hover:scale-105 px-7 py-3 rounded-lg
                               font-semibold text-sm transition-all duration-200">
                    Join as Job Seeker
                  </Link>
                  <Link to="/register?type=employer"
                    className="bg-transparent border border-white/40 text-white
                               hover:bg-white/10 hover:scale-105 active:scale-95 px-7 py-3
                               rounded-lg font-semibold text-sm transition-all duration-200">
                    Hire Talent
                  </Link>
                </>
              ) : isJobSeeker ? (
                <Link to="/jobs"
                  className="bg-white text-blue-600 hover:bg-gray-50 hover:shadow-md
                             active:scale-95 hover:scale-105 px-7 py-3 rounded-lg
                             font-semibold text-sm transition-all duration-200">
                  Browse Jobs
                </Link>
              ) : (
                <Link to="/employer/post-job"
                  className="bg-white text-blue-600 hover:bg-gray-50 hover:shadow-md
                             active:scale-95 hover:scale-105 px-7 py-3 rounded-lg
                             font-semibold text-sm transition-all duration-200">
                  Post a Job
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;