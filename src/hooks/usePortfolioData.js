import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const defaultData = {
  hero: { tag: "Full Stack & C++ Developer", firstName: "JATIN", lastName: "DHIMAN" },
  about: { title: "CRAFTSMAN OF DIGITAL EXPERIENCES", description: "Passionate developer focused on building scalable web applications and high-performance algorithms." },
  services: [
    { title: "Web Development", description: "Building modern, responsive, and performance-focused web applications." },
    { title: "C++ & Algorithms", description: "Writing efficient, high-performance logic and data structures." },
    { title: "UI/UX & Frontend", description: "Crafting interactive, smooth, and visually appealing user interfaces." }
  ],
  projects: [
    { name: "Portfolio Website", type: "Web App", url: "https://github.com/JatinDhimanx", occurrence: "2024" }
  ],
  experience: [
    { year: "2024 - PRESENT", role: "Full Stack Developer", company: "Independent / Projects", occurrence: "Primary / Ongoing" }
  ],
  contact: { email: "forworkm9@gmail.com" }
};

export function usePortfolioData() {
  const [portfolioData, setPortfolioData] = useState(defaultData);
  const [underConstruction, setUnderConstruction] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('portfolio_data, under_construction')
          .single();

        if (data) {
          if (data.portfolio_data) setPortfolioData(data.portfolio_data);
          setUnderConstruction(!!data.under_construction);
        }
      } catch (err) {
        console.warn("Using default portfolio data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { portfolioData, underConstruction, loading };
}
