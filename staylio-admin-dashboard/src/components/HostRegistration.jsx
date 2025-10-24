import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Upload, 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';

const HostRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessAddress: '',
    kycDocumentUrl: '',
    payoutDetails: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.ownerName.trim()) {
      errors.ownerName = 'Owner name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!formData.businessAddress.trim()) {
      errors.businessAddress = 'Business address is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create host registration data with password
      const hostData = {
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        companyName: formData.companyName,
        businessAddress: formData.businessAddress,
        kycDocumentUrl: formData.kycDocumentUrl || null,
        payoutDetails: formData.payoutDetails || null
      };
      
      // Submit registration using new auth API
      const response = await axios.post('http://localhost:8081/api/auth/signup-host', hostData);
      
      if (!response.data.success) {
        setError(response.data.message);
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      // Reset form
      setFormData({
        ownerName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        businessAddress: '',
        kycDocumentUrl: '',
        payoutDetails: ''
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your host registration has been submitted successfully. Your account is now pending approval from our admin team.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You will receive an email notification once your account has been reviewed and approved.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full btn-primary block text-center"
            >
              Go to Login
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  ownerName: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  companyName: '',
                  businessAddress: '',
                  kycDocumentUrl: '',
                  payoutDetails: ''
                });
              }}
              className="w-full btn-secondary"
            >
              Register Another Host
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Host Registration
          </h1>
          <p className="text-gray-600">
            Join Staylio as a host and start managing your properties
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${validationErrors.ownerName ? 'border-red-300' : ''}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {validationErrors.ownerName && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.ownerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${validationErrors.phone ? 'border-red-300' : ''}`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-field pr-10 ${validationErrors.password ? 'border-red-300' : ''}`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.confirmPassword ? 'border-red-300' : ''}`}
                    placeholder="Confirm your password"
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${validationErrors.companyName ? 'border-red-300' : ''}`}
                      placeholder="Enter your company name"
                    />
                  </div>
                  {validationErrors.companyName && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className={`input-field pl-10 resize-none ${validationErrors.businessAddress ? 'border-red-300' : ''}`}
                      placeholder="Enter your complete business address"
                    />
                  </div>
                  {validationErrors.businessAddress && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.businessAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KYC Document URL
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      name="kycDocumentUrl"
                      value={formData.kycDocumentUrl}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="https://example.com/kyc-document.pdf"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your KYC documents to a cloud service and provide the URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payout Details
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      name="payoutDetails"
                      value={formData.payoutDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field pl-10 resize-none"
                      placeholder="Enter your bank account details or preferred payout method"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                'Register as Host'
              )}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostRegistration;