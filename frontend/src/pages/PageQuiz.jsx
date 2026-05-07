import React from 'react';

export default function PageQuiz() {
  return (
    <>
<div id="page-quiz" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)'}}>🧠 Certification</span>
      <h1>Fraud Awareness Quiz</h1>
      <p>Score 75% or above to earn your UPI Safety Certificate.</p>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <div id="quiz-start-screen" className="text-center" style={{maxWidth: '560px', margin: '0 auto'}}>
        <div style={{fontSize: '64px', marginBottom: '18px'}}><img src="/assets/features/quiz.png" alt="" style={{height: '110px'}} /></div>
        <h2>UPI Fraud Awareness Quiz</h2>
        <p style={{margin: '14px 0 28px', fontSize: '16px'}}>20 questions · 75% passing score · Instant certificate download</p>
        <div className="badge-row">
          <div style={{display: 'flex', alignItems: 'center', gap: '7px'}}><div className="badge-dot red"></div><span style={{fontSize: '13px', color: 'var(--text-muted)'}}>Not Attempted</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: '7px'}}><div className="badge-dot yellow"></div><span style={{fontSize: '13px', color: 'var(--text-muted)'}}>Attempted</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: '7px'}}><div className="badge-dot green"></div><span style={{fontSize: '13px', color: 'var(--text-muted)'}}>Certified</span></div>
        </div>
        <button className="btn btn-primary btn-lg" style={{marginTop: '28px'}} onClick={() => window.startQuiz()}>Start Quiz →</button>
      </div>
      <div id="quiz-active" style={{display: 'none'}}>
        <div className="quiz-progress"><div className="quiz-progress-fill" id="quiz-prog-fill" style={{width: '5%'}}></div></div>
        <div className="quiz-q-wrap">
          <div className="quiz-q-num" id="quiz-q-num">Question 1 of 20</div>
          <div className="quiz-q-text" id="quiz-q-text"></div>
          <div className="quiz-options" id="quiz-options"></div>
          <div className="quiz-nav"><button className="btn btn-primary" id="quiz-next-btn" onClick={() => window.quizNext()} style={{display: 'none'}}>Next →</button></div>
        </div>
      </div>
      <div id="quiz-result" style={{display: 'none'}}>
        <div style={{textAlign: 'center', maxWidth: '580px', margin: '0 auto'}}>
          <div id="cert-pass" style={{display: 'none'}}>
            <h2 style={{color: 'var(--primary)', marginBottom: '8px'}}>🎉 Congratulations!</h2>
            <p style={{fontSize: '16px', marginBottom: '22px'}}>You passed with <strong id="cert-score"></strong>. You are now UPI Fraud Aware!</p>
            <div className="cert-box">
              <p style={{fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Certificate of Completion</p>
              <h2 style={{marginTop: '10px'}}>UPI Fraud Awareness</h2>
              <p style={{fontSize: '13px', color: 'var(--text-muted)', margin: '7px 0'}}>This is to certify that</p>
              <div className="cert-name" id="cert-name">Your Name</div>
              <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>has successfully completed the UPI Fraud Awareness Quiz with a score of <strong id="cert-score2" style={{color: 'var(--primary)'}}></strong></p>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '14px', borderTop: '1px dashed var(--primary)'}}>
                <div style={{textAlign: 'left'}}><p style={{fontSize: '11px', color: 'var(--text-muted)'}}>Date</p><p style={{fontSize: '13px', fontWeight: '600'}} id="cert-date"></p></div>
                <div><p style={{fontSize: '11px', color: 'var(--text-muted)'}}>Issued by</p><p style={{fontSize: '13px', fontWeight: '600', color: 'var(--primary)'}}>ScanSafe</p></div>
                <div style={{textAlign: 'right'}}><p style={{fontSize: '11px', color: 'var(--text-muted)'}}>Badge</p><div className="badge-dot green" style={{width: '16px', height: '16px', marginLeft: 'auto'}}></div></div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => window.showToast('Certificate PDF downloading...')}>⬇ Download Certificate</button>
          </div>
          <div id="cert-fail" style={{display: 'none'}}>
            <div style={{fontSize: '56px', marginBottom: '14px'}}>😔</div>
            <h2>Keep Practicing!</h2>
            <p style={{fontSize: '16px', margin: '14px 0 28px'}}>You scored <strong id="fail-score" style={{color: 'var(--error)'}}></strong>. You need 75% to pass.</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <button className="btn btn-outline" onClick={() => window.navigate('learn')}>📚 Review Learn Section</button>
              <button className="btn btn-primary" onClick={() => window.startQuiz()}>🔄 Try Again</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
