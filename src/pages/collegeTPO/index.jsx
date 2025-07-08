import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MetaComponent from "@/components/common/MetaComponent";
import DefaultHeader from "@/components/header/default-header";
import DefaultCallToActions from "@/components/common/CallToActions";
import GuestCallToActions from "@/components/home/home-5/CallToActions";
import Footer4 from "@/components/footer/footer-4";
import { api } from '@/utils/apiProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const metadata = {
  title: "Startups24x7",
  description: "Startups24x7 - All-in-One Platform for Startup Services"
};

const CollegeRegistrationContest = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    college_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    city: ''
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/college/register-college`, formData);
      toast.success('🎉 Registration successful!', {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        college_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        city: ''
      });
    } catch (err) {
      toast.error('❌ Registration failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <ToastContainer />
      <DefaultHeader />

      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url("/img/backgrounds/college.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        padding: '60px 5%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Arial, sans-serif',
        gap: '40px'
      }}>
        {/* Left Section */}
        <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#1e429f', marginBottom: '20px' }}>
            Join the Startups24x7 College Registration Contest
          </h1>
          <p style={{ fontSize: '18px', color: '#2d3748', marginBottom: '10px' }}>
            🚀 Earn Recognition — Get Invited to Internship Day 2025
          </p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>
            Open for all College Placement Officers and Heads of Department.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={{
          flex: '1 1 400px',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '35px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '25px', color: '#1a202c' }}>
            📋 College Registration Form
          </h2>

          <input name="college_name" type="text" placeholder="College Name" value={formData.college_name} onChange={handleChange} style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input name="first_name" type="text" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} />
            <input name="last_name" type="text" placeholder="Last Name" value={formData.last_name} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} />
          </div>
          <input name="email" type="email" placeholder="placement@college.com" value={formData.email} onChange={handleChange} style={inputStyle} />
          <input name="phone" type="tel" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} style={inputStyle} />

          <select name="designation" value={formData.designation} onChange={handleChange} style={inputStyle}>
            <option value="">Choose designation</option>
            <option value="professor">Professor</option>
            <option value="hod">HOD</option>
            <option value="director">Director</option>
            <option value="placement">Placement Officer</option>
          </select>

          <select name="department" value={formData.department} onChange={handleChange} style={inputStyle}>
            <option value="">Choose department</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="mech">Mechanical</option>
            <option value="mba">MBA</option>
          </select>

          <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} style={inputStyle} />

          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#007fff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '10px',
            transition: '0.3s'
          }}>
            🚀 Register Now
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#4a5568' }}>
            <p>Need help? Email us: <span style={{ fontWeight: '600' }}>startups24x7@gmail.com</span></p>
          </div>
        </form>
      </div>

      {/* How It Works Section */}
      <div className="container" style={{ padding: '80px 20px' }}>
        <div className="text-center mb-40">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">How it works?</h2>
          <p className="text-md text-gray-700">
            Unlock exclusive benefits for your college by registering today!
          </p>
        </div>

        <div className="row y-gap-30 justify-between items-center">
          <div className="col-md-4 text-center px-3">
            <img src="/img/icons/fill_in_details.svg" alt="Fill Details" style={{ width: "80px", marginBottom: "15px" }} />
            <h4 className="text-lg font-semibold text-blue-900">Fill in the form</h4>
            <p className="text-sm text-gray-600 mt-2">
              Provide all essential college and authority information through the form above.
            </p>
          </div>

          <div className="col-md-4 text-center px-3">
            <img src="/img/icons/register_students.svg" alt="Register Students" style={{ width: "80px", marginBottom: "15px" }} />
            <h4 className="text-lg font-semibold text-blue-900">Register your students</h4>
            <p className="text-sm text-gray-600 mt-2">
              We’ll help your students register on Startups24x7 & access free internships.
            </p>
          </div>

          <div className="col-md-4 text-center px-3">
            <img src="/img/icons/provide_access_to_internships.svg" alt="Get Featured" style={{ width: "80px", marginBottom: "15px" }} />
            <h4 className="text-lg font-semibold text-blue-900">Get Featured at Internship Day 2025</h4>
            <p className="text-sm text-gray-600 mt-2">
              Top-performing colleges get an exclusive invite to be part of our internship panel.
            </p>
          </div>
        </div>
      </div>

      {isLoggedIn ? <DefaultCallToActions /> : <GuestCallToActions />}
      <Footer4 />
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #cbd5e0',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: '0.2s',
};

export default CollegeRegistrationContest;
