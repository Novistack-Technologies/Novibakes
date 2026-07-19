import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa6";
import { contactDetails } from "../../data/data";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";


const icons = [
  <MapPin size={40} className="text-[#ec4899]" />,
  <Phone size={40} className="text-yellow-500" />,
  <Mail size={40} className="text-blue-600" />,
  <Clock size={40} className="text-green-500" />,
];

const ContactUs = () => {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(
        () => {
          toast.success("Email sent successfully!");
          form.current.reset();
        },
        (error) => {
          toast.error("Failed to send email. Please try again.");
          console.warn("EmailJS error:", error.text);
        },
      );
  };

  return (
    <>
    <div className="pt-10">
      <section className="bg-white py-12 px-4 w-full">
        <div className="max-w-6xl mx-auto w-full px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-3xl font-bold text-center text-slate-800 mb-2"
          >
            Contact The <span className="text-[#ec4899]">NoviBakes</span> for Orders & Collabs
          </motion.h2>
               <div className="flex flex-col lg:flex-row mt-10 gap-8">
            {/* LEFT CARD - CONTACT INFO */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-[40%]"
            >
              {/* Header card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#ec4899] p-4 text-white mb-4">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/[0.06]" />
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-1 text-center">
                    Contact Information
                  </h2>
                  <p className="text-white text-sm text-center">
                    Reach out through any of these channels
                  </p>
                </div>
              </div>

              {/* Info cards */}
              <div className="space-y-2.5">
                {/* Address */}
                <div className="group flex items-start gap-4 p-3 rounded-xl border border-rose-100 bg-white hover:border-[#ec4899] hover:shadow-sm transition-all duration-200 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-[#fdf2f8] flex items-center justify-center text-[#ec4899] shrink-0 transition-all duration-200">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-800">Address</h4>
                    <p className="text-sm text-gray-800 font-medium whitespace-pre-line leading-relaxed">
                      No:14/1, James 1st Cross Street{"\n"}Poonamallee, Chennai
                      - 600056
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="group flex items-start gap-4 p-3 rounded-xl border border-rose-100 bg-white hover:border-[#ec4899] hover:shadow-sm transition-all duration-200 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-500 shrink-0 transition-all duration-200">
                    <Phone size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-800">Phone</h4>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                      {import.meta.env.VITE_BAKERY_PHONE}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="group flex items-start gap-4 p-3 rounded-xl border border-rose-100 bg-white hover:border-[#ec4899] hover:shadow-sm transition-all duration-200 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 transition-all duration-200">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-800">Email</h4>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                      {import.meta.env.VITE_BAKERY_EMAIL}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="group flex items-start gap-4 p-3 rounded-xl border border-rose-100 bg-white hover:border-[#ec4899] hover:shadow-sm transition-all duration-200 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0 transition-all duration-200">
                    <Clock size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-800">
                      Working Hours
                    </h4>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                      Monday – Friday 10:00 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-2">
                  <h4 className="text-[20px] font-bold text-slate-800 tracking-widest mb-3 text-center">
                    Stay Connected
                  </h4>
                  <div className="flex justify-center items-center gap-2.5">
                    <Link
                      to="https://x.com/novistack"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-slate-700 hover:border-black hover:text-black hover:bg-black/5 transition-all duration-200"
                    >
                      <FaXTwitter size={20} />
                    </Link>

                    <Link
                      to="https://www.instagram.com/novistacktechnologies?igsh=MXRxZTE1ejc5ZDViZw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-slate-700 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-200"
                    >
                      <FaInstagram size={20} />
                    </Link>

                    <Link
                      to="https://www.linkedin.com/company/novistack-technologies"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <FaFacebook size={20} />
                    </Link>

                    <Link
                      to={`https://wa.me/91${import.meta.env.VITE_BAKERY_WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-slate-700 hover:border-green-600 hover:text-green-600 hover:bg-green-50/50 transition-all duration-200"
                    >
                      <FaWhatsapp size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-[50%] bg-white rounded-lg shadow-xl p-8 border border-gray-200 ml-auto"
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-1.5 text-center">
                  Send Us a Message
                </h2>
                <p className="text-sm text-slate-700 text-center">
                  Fill out the form below and our team will respond within 24
                  hours.
                </p>
              </div>
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-800">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Enter Name"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-800">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Enter Email"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899]"
                    />
                  </div>
                </div>

                {/* Subject and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-800">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      placeholder="Enter Subject"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-800">
                      Your Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="Enter Phone Number"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-800">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Enter Message"
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899]"
                  ></textarea>
                </div>

                {/* Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#ec4899] hover:bg-[#db2777] text-white py-3 font-semibold rounded-full transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      </div>
    </>
  );
};

export default ContactUs;
