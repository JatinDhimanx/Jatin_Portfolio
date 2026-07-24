import React, { useState, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ text: '', color: '' });
  const [submitting, setSubmitting] = useState(false);
  const lastSubmitTime = useRef(0);

  const SUBMIT_COOLDOWN = 30000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
      const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
      setStatus({ text: `Please wait ${remaining}s before sending again.`, color: '#f59e0b' });
      return;
    }

    setSubmitting(true);
    setStatus({ text: '', color: '' });

    try {
      const { name, email, message } = formData;

      const { error: insertError } = await supabase
        .from('messages')
        .insert([{ name, email, message, is_verified: false }]);

      if (insertError) throw insertError;

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
        },
      });

      if (authError) throw authError;

      lastSubmitTime.current = Date.now();
      setStatus({
        text: 'Verification link sent to your email! Please check your inbox and click the link to confirm your message.',
        color: '#4ade80',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        text: 'Message failed to send. Please check your email address and try again.',
        color: '#f87171',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-dark" id="contact">
      <div className="section-inner contact-grid">
        <div className="contact-info">
          <h2 className="reveal">
            LET'S<br />BUILD.
          </h2>
          <p className="reveal reveal-delay-1">
            Got a web project in mind or need a strong partner for your next hackathon?
            Drop your details below and let's turn it into reality.
          </p>
        </div>

        <form id="contactForm" className="contact-form reveal reveal-delay-2" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">Your Name</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="message">What are we building?</label>
          </div>

          <button type="submit" id="submitBtn" className="btn-submit hover-target" disabled={submitting}>
            {submitting ? 'Sending link...' : 'Send Message'}
          </button>

          {status.text && (
            <p id="formStatus" style={{ marginTop: '15px', fontWeight: 'bold', color: status.color }}>
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
