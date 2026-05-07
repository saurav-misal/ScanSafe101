import React from 'react';

export default function Footer() {
  return (
    <>
<footer>
    <div className="footer-top">
      <div className="footer-brand">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
          <span style={{fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '20px', color: '#fff'}}>Scan<span style={{color: 'var(--info)'}}>Safe</span></span>
          <span style={{fontSize: '13px', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '20px', padding: '2px 10px'}}>Be Safe</span>
        </div>
        <p>Empowering rural & semi-urban India with digital payment literacy, fraud awareness, and community-driven financial inclusion.</p>
        <div className="footer-socials">
          <a href="#" title="YouTube"><img src="/assets/footer/icons8-youtube-50.png" alt="" /></a>
          <a href="#" title="Instagram"><img src="/assets/footer/icons8-instagram-50.png" alt="" /></a>
          <a href="#" title="Facebook"><img src="/assets/footer/icons8-facebook-50.png" alt="" /></a>
          <a href="#" title="Twitter"><img src="/assets/footer/icons8-twitter-50.png" alt="" /></a>
          <a href="#" title="Pinterest"><img src="/assets/footer/icons8-pinterest-50.png" alt="" /></a>
        </div>
      </div>
      <div className="footer-col">
        <h5>Platform</h5>
        <ul>
          <li><a href="#" onClick={() => window.navigate('programs')}>Awareness Programs</a></li>
          <li><a href="#" onClick={() => window.navigate('survey')}>UPI Survey</a></li>
          <li><a href="#" onClick={() => window.navigate('dashboard')}>Dashboard</a></li>
          <li><a href="#" onClick={() => window.navigate('learn')}>Learn UPI</a></li>
          <li><a href="#" onClick={() => window.navigate('quiz')}>Quiz & Certificate</a></li>
          <li><a href="#" onClick={() => window.navigate('community')}>Community</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h5>Resources</h5>
        <ul>
          <li><a href="https://www.rbi.org.in" target="_blank">Reserve Bank of India</a></li>
          <li><a href="https://www.npci.org.in" target="_blank">NPCI – UPI</a></li>
          <li><a href="#">Digital India Portal</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h5>Contact Us</h5>
        <div className="footer-contact-item">📞 +91 98765 43210</div>
        <div className="footer-contact-item">📞 +91 87654 32109</div>
        <div className="footer-contact-item">📞 +91 76543 21098</div>
        <div className="footer-contact-item" style={{marginTop: '10px'}}>✉️ <a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="ec8489808083ac9f8f8d829f8d8a89c28582">[email&#160;protected]</a></div>
        <div className="footer-contact-item">✉️ <a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="64171114140b1610241707050a170502014a0d0a">[email&#160;protected]</a></div>
        <div className="footer-contact-item">✉️ <a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="234a4d454c635040424d504245460d4a4d">[email&#160;protected]</a></div>
      </div>
    </div>
    
    <div style={{padding: '0 5% 40px'}}>
      <h3 style={{color: '#fff', marginBottom: '20px'}}>Frequently Asked Questions</h3>
      <div className="faq-item"><div className="faq-q" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><span>Is UPI safe for rural users?</span><span>+</span></div><div className="faq-a">Yes! UPI is regulated by NPCI and RBI. With proper knowledge about fraud prevention, UPI is very safe.</div></div>
      <div className="faq-item"><div className="faq-q" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><span>Do I need internet to use UPI?</span><span>+</span></div><div className="faq-a">Most UPI transactions require internet. However, *99# USSD banking works without internet for basic transactions.</div></div>
      <div className="faq-item"><div className="faq-q" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><span>How do I get the certificate?</span><span>+</span></div><div className="faq-a">Score 75% or more on our 20-question Fraud Awareness Quiz to get a downloadable PDF certificate.</div></div>
      <div className="faq-item"><div className="faq-q" onClick={(e) => window.toggleFaq && window.toggleFaq(e.currentTarget)}><span>Can I host my own awareness program?</span><span>+</span></div><div className="faq-a">Absolutely! Register or log in, go to Programs page, and fill out the "Host a Program" form.</div></div>
    </div>
    <div className="footer-bottom">
      <p>© 2024 ScanSafe. All rights reserved.</p>
      <div className="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Sitemap</a></div>
    </div>
  </footer>
    </>
  );
}
