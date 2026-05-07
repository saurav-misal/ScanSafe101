import React from 'react';

export default function PageSurvey() {
  return (
    <>
<div id="page-survey" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', maxWidth: '110px'}}><img src="/assets/wuikNav/survey.png" alt="" style={{height: '25px', width: '25px'}} /> Survey</span>
      <h1>UPI Usage Survey</h1>
      <p>Mobile Banking & UPI Usage in Rural/Semi-Urban Economy. All responses are confidential.</p>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <div className="survey-wrap">
        <div className="flex justify-between items-center" style={{marginBottom: '10px'}}>
          <span className="text-muted" id="survey-progress-label">Question 1 of 15</span>
          <span className="chip chip-green" id="survey-pct">7%</span>
        </div>
        <div className="survey-progress"><div className="survey-progress-fill" id="survey-fill" style={{width: '7%'}}></div></div>
        <div id="survey-questions"></div>
        <div className="survey-nav">
          <button className="btn btn-outline" id="survey-prev" onClick={() => window.surveyPrev()} style={{display: 'none'}}>← Previous</button>
          <button className="btn btn-primary" id="survey-next" onClick={() => window.surveyNext()}>Next →</button>
        </div>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
