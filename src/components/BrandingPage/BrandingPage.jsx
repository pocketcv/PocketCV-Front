import React from 'react'
import Link from "next/link";
import Footer from "../Footer/Footer";
import Select from 'react-select';
import Header from '../Header/Header';
import Image from 'next/image';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../../utils/FirebaseConfig";
import { useRouter } from "next/router";
import axios from "axios";
import { reducerCases } from "../../context/constants";
import { CHECK_USER_ROUTE } from "../../utils/ApiRoutes";
import { useStateProvider } from '@/context/StateContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = [
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'Javascript', label: 'Javascript' },
    { value: 'React', label: 'React' },
    { value: 'Ruby', label: 'Ruby' },
    { value: 'Kotlin', label: 'Kotlin' },
    { value: 'Rust', label: 'Rust' },
]

const services = [
  {
    icon: "/icons/resume.svg",
    title: "Resume Builder",
    description: "Create professional resumes with our intuitive builder. Choose from multiple templates and customize to your needs."
  },
  {
    icon: "/icons/chat.svg",
    title: "Direct Messaging",
    description: "Connect directly with recruiters through our secure messaging platform. Schedule interviews and discuss opportunities."
  },
  {
    icon: "/icons/portfolio.svg",
    title: "Portfolio Showcase",
    description: "Display your projects, skills, and achievements in a beautiful portfolio that catches recruiters' attention."
  },
  {
    icon: "/icons/tracking.svg",
    title: "Application Tracking",
    description: "Keep track of all your job applications in one place. Never miss an opportunity or deadline."
  }
];

const customSelectStyles = {
  control: (base) => ({
    ...base,
    padding: '5px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid #1a73e8'
    }
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#1a73e8' : state.isFocused ? '#e8f0fe' : 'white',
    '&:hover': {
      backgroundColor: state.isSelected ? '#1a73e8' : '#e8f0fe'
    }
  })
};

