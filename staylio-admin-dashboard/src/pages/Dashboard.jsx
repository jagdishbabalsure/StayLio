import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Eye,
  ArrowUpRight,
  Hotel,
  Briefcase,
} from 'lucide-react';
import { hostAPI, adminAPI, hotelAPI, userAPI } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin, isHost } = useAuth();
  const [stats, setStats] = useState({
    totalHosts: 0,
    pendingHosts: 0,
    totalAdmins: 0,
    totalUsers: 0,
    totalHotels: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Fetch all data for admin
        const [hostsRes, pendingHostsRes, adminsRes, usersRes, hotelsRes] = await Promise.all([
          hostAPI.getAllHosts().catch(() => ({ data: [] })),
          hostAPI.getPendingHosts().catch(() => ({ data: [] })),
          adminAPI.getAllAdmins().catch(() => ({ data: [] })),
          userAPI.getAllUsers().catch(() => ({ data: [] })),
          hotelAPI.getAllHotels().catch(() => ({ data: [] })),
        ]);

        setStats({
          totalHosts: hostsRes.data?.length || 0,
          pendingHosts: pendingHostsRes.data?.length || 0,
          totalAdmins: adminsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          totalHotels: hotelsRes.data?.length || 0,
        });
      } else if (isHost) {
        // Fetch host-specific data
        let hotelsRes;
        if (user?.hostname) {
          hotelsRes = await hotelAPI.getHotelsByHostname(user.hostname).catch(() => ({ data: [] }));
        } else {
          hotelsRes = { data: [] };
        }
        setStats({
          totalHotels: hotelsRes.data?.length || 0,
          // Add more host-specific stats as needed
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hosts"
          value={stats.totalHosts}
          icon={Building2}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingHosts}
          icon={Clock}
          color="yellow"
          loading={loading}
        />
        <StatCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={UserCheck}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Hotels</span>
              <span className="font-semibold">{loading ? '...' : stats.totalHotels}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Hosts</span>
              <span className="font-semibold">{loading ? '...' : stats.totalHosts - stats.pendingHosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platform Growth</span>
              <span className="font-semibold text-green-600">+12%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem
              icon={UserCheck}
              text="New host registration pending approval"
              time="2 hours ago"
            />
            <ActivityItem
              icon={Building2}
              text="Hotel listing updated"
              time="4 hours ago"
            />
            <ActivityItem
              icon={Users}
              text="New user registered"
              time="6 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const HostDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100">Manage your hotels and track your performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Hotels"
          value={stats.totalHotels}
          icon={Building2}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Total Bookings"
          value="24"
          icon={Calendar}
          color="green"
          loading={false}
        />
        <StatCard
          title="Revenue"
          value="$12,450"
          icon={DollarSign}
          color="yellow"
          loading={false}
        />
        <StatCard
          title="Occupancy Rate"
          value="78%"
          icon={TrendingUp}
          color="purple"
          loading={false}
        />
      </div>

      {/* Host-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-semibold">4.8/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Response Rate</span>
              <span className="font-semibold">95%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Month Growth</span>
              <span className="font-semibold text-green-600">+8%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            <ActivityItem
              icon={Calendar}
              text="New booking for Ocean View Suite"
              time="1 hour ago"
            />
            <ActivityItem
              icon={Calendar}
              text="Booking confirmed for Deluxe Room"
              time="3 hours ago"
            />
            <ActivityItem
              icon={Calendar}
              text="Check-out completed"
              time="5 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {isAdmin && <AdminDashboard />}
      {isHost && <HostDashboard />}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, loading }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, text, time }) => (
  <div className="flex items-center space-x-3">
    <div className="p-1 bg-gray-100 rounded-full">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-900">{text}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

export default Dashboard;