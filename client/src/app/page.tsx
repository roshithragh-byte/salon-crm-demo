"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EDITORIAL_SERVICES,
  EDITORIAL_TEAM,
  EDITORIAL_TESTIMONIALS,
  ServiceItem,
} from "@/lib/editorialData";
import { businessConfig } from "@/business.config";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reservation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    EDITORIAL_SERVICES[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const displayedServices =
    activeCategory === "all"
      ? EDITORIAL_SERVICES.slice(0, 6)
      : EDITORIAL_SERVICES.filter((s) => s.category === activeCategory);

  const selectedService =
    EDITORIAL_SERVICES.find((s) => s.id === selectedServiceId) ||
    EDITORIAL_SERVICES[0];

  const handleOpenModal = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    setBookingConfirmed(false);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;
    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-[#c4beae] text-[#252628] selection:bg-[#252628] selection:text-white">
      {/* ── TOP STICKY BAR ── */}
      <header
        className="sticky top-0 z-40 bg-[#c4beae]"
        style={{ borderBottom: "1px solid rgba(37, 38, 40, 0.28)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="#top"
            className="font-serif-editorial text-2xl tracking-tight text-[#252628] whitespace-nowrap hover:opacity-85 transition"
          >
            Naturals Salon
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <a
              href="#services"
              className="font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-70 transition"
            >
              Services
            </a>
            <a
              href="#products"
              className="font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-70 transition"
            >
              Products
            </a>
            <a
              href="#team"
              className="font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-70 transition"
            >
              Team
            </a>
            <a
              href="#testimonials"
              className="font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-70 transition"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="font-sans-label text-[11px] font-semibold text-[#252628] hover:opacity-70 transition"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenModal()}
              type="button"
              className="font-sans-label text-[11px] font-semibold px-5 py-2.5 bg-[#252628] text-white hover:opacity-90 transition whitespace-nowrap active:scale-95 shadow-xs"
            >
              Book Visit
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              aria-label="Toggle Menu"
              className="md:hidden p-2 border border-[#252628]/40 text-[#252628]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-[#252628]/20 pt-3 bg-[#c4beae]">
            <a
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans-label text-[11px] font-semibold text-[#252628]"
            >
              Services
            </a>
            <a
              href="#products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans-label text-[11px] font-semibold text-[#252628]"
            >
              Products
            </a>
            <a
              href="#team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans-label text-[11px] font-semibold text-[#252628]"
            >
              Team
            </a>
            <a
              href="#testimonials"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans-label text-[11px] font-semibold text-[#252628]"
            >
              Reviews
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans-label text-[11px] font-semibold text-[#252628]"
            >
              Contact
            </a>
          </div>
        )}
      </header>

      {/* ── SECTION 1: HERO / FULL-SERVICE SALON ── */}
      <section
        id="top"
        style={{ backgroundColor: "#c4beae" }}
        className="py-16 md:py-24 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-stretch">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="font-serif-editorial text-4xl sm:text-5xl leading-[1.08] tracking-tight text-[#252628] pb-5">
                We are a full-service salon.
              </h1>
              <div className="hairline-dark mb-8" />
            </div>

            <div className="pt-8 md:pt-16">
              <p className="font-serif-editorial text-xl sm:text-[22px] leading-[1.5] text-[#252628] mb-7">
                Unisex hair, skin, bridal, and spa care tailored to your natural
                texture and personal style. From precision cuts and botanical
                keratin infusions to clinical Hydra facials, every ritual is
                crafted for effortless radiance.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#services"
                  className="font-sans-label text-[11px] font-semibold px-6 py-3 bg-[#252628] text-white hover:opacity-90 transition active:scale-95"
                >
                  Explore Menu
                </a>
                <button
                  onClick={() => handleOpenModal()}
                  type="button"
                  className="font-sans-label text-[11px] font-semibold px-6 py-3 border border-[#252628] text-[#252628] hover:bg-[#252628] hover:text-white transition active:scale-95"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <div className="overflow-hidden aspect-[16/10] bg-[#b5ae9d] relative shadow-sm">
              <Image
                src="/editorial/editorial_1.jpeg"
                alt="Editorial salon skincare and hair portrait"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="overflow-hidden aspect-[16/10] bg-[#b5ae9d] relative shadow-sm">
              <Image
                src="/editorial/editorial_2.jpeg"
                alt="Botanical hair treatment cream and oil"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: OUR SERVICES ── */}
      <section
        id="services"
        style={{ backgroundColor: "#c4beae" }}
        className="py-16 md:py-24 px-6 border-t border-[#252628]/15"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif-editorial text-4xl sm:text-5xl text-center text-[#252628] pb-5">
            Our Services
          </h2>
          <div className="hairline-dark mb-8" />

          {/* Interactive Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {[
              { label: "All Services", category: "all" },
              { label: "Haircare", category: "HAIRCARE" },
              { label: "Treatments", category: "TREATMENTS" },
              { label: "Skin & Face", category: "SKIN & FACE" },
              { label: "Signature Combos", category: "COMBOS" },
            ].map((btn) => (
              <button
                key={btn.category}
                type="button"
                onClick={() => setActiveCategory(btn.category)}
                className={`filter-btn ${
                  activeCategory === btn.category ? "active" : ""
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* 3-Column Editorial Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {displayedServices.map((s: ServiceItem) => (
              <article
                key={s.id}
                onClick={() => handleOpenModal(s.id)}
                className="service-card text-center cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden bg-[#b5ae9d] mb-4 relative shadow-xs">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-sans-label text-[11px] font-semibold text-[#252628] pb-2">
                  {s.category}
                </p>
                <div className="hairline-dark mb-3" />
                <h3 className="font-serif-editorial text-2xl text-[#252628] group-hover:opacity-85 transition">
                  {s.title}
                </h3>
                <p className="font-serif-editorial text-lg text-[#252628]/90 mt-1">
                  {s.price}
                </p>
                <span className="font-sans-label text-[9px] text-[#252628]/60 mt-1 inline-block uppercase tracking-wider">
                  {s.duration}
                </span>
              </article>
            ))}
          </div>

          <div className="hairline-dark mt-16" />
        </div>
      </section>

      {/* ── SECTION 3: THE PRODUCTS WE USE ── */}
      <section
        id="products"
        className="relative py-24 md:py-32 px-6 overflow-hidden bg-[#252628]"
      >
        <Image
          src="/editorial/editorial_3.jpeg"
          alt="Botanical meadow hair care backdrop"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#252628]/50 via-[#252628]/40 to-[#252628]/60" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <h2 className="font-serif-editorial text-4xl sm:text-5xl pb-5">
            The Products We Use
          </h2>
          <div className="hairline-light mb-14" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-white/85 flex items-center justify-center bg-black/15 shadow-sm">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21c0-6 4-10 9-11-1 5-4 9-9 11Zm0 0c0-5-3-8-7-9 1 4 3 7 7 9Z"
                  />
                </svg>
              </div>
              <span className="font-serif-editorial text-2xl">Organic</span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-white/85 flex items-center justify-center bg-black/15 shadow-sm">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 9c2-2 4-2 6 0s4 2 6 0 4-2 4 0M4 15c2-2 4-2 6 0s4 2 6 0 4-2 4 0"
                  />
                </svg>
              </div>
              <span className="font-serif-editorial text-2xl">Non-toxic</span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-white/85 flex items-center justify-center bg-black/15 shadow-sm">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20v-6m0 0c-3.5 0-6-2.2-6-5.2 0-2.5 2-4.8 6-5.8 4 1 6 3.3 6 5.8 0 3-2.5 5.2-6 5.2Z"
                  />
                </svg>
              </div>
              <span className="font-serif-editorial text-2xl">Eco-friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: OUR TEAM ── */}
      <section
        id="team"
        style={{ backgroundColor: "#252628" }}
        className="py-20 md:py-28 px-6 text-white border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif-editorial text-4xl sm:text-5xl text-center pb-5">
            Our Team
          </h2>
          <div className="hairline-light mb-14" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {EDITORIAL_TEAM.map((member, i) => (
              <article key={i}>
                <div className="aspect-square overflow-hidden bg-[#333437] mb-4 relative shadow-sm">
                  <Image
                    src={member.image}
                    alt={member.role}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif-editorial text-2xl text-white">
                  {member.name}
                </h3>
                <p className="font-sans-label text-[10px] font-semibold text-white/80 mt-1">
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CLIENT TESTIMONIALS ── */}
      <section
        id="testimonials"
        style={{ backgroundColor: "#ffffff" }}
        className="py-20 md:py-28 px-6 text-[#252628]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif-editorial text-4xl sm:text-5xl text-center text-[#252628] pb-5">
            Client Testimonials
          </h2>
          <div className="hairline-dark mb-14" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {EDITORIAL_TESTIMONIALS.map((item, i) => (
              <article key={i} className="testimonial-card flex flex-col shadow-sm">
                <div className="aspect-[16/9] overflow-hidden bg-[#ece9e1] relative">
                  <Image
                    src={item.image}
                    alt="Client testimonial portrait"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <p className="font-serif-editorial text-lg leading-[1.55] text-[#252628] mb-8">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="font-serif-editorial text-2xl text-[#252628]">
                    &mdash; {item.author}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: WE TAKE CARE OF OUR CLIENTS ── */}
      <section
        style={{ backgroundColor: "#c4beae" }}
        className="py-20 md:py-28 px-6 border-t border-[#252628]/15"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-stretch">
          <div className="md:col-span-6 overflow-hidden aspect-[4/3] bg-[#b5ae9d] relative shadow-sm">
            <Image
              src="/editorial/editorial_11.jpeg"
              alt="Warm salon client care"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="font-serif-editorial text-4xl sm:text-5xl leading-[1.08] text-[#252628] pb-6">
                We take care of our clients and our people.
              </h2>
              <div className="hairline-dark" />
            </div>
            
            <p className="font-serif-editorial text-xl sm:text-[21px] leading-[1.55] text-[#252628] pt-10">
              Every appointment begins with a quiet consultation. We pair
              dermatologist-tested clinical facials and ammonia-free formulations
              with unhurried craftsmanship—building a studio where both clients
              and stylists thrive.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CONTACT US ── */}
      <section
        id="contact"
        style={{ backgroundColor: "#252628" }}
        className="py-20 md:py-28 px-6 text-white border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif-editorial text-4xl sm:text-5xl pb-5">
            Contact Us
          </h2>
          <div className="hairline-light mb-16" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-14">
            <div>
              <h3 className="font-serif-editorial text-2xl font-semibold mb-2">
                Phone
              </h3>
              <p className="font-serif-editorial text-xl text-white/90">
                <a href={`tel:${businessConfig.phone}`} className="hover:underline">
                  {businessConfig.phone}
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-serif-editorial text-2xl font-semibold mb-2">
                Email
              </h3>
              <p className="font-serif-editorial text-xl text-white/90">
                <a href={`mailto:${businessConfig.email}`} className="hover:underline">
                  {businessConfig.email}
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-serif-editorial text-2xl font-semibold mb-2">
                Address
              </h3>
              <p className="font-serif-editorial text-xl text-white/90">
                {businessConfig.address.street}, {businessConfig.address.city}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            type="button"
            className="font-sans-label text-[11px] font-semibold px-8 py-3.5 border border-white/75 text-white hover:bg-white hover:text-[#252628] transition active:scale-95"
          >
            Schedule an Appointment
          </button>
        </div>
      </section>

      {/* ── SECTION 8: ACCESSIBILITY BANNER ── */}
      <section className="relative h-[420px] sm:h-[500px] overflow-hidden bg-[#c4beae]">
        <Image
          src="/editorial/editorial_12.jpeg"
          alt="Wooden comb through natural silver curls"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-8 px-6 text-center">
          <p className="font-sans-label text-[11px] sm:text-xs font-semibold text-white max-w-2xl mx-auto leading-relaxed tracking-widest">
            OUR SALON IS ACCESSIBLE FOR WHEELCHAIRS AND MOBILITY SCOOTERS, WITH
            RAMPS AND ELEVATORS FOR EASY NAVIGATION.
          </p>
        </div>
      </section>

      {/* ── FOOTER UTILITY STRIP ── */}
      <footer className="bg-[#1e1f20] text-white/50 py-6 px-6 text-xs text-center border-t border-white/5 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
        <p>© {new Date().getFullYear()} Naturals Unisex Salon Kottakkal. All rights reserved.</p>
        <div className="flex gap-6 uppercase font-sans-label text-[10px]">
          <Link href="/appointments" className="hover:text-white transition">
            Booking Engine
          </Link>
          <Link href="/account" className="hover:text-white transition">
            Client Portal
          </Link>
          <Link href="/admin/login" className="hover:text-white transition">
            Admin Login
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
        </div>
      </footer>

      {/* ── INTERACTIVE APPOINTMENT BOOKING MODAL ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-[#c4beae] text-[#252628] max-w-lg w-full border border-[#252628] p-7 sm:p-9 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              aria-label="Close modal"
              className="absolute top-5 right-5 text-[#252628] hover:opacity-65"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!bookingConfirmed ? (
              <>
                <h3 className="font-serif-editorial text-3xl pb-3">
                  Reserve Your Visit
                </h3>
                <div className="hairline-dark mb-6" />

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="book-service"
                      className="block font-sans-label text-[10px] font-semibold mb-1.5"
                    >
                      Selected Service
                    </label>
                    <select
                      id="book-service"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full bg-white/90 border border-[#252628]/60 px-3.5 py-2.5 font-serif-editorial text-lg focus:outline-none focus:border-[#252628]"
                    >
                      {EDITORIAL_SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="book-date"
                        className="block font-sans-label text-[10px] font-semibold mb-1.5"
                      >
                        Preferred Date
                      </label>
                      <input
                        id="book-date"
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-white/90 border border-[#252628]/60 px-3.5 py-2 font-serif-editorial text-lg focus:outline-none focus:border-[#252628]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book-time"
                        className="block font-sans-label text-[10px] font-semibold mb-1.5"
                      >
                        Time Slot
                      </label>
                      <select
                        id="book-time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-white/90 border border-[#252628]/60 px-3.5 py-2.5 font-serif-editorial text-lg focus:outline-none focus:border-[#252628]"
                      >
                        <option>10:30 AM</option>
                        <option>12:00 PM</option>
                        <option>02:30 PM</option>
                        <option>04:30 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="book-name"
                      className="block font-sans-label text-[10px] font-semibold mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="book-name"
                      type="text"
                      required
                      placeholder="Full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white/90 border border-[#252628]/60 px-3.5 py-2 font-serif-editorial text-lg focus:outline-none focus:border-[#252628]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="book-phone"
                      className="block font-sans-label text-[10px] font-semibold mb-1.5"
                    >
                      Phone / WhatsApp
                    </label>
                    <input
                      id="book-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white/90 border border-[#252628]/60 px-3.5 py-2 font-serif-editorial text-lg focus:outline-none focus:border-[#252628]"
                    />
                  </div>

                  <div className="text-sm font-serif-editorial italic text-[#46443f] pt-1">
                    Estimated duration: {selectedService.duration} • {selectedService.price}
                  </div>

                  <button
                    type="submit"
                    className="w-full font-sans-label text-[11px] font-semibold py-3.5 bg-[#252628] text-white hover:opacity-90 transition active:scale-95"
                  >
                    Confirm Reservation Request
                  </button>

                  <div className="text-center pt-2">
                    <Link
                      href={`/appointments?serviceId=${selectedServiceId}`}
                      className="text-xs font-sans-label text-[#252628] hover:underline"
                    >
                      Or open full live schedule picker →
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="font-serif-editorial text-3xl mb-2">
                  Reservation Request Noted
                </p>
                <div className="hairline-dark my-4" />
                <p className="font-serif-editorial text-lg text-[#46443f] mb-6">
                  {customerName}, your {selectedService.title} request for {selectedDate} at{" "}
                  {selectedTime} ({selectedService.price}) has been recorded.
                  Our Kottakkal desk will confirm via WhatsApp/SMS.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="font-sans-label text-[11px] font-semibold px-8 py-3 bg-[#252628] text-white hover:opacity-90"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
