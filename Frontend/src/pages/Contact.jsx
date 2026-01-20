import React from "react";
import { Mail, Instagram, Linkedin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Contact Us – BioCrats Club
      </h1>

      <div className="grid gap-6 md:grid-cols-3 w-full max-w-4xl">
        <a
          href="mailto:biocrats@iiti.ac.in"
          className="flex items-center justify-center gap-2 p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100"
        >
          <Mail className="w-5 h-5 text-blue-600" />
          <span>Email</span>
        </a>

        <a
          href="https://www.linkedin.com/in/biocratsclub-iiti/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100"
        >
          <Linkedin className="w-5 h-5 text-blue-700" />
          <span>LinkedIn</span>
        </a>

        <a
          href="https://www.instagram.com/biocrats_iiti/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100"
        >
          <Instagram className="w-5 h-5 text-pink-500" />
          <span>Instagram</span>
        </a>
      </div>

      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Find Us Here
        </h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.0189275480554!2d75.91927947523692!3d22.520374579543036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd6b12dc0c03%3A0xeda990eae13b62d!2sIndian%20Institute%20of%20Technology%20Indore!5e0!3m2!1sen!2sin!4v1696164699271!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="IIT Indore Map"
          className="rounded-2xl shadow-md"
        ></iframe>
      </div>
    </div>
  );
}