const BrandingPage = () => {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const {
        user: { displayName: name, email, photoURL: profileImage },
      } = await signInWithPopup(firebaseAuth, provider);

      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email,
        });

        if (!data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: "Available",
            },
          });
          router.push("/app");
        } else {
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              email: data.data.email,
              name: data.data.name,
              profileImage: data.data.profilePicture,
              status: data.data.about,
            },
          });
          router.push("/app");
        }
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="branding-page max-w-full bg-gradient-to-b from-white to-[#f8f9fa]">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      
      {/* Banner Section */}
      <section className="banner py-[40px] md:py-[80px] relative overflow-hidden bg-gradient-to-b from-white to-[#f8f9fa]" id="home">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a73e8]/5 to-transparent pointer-events-none"></div>
        <div className="container-fluid px-[20px] md:px-[60px] lg:px-[80px] md:flex justify-between items-center">
          <div className="banner-left md:w-[49%] relative z-10">
            <h1 className="text-center sm:text-left text-[32px] lg:text-[42px] font-bold leading-[1.2] mb-[30px] bg-gradient-to-r from-[#1a73e8] to-[#4285f4] inline-block text-transparent bg-clip-text">Welcome to PocketCV</h1>
            <p className="text-[18px] text-gray-600 mb-[30px]">Connect with recruiters, showcase your skills, and land your dream job - all in one place.</p>
            <div className="flex flex-col">
              <button
                onClick={login}
                className="text-white bg-[#1a73e8] flex items-center justify-center gap-[10px] px-[20px] py-[12px] rounded-[12px] mb-[20px] sm:w-[300px] transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <i className="inline-block w-[30px] h-[30px] bg-white rounded-full p-[5px]">
                <img src="../../../google.svg" alt="google-icon" className="w-full h-full" />
                </i>
                Continue with Google
              </button>
              {/* <Link href={"#"} className="text-[#1a73e8] border-2 border-[#1a73e8] font-semibold flex items-center justify-center gap-[10px] px-[20px] py-[12px] rounded-[12px] mb-[20px] sm:w-[300px] transform transition-all duration-300 hover:bg-[#1a73e8] hover:text-white">
                Sign in with email
              </Link> */}
            </div>
            <p className="text-gray-600 mb-[20px] md:text-[16px]">By clicking Continue to join or sign in, you agree to PocketCV's <Link href={"#"} className="text-[#1a73e8] hover:underline">User Agreement,</Link><Link href={"#"} className="text-[#1a73e8] hover:underline"> Privacy Policy,</Link> and <Link href={"#"} className="text-[#1a73e8] hover:underline">Cookie Policy</Link>.</p>
          </div>
          <div className="banner-right md:w-[49%] transform transition-all duration-500 hover:scale-105">
            <img src="../../../banner.svg" alt="Banner" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services py-[60px] md:py-[100px] relative overflow-hidden bg-gradient-to-b from-[#f8f9fa] to-white" id="services">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none"></div>
        <div className="container-fluid px-[20px] md:px-[60px] lg:px-[80px] relative z-10">
          <div className="text-center mb-[50px]">
            <h2 className="text-[28px] md:text-[36px] font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the tools and features that will help you create a standout professional profile and connect with the right opportunities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                <div className="w-12 h-12 mb-4 bg-[#e8f0fe] rounded-lg p-2 group-hover:bg-[#1a73e8] transition-colors duration-300">
                  <img src={service.icon} alt={service.title} className="w-full h-full group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-[60px] md:py-[100px] bg-gradient-to-b from-white to-[#f8f9fa] relative overflow-hidden" id="about">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a73e8]/5 to-transparent pointer-events-none"></div>
        <div className="container-fluid px-[20px] md:px-[60px] lg:px-[80px] relative z-10">
          <div className="text-center mb-[50px]">
            <h2 className="text-[28px] md:text-[36px] font-bold text-gray-800 mb-4">About PocketCV</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Building bridges between talent and opportunity through innovative technology and meaningful connections.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="about-content">
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                PocketCV is revolutionizing the way job seekers connect with employers. Our platform combines the power of professional networking with modern resume building tools to help you stand out in today's competitive job market.
              </p>
              <div className="founder-message bg-[#f8f9fa] p-8 rounded-2xl transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-6 ring-4 ring-[#1a73e8]/20">
                    <Image 
                      src="/avatar.jpg" 
                      alt="Founder" 
                      width={80} 
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-1">Stephan Rodrigues</h4>
                    <p className="text-[#1a73e8]">Founder & CEO</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "Our mission is to make job hunting less stressful and more effective. We believe in creating meaningful connections between talented individuals and great companies."
                </p>
              </div>
            </div>
            <div className="about-stats grid grid-cols-2 gap-6">
              <div className="stat-card bg-[#e8f0fe] p-8 rounded-2xl text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <h3 className="text-[#1a73e8] text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">10K+</h3>
                <p className="text-gray-700 font-medium">Active Users</p>
              </div>
              <div className="stat-card bg-[#e8f0fe] p-8 rounded-2xl text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <h3 className="text-[#1a73e8] text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">5K+</h3>
                <p className="text-gray-700 font-medium">Companies</p>
              </div>
              <div className="stat-card bg-[#e8f0fe] p-8 rounded-2xl text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <h3 className="text-[#1a73e8] text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">15K+</h3>
                <p className="text-gray-700 font-medium">Resumes Created</p>
              </div>
              <div className="stat-card bg-[#e8f0fe] p-8 rounded-2xl text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <h3 className="text-[#1a73e8] text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">8K+</h3>
                <p className="text-gray-700 font-medium">Success Stories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="chats-flow py-[40px] md:py-[80px] bg-[#f3f2f0]">
        <div className="container-fluid px-[20px] md:px-[60px] lg:px-[80px]">
          <div className="chats-wrap mb-[40px] md:mb-[60px] md:flex md:justify-around md:h-[180px] lg:h-[220px]">
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'md:items-end'}`}>
                <div className="w-[50px] md:w-[70px] h-[50px] md:h-[70px] relative transform transition-all duration-300 hover:scale-110">
                  <span className={`absolute top-[20%] ${index % 2 === 0 ? 'right-[92%]' : 'left-[92%]'} ${index % 2 === 0 ? 'bg-white' : 'bg-[#eaffe0]'} rounded-[12px] px-[15px] py-[8px] shadow-md`}>
                    {['Hello', 'Olá', 'Hola', 'Olá'][index]}
                  </span>
                  <img className="w-full h-full block rounded-full shadow-lg" src={`../../../profile-${index + 1}.png`} alt={`Profile-${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[24px] md:text-[32px] font-bold text-center mb-[40px] md:w-[600px] md:mx-auto md:mb-[60px] text-gray-800">Connect with recruiters instantly through private messaging and calling. Your dream job is just a chat away.</p>
          <div className="chats-wrap md:flex md:justify-around md:h-[180px] lg:h-[220px]">
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'md:items-end'}`}>
                <div className="w-[50px] md:w-[70px] h-[50px] md:h-[70px] relative transform transition-all duration-300 hover:scale-110">
                  <span className={`absolute top-[20%] ${index % 2 === 0 ? 'right-[92%]' : 'left-[92%]'} ${index % 2 === 0 ? 'bg-white' : 'bg-[#eaffe0]'} rounded-[12px] px-[15px] py-[8px] shadow-md`}>
                    {['مرحبًا', 'Hallo', 'Ciao', 'Hallo'][index]}
                  </span>
                  <img className="w-full h-full block rounded-full shadow-lg" src={`../../../profile-${index + 5}.png`} alt={`Profile-${index + 5}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact py-[60px] md:py-[100px] relative overflow-hidden bg-gradient-to-b from-[#f8f9fa] to-white" id="contact">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none"></div>
        <div className="container-fluid px-[20px] md:px-[60px] lg:px-[80px] relative z-10">
          <div className="text-center mb-[50px]">
            <h2 className="text-[28px] md:text-[36px] font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="contact-info space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center text-gray-600 group">
                    <div className="w-12 h-12 bg-[#e8f0fe] rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#1a73e8] transition-colors duration-300">
                      <svg className="w-6 h-6 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#1a73e8] transition-colors duration-300">pocketcv04@gmail.com</span>
                  </div>
                  <div className="flex items-center text-gray-600 group">
                    <div className="w-12 h-12 bg-[#e8f0fe] rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#1a73e8] transition-colors duration-300">
                      <svg className="w-6 h-6 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#1a73e8] transition-colors duration-300">+44 7818 838813</span>
                  </div>
                  <div className="flex items-center text-gray-600 group">
                    <div className="w-12 h-12 bg-[#e8f0fe] rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#1a73e8] transition-colors duration-300">
                      <svg className="w-6 h-6 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#1a73e8] transition-colors duration-300">123 Innovation Street, Silicon Valley, CA 94025</span>
                  </div>
                </div>
              </div>
              <div className="social-links">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <form className="contact-form bg-white p-8 rounded-2xl shadow-lg">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all duration-300" 
                  type="text" 
                  id="name" 
                  placeholder="Your name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all duration-300" 
                  type="email" 
                  id="email" 
                  placeholder="Your email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all duration-300 h-32 resize-none" 
                  id="message" 
                  placeholder="Your message"
                ></textarea>
              </div>
              <button 
                className="w-full bg-[#1a73e8] text-white font-semibold py-3 rounded-lg transform transition-all duration-300 hover:bg-[#1557b0] hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/50"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* <section className="connecting-people py-[40px] md:py-[80px]">
        <div className="container-fluid px-[20px] md:px-[60px] lg:px-[80px] md:flex md:items-center md:justify-between">
          <div className="connect-people mb-[40px] md:w-[49%] md:mb-0 bg-white p-[30px] rounded-[20px] shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="mb-[30px]">
              <img className="block w-full transform transition-all duration-500 hover:scale-105" src="../../../high-five.svg" alt="High Five" />
            </div>
            <h3 className="text-[24px] md:text-[28px] font-bold mb-[20px] text-gray-800">Connect with people who can help</h3>
            <Link className="text-[#1a73e8] border-2 border-[#1a73e8] font-semibold px-[20px] py-[12px] rounded-[12px] block w-full md:w-[300px] text-center transform transition-all duration-300 hover:bg-[#1a73e8] hover:text-white hover:scale-105" href={"#"}>Find people you know</Link>
          </div>
          <div className="skills md:w-[49%] bg-white p-[30px] rounded-[20px] shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="mb-[30px]">
              <img className="block w-full transform transition-all duration-500 hover:scale-105" src="../../../programming.svg" alt="Programming" />
            </div>
            <h3 className="text-[24px] md:text-[28px] font-bold mb-[20px] text-gray-800">Learn the skills you need to succeed</h3>
            <Select 
              options={options} 
              styles={customSelectStyles}
              placeholder="Choose a skill to learn..."
              className="w-full"
            />
          </div>
        </div>
      </section> */}
      <Footer />
    </div>
  )
}

export default BrandingPage