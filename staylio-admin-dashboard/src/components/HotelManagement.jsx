import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import hotelManagementService from '../services/hotelManagementService';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    Search, 
    Filter, 
    RefreshCw, 
    AlertCircle,
    CheckCircle,
    Loader,
    X,
    Save
} from 'lucide-react';

const HotelManagement = () => {
    const { user } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        price: '',
        rating: '',
        reviews: '',
        image: '',
        hostname: ''
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (user) {
            hotelManagementService.setUser(user);
            loadHotels();
        }
    }, [user]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadHotels = async () => {
        setLoading(true);
        try {
            const result = await hotelManagementService.fetchHotels();
            if (result.success) {
                setHotels(result.data);
                console.log('Hotels loaded:', result.data);
            } else {
                showToast(result.message, 'error');
                console.error('Failed to load hotels:', result.message);
            }
        } catch (error) {
            showToast('Failed to load hotels', 'error');
            console.error('Error loading hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            city: '',
            price: '',
            rating: '',
            reviews: '',
            image: '',
            hostname: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Hotel name is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.rating || formData.rating < 0 || formData.rating > 5) {
            newErrors.rating = 'Rating must be between 0 and 5';
        }

        if (formData.reviews && formData.reviews < 0) {
            newErrors.reviews = 'Reviews count cannot be negative';
        }

        if (formData.image && formData.image.trim()) {
            const imageUrl = formData.image.trim().toLowerCase();
            if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                newErrors.image = 'Image URL must be a valid HTTP/HTTPS URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCreate = () => {
        resetForm();
        if (user?.role === 'host' && user?.hostname) {
            setFormData(prev => ({ ...prev, hostname: user.hostname }));
        }
        setShowCreateModal(true);
    };

    const handleEdit = (hotel) => {
        setSelectedHotel(hotel);
        setFormData({
            name: hotel.name || '',
            city: hotel.city || '',
            price: hotel.price || '',
            rating: hotel.rating || '',
            reviews: hotel.reviews || '',
            image: hotel.image || '',
            hostname: hotel.hostname || ''
        });
        setShowEditModal(true);
    };

    const handleView = (hotel) => {
        setSelectedHotel(hotel);
        setShowViewModal(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const hotelData = {
                ...formData,
                price: parseInt(formData.price),
                rating: parseFloat(formData.rating),
                reviews: parseInt(formData.reviews) || 0
            };

            const result = await hotelManagementService.createHotel(hotelData);
            
            if (result.success) {
                showToast('Hotel created successfully');
                setShowCreateModal(false);
                resetForm();
                await loadHotels();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Failed to create hotel', 'error');
            console.error('Create error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const hotelData = {
                ...formData,
                price: parseInt(formData.price),
                rating: parseFloat(formData.rating),
                reviews: parseInt(formData.reviews) || 0
            };

            const result = await hotelManagementService.updateHotel(selectedHotel.id, hotelData);
            
            if (result.success) {
                showToast('Hotel updated successfully');
                setShowEditModal(false);
                resetForm();
                setSelectedHotel(null);
                await loadHotels();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Failed to update hotel', 'error');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (hotel) => {
        if (!window.confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
            return;
        }

        setLoading(true);
        try {
            const result = await hotelManagementService.deleteHotel(hotel.id);
            
            if (result.success) {
                showToast('Hotel deleted successfully');
                await loadHotels();
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Failed to delete hotel', 'error');
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHotels = hotels.filter(hotel =>
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.hostname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Modal = ({ show, onClose, title, children }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    const FormField = ({ label, name, type = 'text', required = false, ...props }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
                {...props}
            />
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${
                    toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
                    <p className="text-gray-600">
                        {user?.role === 'admin' ? 'Manage all hotels' : 'Manage your hotels'}
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Hotel</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="card">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search hotels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={loadHotels}
                        disabled={loading}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Hotels List */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Hotels ({filteredHotels.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <Loader className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                        <p className="text-gray-500 mt-2">Loading hotels...</p>
                    </div>
                ) : filteredHotels.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {hotels.length === 0 ? 'No hotels found' : 'No hotels match your search'}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredHotels.map((hotel) => (
                            <div key={hotel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {hotel.city} • ${hotel.price}/night • ⭐ {hotel.rating} ({hotel.reviews} reviews)
                                    </p>
                                    {hotel.hostname && (
                                        <p className="text-xs text-blue-600">Host: {hotel.hostname}</p>
                                    )}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleView(hotel)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    
                                    {hotelManagementService.canEditHotel(hotel) && (
                                        <button
                                            onClick={() => handleEdit(hotel)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Hotel"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    )}
                                    
                                    {hotelManagementService.canDeleteHotel(hotel) && (
                                        <button
                                            onClick={() => handleDelete(hotel)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Hotel"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                show={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                title="Create New Hotel"
            >
                <form onSubmit={handleSubmitCreate}>
                    <FormField
                        label="Hotel Name"
                        name="name"
                        required
                        placeholder="Enter hotel name"
                    />
                    
                    <FormField
                        label="City"
                        name="city"
                        required
                        placeholder="Enter city"
                    />
                    
                    <FormField
                        label="Price per Night"
                        name="price"
                        type="number"
                        required
                        placeholder="Enter price"
                        min="1"
                    />
                    
                    <FormField
                        label="Rating"
                        name="rating"
                        type="number"
                        required
                        placeholder="Enter rating (0-5)"
                        min="0"
                        max="5"
                        step="0.1"
                    />
                    
                    <FormField
                        label="Number of Reviews"
                        name="reviews"
                        type="number"
                        placeholder="Enter number of reviews"
                        min="0"
                    />
                    
                    <FormField
                        label="Image URL"
                        name="image"
                        placeholder="Enter image URL"
                    />
                    
                    {user?.role === 'admin' && (
                        <FormField
                            label="Hostname"
                            name="hostname"
                            placeholder="Enter hostname"
                        />
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            <span>{loading ? 'Creating...' : 'Create Hotel'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreateModal(false);
                                resetForm();
                            }}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedHotel(null);
                }}
                title="Edit Hotel"
            >
                <form onSubmit={handleSubmitEdit}>
                    <FormField
                        label="Hotel Name"
                        name="name"
                        required
                        placeholder="Enter hotel name"
                    />
                    
                    <FormField
                        label="City"
                        name="city"
                        required
                        placeholder="Enter city"
                    />
                    
                    <FormField
                        label="Price per Night"
                        name="price"
                        type="number"
                        required
                        placeholder="Enter price"
                        min="1"
                    />
                    
                    <FormField
                        label="Rating"
                        name="rating"
                        type="number"
                        required
                        placeholder="Enter rating (0-5)"
                        min="0"
                        max="5"
                        step="0.1"
                    />
                    
                    <FormField
                        label="Number of Reviews"
                        name="reviews"
                        type="number"
                        placeholder="Enter number of reviews"
                        min="0"
                    />
                    
                    <FormField
                        label="Image URL"
                        name="image"
                        placeholder="Enter image URL"
                    />
                    
                    {user?.role === 'admin' && (
                        <FormField
                            label="Hostname"
                            name="hostname"
                            placeholder="Enter hostname"
                        />
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            <span>{loading ? 'Updating...' : 'Update Hotel'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                resetForm();
                                setSelectedHotel(null);
                            }}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                show={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedHotel(null);
                }}
                title="Hotel Details"
            >
                {selectedHotel && (
                    <div className="space-y-4">
                        {selectedHotel.image && (
                            <img
                                src={selectedHotel.image}
                                alt={selectedHotel.name}
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Name:</span>
                                <p className="text-gray-900">{selectedHotel.name}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">City:</span>
                                <p className="text-gray-900">{selectedHotel.city}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Price:</span>
                                <p className="text-gray-900">${selectedHotel.price}/night</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Rating:</span>
                                <p className="text-gray-900">⭐ {selectedHotel.rating}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Reviews:</span>
                                <p className="text-gray-900">{selectedHotel.reviews}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Host:</span>
                                <p className="text-gray-900">{selectedHotel.hostname || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="pt-4">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedHotel(null);
                                }}
                                className="w-full btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HotelManagement;