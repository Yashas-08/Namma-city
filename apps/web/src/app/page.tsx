'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  Play,
  Pause,
  Building2,
  HardHat,
  CheckCircle2,
  LogIn,
} from 'lucide-react';

export default function CinematicLandingPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Detect mobile device / viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      setIsMobile(mobileQuery.matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // MOBILE ONLY: Play video animation, then automatically transition to /login
  useEffect(() => {
    if (isMobile) {
      const mobileTimer = setTimeout(() => {
        router.push('/login');
      }, 3400);

      return () => clearTimeout(mobileTimer);
    }
  }, [isMobile, router]);

  // Desktop Get Started reveal after animation plays
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGetStarted(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setShowGetStarted(true);
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (videoRef.current && !reducedMotion) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Autoplay prevented by browser policy:', err);
          setIsPlaying(false);
        });
    }
  }, [reducedMotion]);

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // MOBILE VIEW: Only the video animation plays, and then automatically transitions to /login
  if (isMobile) {
    return (
      <div className="fixed inset-0 w-full h-[100dvh] bg-[#F4F6F5] flex flex-col justify-between overflow-hidden select-none z-50">
        {/* Full-screen pristine video animation */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => router.push('/login')}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>

        {/* Minimal top logo banner */}
        <div className="relative z-10 w-full p-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-xs">
            <Shield className="w-4 h-4 text-[#176B68]" />
            <span className="text-xs font-black text-[#172322] tracking-tight">Namma City</span>
            <span className="text-[10px] font-bold text-[#176B68]">ನಮ್ಮ ನಗರ</span>
          </div>

          <Link
            href="/login"
            className="pointer-events-auto px-3 py-1.5 rounded-full bg-[#176B68]/90 text-white text-[11px] font-bold shadow-md flex items-center gap-1 active:scale-95"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Bottom progress indicator transitioning to login */}
        <div className="relative z-10 w-full p-6 flex flex-col items-center pointer-events-none bg-gradient-to-t from-black/50 via-black/20 to-transparent">
          <div className="w-28 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#176B68] animate-pulse" />
          </div>
          <p className="text-[11px] text-white font-medium mt-2 drop-shadow-sm">
            Opening Civic Login...
          </p>
        </div>
      </div>
    );
  }

  // DESKTOP VIEW: Full rich cinematic landing page showcase
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-civic-text bg-[#F4F7F6]">
      {/* SUBTLE AMBIENT BACKDROP LIGHTING */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#176B68]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#125452]/10 blur-[100px]" />
      </div>

      {/* TOP CIVIC NAVIGATION HEADER */}
      <header className="relative z-30 w-full border-b border-civic-border/70 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-civic-primary text-white flex items-center justify-center shadow-md shadow-civic-primary/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-civic-text tracking-tight">
                  Namma City
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-civic-primary/10 text-civic-primary">
                  ನಮ್ಮ ನಗರ
                </span>
              </div>
              <p className="text-[11px] text-civic-text-muted font-medium hidden sm:block">
                Bengaluru Unified Civic Mesh
              </p>
            </div>
          </Link>

          {/* Role Gateway & Launch CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-civic-bg px-2 py-1 rounded-xl border border-civic-border text-xs">
              <Link
                href="/staff/dashboard"
                className="px-2.5 py-1 rounded-lg text-civic-text-muted hover:text-civic-text hover:bg-white font-semibold transition-colors flex items-center gap-1.5 text-xs"
              >
                <HardHat className="w-3.5 h-3.5 text-amber-600" />
                <span>Staff</span>
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-2.5 py-1 rounded-lg text-civic-text-muted hover:text-civic-text hover:bg-white font-semibold transition-colors flex items-center gap-1.5 text-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-civic-primary" />
                <span>Admin</span>
              </Link>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-civic-primary hover:bg-civic-primary-dark text-white font-bold text-xs sm:text-sm shadow-md shadow-civic-primary/20 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CINEMATIC HERO SECTION */}
      <main className="relative z-20 flex-1 flex items-center py-6 sm:py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* LEFT COLUMN: HERO NARRATIVE & CIVIC ACTIONS */}
          <div className="w-full lg:max-w-xl xl:max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Civic Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-civic-border shadow-xs text-xs font-semibold text-civic-primary mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Bengaluru Unified Civic Mesh • 198 Wards Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-civic-text tracking-tight leading-[1.15] mb-4">
              One City.{' '}
              <span className="text-civic-primary">One Platform.</span>
              <br />
              Multiple Services.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-civic-text-muted font-normal leading-relaxed max-w-xl mb-7">
              Empowering Bengaluru residents with seamless grievance redressal, smart utility bill payments, and real-time municipal tracking across BBMP, BESCOM, and BWSSB.
            </p>

            {/* Primary Action Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl bg-civic-primary hover:bg-civic-primary-dark text-white font-extrabold text-sm shadow-lg shadow-civic-primary/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/home"
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-civic-primary-light border border-civic-border text-civic-text font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore Citizen Portal</span>
              </Link>
            </div>

            {/* Role Gateways Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <Link
                href="/staff/dashboard"
                className="p-3.5 rounded-xl bg-white border border-civic-border hover:border-amber-400 hover:shadow-civic transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-civic-text flex items-center gap-1.5">
                    <span>Field Staff Portal</span>
                    <ArrowRight className="w-3 h-3 text-civic-text-muted group-hover:translate-x-0.5 transition-transform" />
                  </h2>
                  <p className="text-[11px] text-civic-text-muted mt-0.5">
                    Field resolution, triage & status updates
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/dashboard"
                className="p-3.5 rounded-xl bg-white border border-civic-border hover:border-civic-primary hover:shadow-civic transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-civic-primary-light text-civic-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-civic-text flex items-center gap-1.5">
                    <span>Ward Admin Console</span>
                    <ArrowRight className="w-3 h-3 text-civic-text-muted group-hover:translate-x-0.5 transition-transform" />
                  </h2>
                  <p className="text-[11px] text-civic-text-muted mt-0.5">
                    City-wide mesh dispatch & ward analytics
                  </p>
                </div>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-civic-text-muted font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Geo-Tagging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Automated AI Triage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>BBMP • BESCOM • BWSSB</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CINEMATIC VIDEO SHOWCASE (THE STAR ATTRACTION) */}
          <div className="w-full lg:w-auto flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Soft Ambient Aura behind video */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#176B68]/20 to-teal-500/20 rounded-[40px] blur-xl opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none" />

              {/* Showcase Frame with Pristine Unobstructed Video */}
              <div className="relative w-[310px] sm:w-[350px] xl:w-[380px] aspect-[9/16] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border-4 sm:border-[6px] border-[#1E2928] bg-[#F4F6F5]">
                {/* video.mp4 playing with full visibility */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/videos/landing-poster.jpg"
                  onLoadedData={() => setVideoLoaded(true)}
                  className="w-full h-full object-cover"
                >
                  <source src="/video.mp4" type="video/mp4" />
                  <source src="/videos/video.mp4" type="video/mp4" />
                </video>

                {/* Subtle top pill on video */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Showcase</span>
                  </div>
                  
                  {/* Subtle Play/Pause controller on video corner */}
                  <button
                    onClick={togglePlayback}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    title={isPlaying ? 'Pause video' : 'Play video'}
                    className="pointer-events-auto p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </div>

                {/* ANIMATED POP-UP "GET STARTED" BUTTON (TRIGGERS AFTER ANIMATION PLAYS) */}
                <div
                  className={`absolute bottom-6 inset-x-5 z-20 transition-all duration-700 ease-out transform ${
                    showGetStarted
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
                  }`}
                >
                  <Link
                    href="/login"
                    className="w-full py-4 px-6 rounded-2xl bg-[#176B68] hover:bg-[#125452] text-white font-black text-sm sm:text-base shadow-2xl shadow-black/60 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-98 border border-teal-300/40 group backdrop-blur-xs"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-30 w-full border-t border-civic-border/70 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-civic-text-muted">
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span>BBMP</span>
            <span>•</span>
            <span>BESCOM</span>
            <span>•</span>
            <span>BWSSB</span>
            <span>•</span>
            <span>Govt. of Karnataka</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/login" className="hover:text-civic-primary font-medium transition-colors">
              Sign In
            </Link>
            <span>•</span>
            <Link href="/home" className="hover:text-civic-primary font-medium transition-colors">
              Citizen Portal
            </Link>
            <span>•</span>
            <Link href="/staff/dashboard" className="hover:text-civic-primary font-medium transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <Link href="/admin/dashboard" className="hover:text-civic-primary font-medium transition-colors">
              Admin Console
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
