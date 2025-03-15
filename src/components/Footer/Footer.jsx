import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='footer'>
        <div className="footer-primary py-[20px] bg-[#f3f2f0]">
            <div className="container-fluid px-[20px] md:px-[40px] md:px-[60px] md:flex md:justify-between">
                <div className="w-[50px] h-[50px] mb-[30px]">
                    <img className='block w-full h-full rounded-full' src="../../../PocketCV.jpg" alt="Logo" />
                </div>
                <div className="menu-1 mb-[20px]">
                    <h3 className='font-bold text-[20px] mb-[10px]'>General</h3>
                    <ul>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Sign Up</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Help Center</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">About</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Blog</Link>
                        </li>
                    </ul>
                </div>
                <div className="menu-2 mb-[20px]">
                    <h3 className='font-bold text-[20px] mb-[10px]'>Browse PocketCV</h3>
                    <ul>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Learning</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Jobs</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Games</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Salary</Link>
                        </li>
                    </ul>
                </div>
                <div className="menu-3 mb-[20px]">
                    <h3 className='font-bold text-[20px] mb-[10px]'>Business Solutions</h3>
                    <ul>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Talent</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Marketing</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Sales</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Learning</Link>
                        </li>
                    </ul>
                </div>
                <div className="menu-4">
                    <h3 className='font-bold text-[20px] mb-[10px]'>Directories</h3>
                    <ul>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Members</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Jobs</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Companies</Link>
                        </li>
                        <li>
                            <Link className='text-[#00000099] mb-[8px] block hover:text-[#1a73e8] short-transition' href="#">Featured</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="footer-secondary py-[20px]">
            <div className="container-fluid px-[20px] md:px-[40px] md:px-[60px]">
                <div className="flex justify-between lg:justify-center lg:gap-[20px]">
                    <div className="menu-5 lg:flex gap-[20px]">
                        <div className="flex items-center gap-[5px] mb-[10px] lg:mb-0">
                            <div className="w-[20px] h-[20px]">
                                <img className='block w-full h-full rounded-full' src="../../../PocketCV.jpg" alt="Logo" />
                            </div>
                            <span className="inline-block font-bold text-[#0A66C2]">PocketCV</span>
                            <span className="inline-block text-[14px] text-[#666666] block">@2025</span>
                        </div>
                        <ul className='lg:flex gap-[15px]'>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={'#'}>Accesbility</Link>
                            </li>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={'#'}>Privacy Policy</Link>
                            </li>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={'#'}>Copyright Policy</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="menu-6">
                        <ul className='md:flex gap-[10px] lg:gap-[15px]'>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={"#"}>About</Link>
                            </li>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={"#"}>User Agreement</Link>
                            </li>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={"#"}>Cookie Policy</Link>
                            </li>
                            <li>
                                <Link className='text-[#666666] mb-[10px] md:mb-0 block hover:text-[#1a73e8] short-transition' href={"#"}>Brand Policy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer