import React from 'react';
import { Link } from "react-router-dom";
import NicheSection from './NicheSection ';
import StreaksSection from './StreaksSection';

const ProfileAbout = () => {
  return (
         <div className="row">
            <div className="col-lg-8 bg-white shadow">
                <div className="rounded p-3">
                    <div className='d-flex justify-between items-start p-3'>
                        <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-2">About</h5>
                        <p className="text-16 text-light-1 mb-2">
                            Craft an engaging story in your bio and make meaningful connections with peers and recruiters alike!
                        </p>
                        <Link to="#" className="text-blue-1">Add About</Link>
                        </div>
                        <div className="">
                        <img
                            src="/img/profile/about.webp"
                            alt="about"
                            style={{ width: 140, height: 110 }}
                        />
                        </div>
                    </div>
                </div>
                <hr className="border-t border-gray-100 mb-8"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-15">Resume</h5>
                        <p className="text-16 text-light-1 mb-10">Add your Resume & get your profile filled in a click!</p>
                        <Link to="#" className="text-blue-1">Upload Resume</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/resume.webp"
                        alt="resume"
                        style={{ width: 140, height: 110 }}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-15">Skills</h5>
                        <p className="text-16 text-light-1 mb-10">Spotlight your unique skills for recruiters!</p>
                        <Link to="#" className="text-blue-1">Add Skills</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/skills.webp"
                        alt="skills"
                        style={{ width: 140, height: 110 }}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-15">Work Experience</h5>
                        <p className="text-16 text-light-1 mb-10">Narrate your professional journey to new career heights!</p>
                        <Link to="#" className="text-blue-1">Add Work Experience</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/work_experience.webp"
                        alt="work-experience"
                        style={{ width: 140, height: 110 }}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-12">Education</h5>
                        <p className="text-16 text-light-1 mb-10">Showcase your academic journey to your dream opportunities!</p>
                        <Link to="#" className="text-blue-1">Add Education</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/education.webp"
                        alt="education"
                        style={{ width: 140, height: 110 }}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-12">Certificates</h5>
                        <p className="text-16 text-light-1 mb-10">
                        Highlight your professional certifications and achievements to stand out from the crowd!
                        </p>
                        <Link to="#" className="text-blue-1">Add Certificate</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/certificate.webp"
                        alt="certificate"
                        style={{ width: 140, height: 110}}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-12">Projects</h5>
                        <p className="text-16 text-light-1 mb-10">Unveil your projects to the world and pave your path to professional greatness!</p>
                        <Link to="#" className="text-blue-1">Add Projects</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/projects.webp"
                        alt="projects"
                        style={{ width: 140, height: 110 }}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>

                <div className="rounded p-3 mb-12">
                    <div className="d-flex justify-between items-start p-3">
                    <div className="flex flex-col">
                        <h5 className="text-20 fw-600 mb-12">Achievement</h5>
                        <p className="text-16 text-light-1 mb-10">Broadcast your triumphs and make a remarkable impression on industry leaders!</p>
                        <Link to="#" className="text-blue-1">Add Achievement</Link>
                    </div>
                    <div className="">
                        <img
                        src="/img/profile/achievements.webp"
                        alt="achievement"
                        style={{ width: 140, height: 110 }}
                        />
                    </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-12"/>
                    <StreaksSection/>
                </div>
              {/* Right Sidebar Cards */}
              <div className="col-lg-4">
                <NicheSection/>

                <div className="bg-white shadow rounded p-3 mb-30">
                  <h5 className="text-20 fw-600 mb-15">Rankings <Link to="#" className="text-blue-1 text-12">How it works?</Link></h5>
                  <p>Total Points: 0</p>
                  <p>Total Badges: 2</p>
                </div>

                <div className="bg-white shadow rounded p-3">
                  <h5 className="text-20 fw-600 mb-15">Startups Coins <Link to="#" className="text-blue-1 text-12">How it works?</Link></h5>
                  <div className="d-flex align-items-center gap-10">
                    <img src="/img/dashboard/coin.svg" alt="coin" style={{ width: 30 }} />
                    <span className="fw-500 text-16">700 Coins</span>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ProfileAbout