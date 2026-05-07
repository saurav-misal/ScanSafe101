import React from 'react';

export default function PageDashboard() {
  return (
    <>
<div id="page-dashboard" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)', display: 'flex', gap: '5px', alignItems: 'center', maxWidth: '155px'}}><img src="/assets/features/database.png" alt="" style={{height: '20px', width: '20px'}} /> Live Insights</span>
      <h1>Survey Data Dashboard</h1>
      <p>Real-time charts and analytics from community survey responses.</p>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <div className="kpi-row">
        <div className="kpi-card"><div className="kpi-val" id="kpi-total">1,248</div><div className="kpi-label">Total Respondents</div></div>
        <div className="kpi-card"><div className="kpi-val">78%</div><div className="kpi-label">UPI Acceptance Rate</div></div>
        <div className="kpi-card"><div className="kpi-val">60%</div><div className="kpi-label">UPI Transaction Share</div></div>
        <div className="kpi-card"><div className="kpi-val">88.9%</div><div className="kpi-label">Youth UPI Adoption</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h4>UPI Payment Acceptance</h4><p className="subtitle">By shop owners</p><div className="chart-canvas-wrap"><canvas id="chart1"></canvas></div><ul className="summary-points mt-4"><li>78% of shopkeepers accept UPI, reflecting strong digital adoption.</li><li>22% do not accept UPI, suggesting resistance or infrastructure gaps.</li><li>Encouraging remaining shopkeepers could further increase cashless transactions.</li></ul></div>
        <div className="chart-card"><h4>UPI vs Cash Usage</h4><p className="subtitle">Across shops</p><div className="chart-canvas-wrap"><canvas id="chart2"></canvas></div><ul className="summary-points mt-4"><li>UPI accounts for 60% of transactions, making it the preferred method.</li><li>Cash still constitutes 40%, showing it remains significant.</li><li>Shops are in a transitional phase toward digital adoption.</li></ul></div>
        <div className="chart-card"><h4>Most Used UPI Apps</h4><p className="subtitle">By shop owners</p><div className="chart-canvas-wrap"><canvas id="chart3"></canvas></div><ul className="summary-points mt-4"><li>PhonePe and Paytm are most popular (26.1% each).</li><li>BHIM follows at 21.7%; Google Pay used by 17.4%.</li><li>Only 4.3% use other apps.</li></ul></div>
        <div className="chart-card"><h4>UPI Usage by Age Group</h4><p className="subtitle">Adoption across demographics</p><div className="chart-canvas-wrap"><canvas id="chart4"></canvas></div><ul className="summary-points mt-4"><li>88.9% of UPI users are aged 18–30, showing strong youth adoption.</li><li>Only 11.1% are aged 31–50.</li><li>No users above 51 observed — need for senior digital literacy.</li></ul></div>
        <div className="chart-card"><h4>Problems Faced in UPI Usage</h4><p className="subtitle">Common barriers reported by users</p><div className="chart-canvas-wrap"><canvas id="chart5"></canvas></div><ul className="summary-points mt-4"><li>Fraud/Security Concerns top the list at 30.8% — trust barriers remain.</li><li>Poor Network affects 23.1%, showing connectivity issues in rural areas.</li><li>App Errors (15.4%) and Lack of Digital Literacy (11.5%) impact adoption.</li><li>19.2% report no problems, indicating growing comfort with UPI.</li></ul></div>
        <div className="chart-card"><h4>Payment Preferences</h4><p className="subtitle">Shopkeepers' preferred mode</p><div className="chart-canvas-wrap"><canvas id="chart6"></canvas></div><ul className="summary-points mt-4"><li>60% of shopkeepers still prefer cash over digital payments.</li><li>Only 15% prefer UPI exclusively.</li><li>25% accept both — showing gradual flexibility toward digital.</li></ul></div>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
