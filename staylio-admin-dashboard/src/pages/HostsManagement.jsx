import React, { useState, useEffect } from 'react';
import { hostAPI } from '../services/api';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';

const HostsManagement = () => {
  const [hosts, setHosts] = useState([]);
  const [filteredHosts, setFilteredHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchHosts();
  }, []);

  useEffect(() => {
    filterHosts();
  }, [hosts, searchTerm, statusFilter]);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const response = await hostAPI.getAllHosts();
      setHosts(response.data || []);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      setHosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterHosts = () => {
    let filtered = hosts;

    if (searchTerm) {
      filtered = filtered.filter(host =>
        host.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        host.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        host.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(host => host.status === statusFilter);
    }

    setFilteredHosts(filtered);
  };

  const handleApproveHost = async (hostId) => {
    try {
      setActionLoading(hostId);
      const response = await hostAPI.approveHost(hostId);
      if (response.data.success) {
        await fetchHosts();
        setSuccessMessage('Host approved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to approve host: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error approving host:', error);
      alert('Failed to approve host');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectHost = async (hostId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(hostId);
      const response = await hostAPI.rejectHost(hostId, reason);
      if (response.data.success) {
        await fetchHosts();
        setSuccessMessage('Host rejected successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to reject host: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error rejecting host:', error);
      alert('Failed to reject host');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteHost = async (hostId) => {
    if (!confirm('Are you sure you want to delete this host?')) return;

    try {
      setActionLoading(hostId);
      await hostAPI.deleteHost(hostId);
      await fetchHosts();
    } catch (error) {
      console.error('Error deleting host:', error);
      alert('Failed to delete host');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING_APPROVAL: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.PENDING_APPROVAL;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosts Management</h1>
          <p className="text-gray-600">Manage and approve host registrations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Host</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hosts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Hosts</p>
              <p className="text-lg font-semibold">{hosts.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-semibold">
                {hosts.filter(h => h.status === 'PENDING_APPROVAL').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-lg font-semibold">
                {hosts.filter(h => h.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-lg font-semibold">
                {hosts.filter(h => h.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hosts Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Host Details</th>
                <th className="table-header">Company</th>
                <th className="table-header">Status</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHosts.map((host) => (
                <tr key={host.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{host.ownerName}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {host.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {host.phone}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{host.companyName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {host.businessAddress}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(host.status)}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {new Date(host.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedHost(host);
                          setShowViewModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {host.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleApproveHost(host.id)}
                            disabled={actionLoading === host.id}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectHost(host.id)}
                            disabled={actionLoading === host.id}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDeleteHost(host.id)}
                        disabled={actionLoading === host.id}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHosts.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hosts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding a new host.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Host Modal */}
      {showViewModal && selectedHost && (
        <HostViewModal
          host={selectedHost}
          onClose={() => {
            setShowViewModal(false);
            setSelectedHost(null);
          }}
        />
      )}

      {/* Create Host Modal */}
      {showCreateModal && (
        <CreateHostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchHosts();
          }}
        />
      )}
    </div>
  );
};

// Host View Modal Component
const HostViewModal = ({ host, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Host Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Owner Name:</span>
                  <p className="font-medium">{host.ownerName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="font-medium">{host.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone:</span>
                  <p className="font-medium">{host.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Business Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Company Name:</span>
                  <p className="font-medium">{host.companyName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Business Address:</span>
                  <p className="font-medium">{host.businessAddress}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      host.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      host.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {host.status === 'APPROVED' ? 'Approved' :
                       host.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {host.kycDocumentUrl && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">KYC Document</h3>
              <a
                href={host.kycDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                View KYC Document
              </a>
            </div>
          )}

          {host.payoutDetails && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Payout Details</h3>
              <p className="text-sm text-gray-900">{host.payoutDetails}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Registration Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Created At:</span>
                <p className="font-medium">{new Date(host.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Updated At:</span>
                <p className="font-medium">{new Date(host.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Create Host Modal Component
const CreateHostModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    companyName: '',
    businessAddress: '',
    kycDocumentUrl: '',
    payoutDetails: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await hostAPI.createHost(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating host:', error);
      alert('Failed to create host');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Host</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address *
              </label>
              <textarea
                required
                rows={3}
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KYC Document URL
              </label>
              <input
                type="url"
                value={formData.kycDocumentUrl}
                onChange={(e) => setFormData({ ...formData, kycDocumentUrl: e.target.value })}
                className="input-field"
                placeholder="https://example.com/kyc-document.pdf"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payout Details
              </label>
              <textarea
                rows={2}
                value={formData.payoutDetails}
                onChange={(e) => setFormData({ ...formData, payoutDetails: e.target.value })}
                className="input-field"
                placeholder="Bank details, UPI ID, etc."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Host'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostsManagement;