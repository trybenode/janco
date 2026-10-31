"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Renders the public JANCO landing page, service information, pricing, and waitlist entry points.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/app/about/page.tsx, web/app/book/page.tsx, web/app/janitor/register/page.tsx, web/app/login/page.tsx, web/app/room-scan/page.tsx, web/components/MotionVacuum.tsx, web/components/WaitlistModal.tsx, web/lib/api.ts; 4 more in docs/file-inventory.md.
 * Imported or linked from: web/app/page.tsx.
 */


import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ChevronDown, Clock3, Droplets, Home, Menu, Ruler, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { MotionVacuum } from "@/components/MotionVacuum";
import { WaitlistModal } from "@/components/WaitlistModal";
import { api } from "@/lib/api";
import { money } from "@/lib/catalog";
import type { Service } from "@/lib/types";

type ModalType = "customer" | "janitor" | null;
type FaqCategory = "General" | "Account & security" | "Features";
type Faq = { category: FaqCategory; question: string; answer: string };

const fallbackService = (id: string, name: string, description: string, priceFrom: number, color: string): Service => ({
  id, name, description, priceFrom, duration: "About 3 hours", inclusions: ["Detail-led surface clean", "Floors and high-touch areas"], exclusions: ["Hazardous materials"], recommendedSupplies: ["Fresh towels", "Surface-safe products"], extras: [{ key: "window_cleaning", label: "Windows", pricing_mode: "flat", price: 0, available: false }, { key: "carpet_cleaning", label: "Carpets", pricing_mode: "flat", price: 0, available: false }], color,
});

const howItWorks = [
  { number: "01", icon: Ruler, title: "Count your spaces", description: "Tell us how many rooms, toilets, kitchens, or laundry items need attention." },
  { number: "02", icon: Sparkles, title: "Get your price", description: "JANCO calculates a transparent estimate using your service details, extras, measurement, and transport." },
  { number: "03", icon: ShieldCheck, title: "Book a janitor", description: "Choose an eligible professional or let intelligent dispatch match you fairly." },
];

const faqCategories: FaqCategory[] = ["General", "Account & security", "Features"];
const faqs: Faq[] = [
  { category: "General", question: "Do I need to provide cleaning supplies?", answer: "You can tell us what you have during booking. Your quote will explain recommended supplies and any service-specific requirements." },
  { category: "General", question: "Where does JANCO currently offer services?", answer: "Availability depends on your location and our verified janitor network. Join the waitlist or enter your address in booking to check your area." },
  { category: "General", question: "Can I cancel or reschedule my booking?", answer: "Yes. Your booking details show the cancellation and rescheduling window before you confirm." },
  { category: "General", question: "Are JANCO professionals verified?", answer: "JANCO uses identity verification, service eligibility checks, ratings, and TrustScore signals to support safer matching." },
  { category: "General", question: "Can I book for someone else?", answer: "Yes. Add the service address and access instructions for the person you are booking for." },
  { category: "General", question: "What happens if my janitor is delayed?", answer: "Your active booking timeline and support entry point will show the latest status. Contact support from the job screen if the arrival window changes." },
  { category: "Account & security", question: "What happens if my payment fails?", answer: "Your booking remains recoverable. Use the payment retry link in your confirmation or contact support; duplicate charges are guarded against." },
  { category: "Account & security", question: "How does JANCO protect my address and personal information?", answer: "We limit access by role and booking ownership, use secure sessions, validate inputs, and avoid placing private booking data in public pages or caches." },
  { category: "Account & security", question: "How do I update my profile or address?", answer: "Open Profile from the customer portal, update your details, and save. Booking addresses are confirmed separately so each job remains accurate." },
  { category: "Account & security", question: "How do notification preferences work?", answer: "You can choose which booking, assignment, status, chat, payment, and reminder notifications you receive from your notification settings." },
  { category: "Account & security", question: "What should I do if I forget my password?", answer: "Use Forgot password on the login screen. We will send a time-limited reset link to your account email." },
  { category: "Account & security", question: "What can I do when I am offline?", answer: "Previously loaded profile, service, booking history, and active-job information remains available. Payment and new booking creation wait until you reconnect." },
  { category: "Features", question: "How are prices calculated?", answer: "Prices combine your selected service, spaces, extras, measurement, duration, worker count, transport, and any applicable discount. The server calculates the final quote." },
  { category: "Features", question: "Can I use room scan?", answer: "Yes. Live room scan is available in supported browsers, with manual measurement as a fallback when camera access is unavailable." },
  { category: "Features", question: "Can I chat with my assigned janitor?", answer: "Yes. Active bookings include authorized chat and a status timeline, with HTTP fallback when live updates are unavailable." },
  { category: "Features", question: "Can I schedule recurring cleaning?", answer: "Yes. Choose a supported weekly, biweekly, or monthly schedule during booking and manage the series from your portal." },
  { category: "Features", question: "Can I rebook a completed service?", answer: "Yes. Completed bookings include a rebook shortcut that carries forward the service details for review." },
  { category: "Features", question: "How does JANCO match me with a janitor?", answer: "Matching considers eligibility, availability, distance, skills, trust signals, workload fairness, and your selected preference when available." },
];

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".landing-reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { nodes.forEach((node) => node.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function InstallButton() {
  const [fallback, setFallback] = useState(false);
  useEffect(() => { const unavailable = () => setFallback(true); window.addEventListener("janco:install-unavailable", unavailable); return () => window.removeEventListener("janco:install-unavailable", unavailable); }, []);
  const requestInstall = () => {
    setFallback(false);
    window.dispatchEvent(new CustomEvent("janco:request-install"));
  };
  return <><button className="landing-button landing-button-primary" onClick={requestInstall}>Download App <ArrowRight size={15}/></button>{fallback && <div className="install-hint" role="status">Use your browser menu and choose “Add to Home Screen” or “Install JANCO”.</div>}</>;
}

export function LandingPage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqCategory, setFaqCategory] = useState<FaqCategory>("General");
  const [faqOpen, setFaqOpen] = useState<string | null>(faqs[0].question);
  const [faqVisibleCount, setFaqVisibleCount] = useState(5);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(["Living room", "Bedroom"]);
  useReveal();

  useEffect(() => { let mounted = true; void api.services().then((result) => { if (mounted && result.data) setServices(result.data); }); return () => { mounted = false; }; }, []);

  const visibleServices = useMemo(() => {
    const order = ["house_cleaning", "deep_cleaning", "laundry", "post_construction", "move_in_cleaning"];
    return order.map((id) => services.find((service) => service.id === id)).filter(Boolean) as Service[];
  }, [services]);
  const serviceCards = visibleServices.length ? visibleServices : [
    fallbackService("house_cleaning", "Standard cleaning", "A dependable reset for bedrooms, bathrooms, kitchen, and living areas.", 5000, "#d5ef75"),
    fallbackService("deep_cleaning", "Deep cleaning", "A more thorough clean for homes that need extra attention and detail.", 12000, "#c9d8fa"),
    fallbackService("laundry", "Laundry & ironing", "Keep clothes moving with convenient laundry or ironing support.", 3500, "#e5d8fa"),
    fallbackService("post_construction", "Post-construction cleaning", "Clear dust, debris, and finishing mess after building or renovation work.", 18000, "#d5ef75"),
    fallbackService("move_in_cleaning", "Move-in cleaning", "Start fresh in a new space with a detailed top-to-bottom clean.", 22000, "#f7c3a8"),
  ];

  const toggleRoom = (room: string) => setSelectedRooms((current) => current.includes(room) ? current.filter((item) => item !== room) : [...current, room]);
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const filteredFaqs = faqs.filter((faq) => faq.category === faqCategory);
  const displayedFaqs = filteredFaqs.slice(0, faqVisibleCount);
  const setFaqFilter = (category: FaqCategory) => { setFaqCategory(category); setFaqVisibleCount(5); setFaqOpen(null); };

  return <div className="landing-page">
    <MotionVacuum />
    <header className="landing-header">
      <nav className="landing-nav landing-container" aria-label="Main navigation">
        <a className="landing-brand" href="#top" aria-label="JANCO home"><Image src="/logo.png" alt="JANCO" width={94} height={42} priority /></a>
        <div className={`landing-nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("top")}>Home</button><button onClick={() => scrollTo("solutions")}>Services</button><button onClick={() => scrollTo("pricing-structure")}>Pricing structure</button>
          <Link href="/login">Log in</Link><InstallButton />
        </div>
        <button className="landing-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
      </nav>
    </header>

    <main id="top">
      <section className="landing-hero">
        <Image className="landing-hero-image" src="/janco-housekeeping-hero.png" alt="JANCO professional cleaning a bright living room" fill priority sizes="100vw" />
        <div className="landing-hero-overlay" />
        <div className="landing-container landing-hero-content">
          <div className="landing-reveal hero-copy"><div className="landing-eyebrow">ON-DEMAND HOUSEKEEPING</div><h1>Less chores.<br/><span>More time for what matters.</span></h1><p>Get your space cleaned without the hassle. Tell us about your space, see your price upfront, and book a verified JANCO professional near you—from your phone or browser.</p><div className="landing-hero-actions"><button className="landing-button landing-button-primary" onClick={() => setModal("customer")}>Join the waitlist <ArrowRight size={16}/></button><button className="landing-button landing-button-outline" onClick={() => setModal("janitor")}>Become a Janitor</button></div><div className="hero-proof"><ShieldCheck size={15}/> Verified professionals · Transparent estimates · Support when you need it</div></div>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true"><span/> Scroll to explore</div>
      </section>

      <section className="landing-section how-section landing-container landing-reveal" id="how-it-works"><div className="section-kicker">HOW IT WORKS</div><h2>Getting a cleaner space is just a few steps away.</h2><p className="section-intro">From your first room count to your final rating, JANCO keeps every step clear.</p><div className="how-grid">{howItWorks.map(({ number, icon: Icon, title, description }, index) => <div className="how-step" key={number}><div className="how-node"><Icon size={19}/><span>{number}</span></div>{index < 2 && <div className="how-line"/>}<div className="how-copy"><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>

      <section className="solutions-wrap" id="solutions"><div className="landing-container landing-section landing-reveal"><div className="solutions-heading"><div><div className="section-kicker">SERVICES</div><h2>Our solutions.<br/><span>Tailored for you.</span></h2></div><div><p className="section-intro">Whatever your space needs, our trusted professionals are ready to handle the cleaning so you don’t have to.</p><button className="text-link" onClick={() => setModal("customer")}>Join the waitlist <ArrowRight size={14}/></button></div></div><div className="service-card-grid">{serviceCards.map((service, index) => <article className="landing-service-card" key={service.id} style={{ "--service-color": service.color } as React.CSSProperties}><div className="service-card-icon">{index === 2 ? <Droplets size={21}/> : index === 3 ? <Zap size={21}/> : index === 4 ? <Home size={21}/> : <Sparkles size={21}/>}</div><div className="service-card-top"><h3>{service.name}</h3><span className="service-price">From {money(service.priceFrom)}</span></div><p>{service.description}</p><div className="service-card-meta"><span><Clock3 size={13}/> {service.duration.replace("About ", "")}</span><span><Check size={13}/> {service.inclusions[0]}</span></div><Link href={`/book?service=${encodeURIComponent(service.id)}`} className="text-link">Book this service <ArrowRight size={14}/></Link></article>)}</div></div></section>

      <section className="landing-section pricing-section landing-container landing-reveal" id="pricing-structure"><div className="section-kicker">PRICING</div><h2>Our pricing structure.</h2><p className="section-intro">Simple, transparent pricing designed to help you understand exactly what you’re paying for, with no surprises along the way.</p><div className="pricing-grid"><div className="pricing-panel selection-panel"><div className="panel-label">SELECT YOUR SPACES</div><p className="small muted">Choose the spaces you want cleaned</p><div className="space-options">{["Living room", "Bedroom", "Kitchen", "Bathroom", "Laundry"].map((room) => <button key={room} className={`space-option ${selectedRooms.includes(room) ? "selected" : ""}`} onClick={() => toggleRoom(room)}><span className="space-radio"/>{room}<span className="space-amount">—</span></button>)}</div><div className="selection-summary"><span>{selectedRooms.length} spaces selected</span><strong>Server quote</strong></div><Link className="landing-button landing-button-primary full-button" href="/book">Book now <ArrowRight size={15}/></Link></div><div className="pricing-panel measurement-panel"><div className="panel-label">LIVE ROOM SCAN <span className="live-pill"><span/> AVAILABLE</span></div><h3>Measure your space with more confidence.</h3><p>Use the live room scan for an assisted estimate, or enter your own measurement. JANCO’s pricing engine explains area, clutter, duration, worker count, and transport fees before you pay.</p><div className="measurement-list"><div><Check size={14}/> Area and clutter-based pricing</div><div><Check size={14}/> Quote expiry shown before confirmation</div><div><Check size={14}/> Paystack payment recovery if needed</div></div><Link href="/room-scan" className="text-link">Try live room scan <ArrowRight size={14}/></Link></div></div></section>

      <section className="waitlist-band"><div className="landing-container waitlist-layout landing-reveal"><div className="waitlist-pitch"><div className="section-kicker">EARLY ACCESS</div><h2>Ready to get<br/><span>more time back?</span></h2><p>Join the JANCO waitlist and be among the first to know when services open in your area.</p><div className="waitlist-perks"><span><Check size={14}/> Early launch updates</span><span><Check size={14}/> Transparent pricing</span><span><Check size={14}/> Verified professionals</span></div></div><div className="waitlist-card"><div className="section-kicker">JOIN THE WAITLIST</div><h3>Get first access to JANCO.</h3><p>Sign up now for early notification when we launch near you.</p><button className="landing-button landing-button-primary full-button" onClick={() => setModal("customer")}>Join the waitlist <ArrowRight size={15}/></button><div className="waitlist-divider"><span/> or <span/></div><button className="plain-action" onClick={() => setModal("janitor")}>Want to earn with JANCO? <strong>Join the clean team</strong> <ArrowRight size={14}/></button></div></div></section>

      <section className="faq-section landing-section landing-container landing-reveal" id="faq"><div className="faq-heading"><div className="section-kicker">FAQ</div><h2>Frequently asked<br/><span>questions.</span></h2><p>Not sure what to expect? Find answers to some of the most common questions about our cleaning services, bookings, and everything in between.</p><div className="faq-categories" role="group" aria-label="FAQ categories">{faqCategories.map((category) => <button key={category} className={faqCategory === category ? "active" : ""} type="button" aria-pressed={faqCategory === category} aria-controls="faq-list" onClick={() => setFaqFilter(category)}>{category}</button>)}</div></div><div className="faq-content"><p className="sr-only" aria-live="polite">{faqCategory} FAQs, showing {displayedFaqs.length} of {filteredFaqs.length} questions.</p><div className="faq-list" id="faq-list">{displayedFaqs.map((faq, index) => { const answerId = `faq-answer-${faqCategory.toLowerCase().replace(/[^a-z]+/g, "-")}-${index}`; return <div className={`faq-item ${faqOpen === faq.question ? "open" : ""}`} key={faq.question}><button type="button" onClick={() => setFaqOpen(faqOpen === faq.question ? null : faq.question)} aria-expanded={faqOpen === faq.question} aria-controls={answerId}><span>{faq.question}</span><ChevronDown size={18}/></button><div id={answerId} className="faq-answer"><p>{faq.answer}</p></div></div>; })}</div>{filteredFaqs.length > 5 && <button type="button" className="faq-more" onClick={() => setFaqVisibleCount(faqVisibleCount >= filteredFaqs.length ? 5 : filteredFaqs.length)}>{faqVisibleCount >= filteredFaqs.length ? "Show less" : "Show more"}<ChevronDown size={16} className={faqVisibleCount >= filteredFaqs.length ? "rotated" : ""}/></button>}</div></section>
    </main>

    <footer className="landing-footer"><div className="landing-container footer-grid"><div className="footer-brand"><Image src="/logo.png" alt="JANCO" width={94} height={42}/><p>JANCO connects you with trusted cleaning professionals to make keeping your space clean simple.</p></div><div><h3>Important links</h3><a href="#top">Home</a><a href="#solutions">Services</a><a href="#pricing-structure">Pricing structure</a><Link href="/janitor/register">Become a janitor</Link></div><div><h3>Services</h3>{serviceCards.slice(0, 4).map((service) => <Link key={service.id} href={`/book?service=${service.id}`}>{service.name}</Link>)}</div><div><h3>Contact us</h3><a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@janco.app"}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@janco.app"}</a><span>{process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "Support available in app"}</span><Link href="/about">Trust &amp; safety</Link></div></div><div className="footer-bottom landing-container">Copyright © 2026 JANCO. All rights reserved.</div></footer>
    {modal && <WaitlistModal type={modal} onClose={() => setModal(null)}/>} 
  </div>;
}
