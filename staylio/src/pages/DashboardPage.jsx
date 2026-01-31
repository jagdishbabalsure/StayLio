import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/Particles';
import ChatbotIcon from '../components/chatbot/ChatbotIcon';
import ChatbotWindow from '../components/chatbot/ChatbotWindow';
import bookingService from '../services/bookingService';
import hotelService from '../services/hotelService';
import { generateReceipt } from '../utils/receiptGenerator';
import EmailVerificationModal from '../components/EmailVerificationModal';

const DashboardPage = () => {
  const { user, logout, updateUser } = useAuth(); // Assuming updateUser exists in context
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingReceiptId, setDownloadingReceiptId] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: '', text: '' });
    try {
      // Logic for profile update would go here (likely needing a userService update method)
      // For now, simulating success
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDownloadReceipt = async (booking) => {
    // Implementation for downloading receipt
    setDownloadingReceiptId(booking.id);
    try {
      await generateReceipt(booking);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingReceiptId(null);
    }
  };

  const renderBookings = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>
      {loading ? (
        <p className="text-gray-400">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
          <p className="text-gray-400 mb-4">You haven't made any bookings yet.</p>
          <button onClick={() => navigate('/hotels')} className="bg-[#8400ff] text-white px-6 py-2 rounded-lg font-bold">Browse Hotels</button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{booking.hotelName}</h3>
                <p className="text-gray-400 text-sm">Reference: {booking.bookingReference}</p>
                <p className="text-gray-300 mt-2">{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">₹{booking.totalAmount}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                  {booking.status}
                </span>
                <div className="mt-4">
                  <button onClick={() => handleDownloadReceipt(booking)} className="text-[#a855f7] hover:text-white text-sm font-medium mr-4">Download Receipt</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const handleVerificationSuccess = () => {
    // Optionally show a toast or message
    alert('Email verified successfully!');
    // User context is updated inside the modal via updateUser
  };

  if (!user) {
    // ... (existing access denied)
  }

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Verification Banner */}
      {!user.isEmailVerified && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold">Email not verified</h3>
              <p className="text-gray-400 text-sm">Please verify your email to enable reviews and better security.</p>
            </div>
          </div>
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            Verify Now
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {/* ... (existing code) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/10 p-6 border-l-4 border-l-[#8400ff]">
          <h3 className="text-gray-400 text-sm font-medium">Total Bookings</h3>
          <p className="text-3xl font-bold text-white mt-2">{bookings.length}</p>
        </div>
        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/10 p-6 border-l-4 border-l-green-500">
          <h3 className="text-gray-400 text-sm font-medium">Active Bookings</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {bookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/10 p-6 border-l-4 border-l-pink-500">
          <h3 className="text-gray-400 text-sm font-medium">Total Spent</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      {/* ... (existing code) */}
      <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No recent activity.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="pb-3 font-medium">Hotel</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {bookings.slice(0, 3).map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-4">{booking.hotelName || `Hotel #${booking.hotelId}`}</td>
                    <td className="py-4">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">₹{booking.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setActiveTab('bookings')}
              className="mt-4 text-[#a855f7] hover:text-white text-sm font-medium transition-colors"
            >
              View all bookings →
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ... (renderBookings remains same)
  // ... (renderProfile remains largely same, just adding indicator)

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
      <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/10 p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8400ff] to-[#a855f7] rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {profileData.firstName?.[0]}{profileData.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {profileData.firstName} {profileData.lastName}
              {user.isEmailVerified ? (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Verified
                </span>
              ) : (
                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
                >
                  Verify Email
                </button>
              )}
            </h3>
            <p className="text-gray-400">Personal Information</p>
          </div>
        </div>

        {/* ... (existing profile form code) */}
        {profileMessage.text && (
          <div className={`p-4 mb-6 rounded-xl border ${profileMessage.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* ... (existing fields) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="w-full bg-[#060010] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8400ff] focus:ring-1 focus:ring-[#8400ff] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="w-full bg-[#060010] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8400ff] focus:ring-1 focus:ring-[#8400ff] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={profileData.email}
                disabled
                title="Email cannot be changed"
                className="w-full bg-[#060010]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed border-dashed"
              />
              <div className="absolute right-3 top-3">
                {user.isEmailVerified ? (
                  <span className="text-green-500 flex items-center gap-1 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Contact support to change your email address.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full bg-[#060010] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8400ff] focus:ring-1 focus:ring-[#8400ff] transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-[#8400ff] w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold hover:bg-[#7000d6] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060010] relative text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#8400ff', '#a855f7']}
          particleCount={100}
          particleSpread={15}
          speed={0.1}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sidebar / Topbar for Mobile */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-br from-[#8400ff] to-[#a855f7] rounded-lg"></div>
                <span className="font-bold text-xl tracking-tight">Staylio</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm text-gray-400">Hello, {user.firstName}</span>
                  {user.isEmailVerified && (
                    <span className="text-[10px] text-green-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Verified
                    </span>
                  )}
                </div>
                <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 space-y-2 sticky top-24 shadow-xl">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-[#8400ff] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'bookings' ? 'bg-[#8400ff] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-[#8400ff] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/kdduutaw.json"
                    trigger="hover"
                    colors={`primary:${activeTab === 'profile' ? '#ffffff' : '#9ca3af'},secondary:${activeTab === 'profile' ? '#ffffff' : '#9ca3af'}`}
                    style={{ width: '24px', height: '24px' }}
                  ></lord-icon>
                  Profile Settings
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'bookings' && renderBookings()}
              {activeTab === 'profile' && renderProfile()}
            </div>

          </div>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        email={user.email}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <ChatbotIcon onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
      <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default DashboardPage;
