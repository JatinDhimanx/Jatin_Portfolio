import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Process from '../components/Process';
import Experience from '../components/Experience';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import MaintenanceOverlay from '../components/MaintenanceOverlay';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const { portfolioData, underConstruction, loading } = usePortfolioData();

  useScrollReveal([loading, portfolioData]);

  useEffect(() => {
    async function verifyMagicLink() {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        try {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          if (accessToken) {
            window.history.replaceState(null, null, window.location.pathname);
            const { data: { user } } = await supabase.auth.getUser(accessToken);
            if (user && user.email) {
              await supabase
                .from('messages')
                .update({ is_verified: true })
                .eq('email', user.email)
                .eq('is_verified', false);
              alert('Awesome! Your email is verified and your message has been confirmed.');
            }
          }
        } catch (err) {
          console.error('Verification error:', err);
        }
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user?.email) {
          await supabase
            .from('messages')
            .update({ is_verified: true })
            .eq('email', session.user.email)
            .eq('is_verified', false);
        }
      });
    }

    verifyMagicLink();
  }, []);

  if (underConstruction) {
    return <MaintenanceOverlay />;
  }

  return (
    <>
      <Navbar />
      <Hero heroData={portfolioData.hero} />
      <About aboutData={portfolioData.about} />
      <Services servicesData={portfolioData.services} />
      <Projects projectsData={portfolioData.projects} />
      <Process />
      <Experience experienceData={portfolioData.experience} />
      <Testimonials />
      <Contact />
      <Footer contactEmail={portfolioData.contact?.email} />
    </>
  );
}
