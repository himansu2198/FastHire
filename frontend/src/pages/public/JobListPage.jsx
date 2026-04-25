import React, { useEffect, useState } from "react";
import { jobApi } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";
import { Search, MapPin, Briefcase, X, SlidersHorizontal } from "lucide-react";

const JobListPage = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => { applyFilters(); },
    [searchKeyword, selectedJobType, selectedLocation, selectedCategory, allJobs]);

  const fetchJobs = async () => {
    try {
      const res = await jobApi.getJobs();
      const jobs = res.jobs || res.data?.jobs || [];
      setAllJobs(jobs);
      setFilteredJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allJobs];
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(j =>
        j.title?.toLowerCase().includes(kw) ||
        j.description?.toLowerCase().includes(kw) ||
        j.companyName?.toLowerCase().includes(kw) ||
        j.role?.toLowerCase().includes(kw)
      );
    }
    if (selectedJobType) filtered = filtered.filter(j => j.jobType === selectedJobType);
    if (selectedLocation) filtered = filtered.filter(j =>
      j.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
    if (selectedCategory) filtered = filtered.filter(j => j.category === selectedCategory);
    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchKeyword(""); setSelectedJobType("");
    setSelectedLocation(""); setSelectedCategory("");
  };

  const hasActiveFilters = searchKeyword || selectedJobType || selectedLocation || selectedCategory;
  const uniqueLocations = [...new Set(allJobs.map(j => j.location))].filter(Boolean);

  const filterTagCls = "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* ── HEADER ── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Find Your Dream Job</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Showing <span className="font-semibold text-gray-700">{filteredJobs.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{allJobs.length}</span> jobs
          </p>
        </div>

        {/* ── SEARCH & FILTERS ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by job title, company, or keyword…"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Job Type */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select value={selectedJobType} onChange={e => setSelectedJobType(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           appearance-none bg-white transition-all duration-200">
                <option value="">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           appearance-none bg-white transition-all duration-200">
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           appearance-none bg-white transition-all duration-200">
                <option value="">All Categories</option>
                {["Technology","Marketing","Design","Finance","Healthcare","Education"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {searchKeyword && (
                <span className={`${filterTagCls} bg-blue-50 text-blue-700`}>
                  "{searchKeyword}"
                  <button onClick={() => setSearchKeyword("")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedJobType && (
                <span className={`${filterTagCls} bg-green-50 text-green-700 capitalize`}>
                  {selectedJobType.replace("-", " ")}
                  <button onClick={() => setSelectedJobType("")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedLocation && (
                <span className={`${filterTagCls} bg-purple-50 text-purple-700`}>
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation("")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedCategory && (
                <span className={`${filterTagCls} bg-orange-50 text-orange-700`}>
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("")}><X className="h-3 w-3" /></button>
                </span>
              )}
              <button onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 font-medium ml-1">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── JOB RESULTS ── */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No jobs found</h3>
            <p className="text-gray-400 text-sm mb-5">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg
                           hover:bg-blue-700 active:scale-95 transition-all duration-200">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListPage;


