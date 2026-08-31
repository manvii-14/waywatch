import React, { useState, useEffect } from 'react';
import TripLogger from './components/TripLogger';
import WelcomeScreen from './components/WelcomeScreen';
import MagneticButton from './components/MagneticButton';
import axios from 'axios';

const PageGuide = ({ tab }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isClosed = sessionStorage.getItem('waywatch_page_guide_closed');
    if (!isClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('waywatch_page_guide_closed', 'true');
  };

  if (!isVisible) return null;

  const guides = {
    live: "Plot your baseline corridor, then trace a verification path to execute the turn-sequence anomaly engine.",
    history: "Review the secure audit trail of past telemetry logs, similarity scores, and flagged anomalies.",
    analytics: "Monitor aggregated system health, anomaly severity, and route reliability comparisons.",
    settings: "Fine-tune spatial tolerance, turn sensitivity, and establish rules for critical event alerts."
  };

  return (
    <div style={{ position: 'relative', background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--border)', padding: '20px 50px 20px 30px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <div style={{ background: 'var(--text-main)', color: 'var(--bg-main)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
        USER GUIDE
      </div>
      <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}>
        {guides[tab] || guides.live}
      </div>
      
      <button 
        onClick={handleClose} 
        style={{ position: 'absolute', top: '12px', right: '15px', background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '5px' }}
      >
        &times;
      </button>
    </div>
  );
};

const Footer = () => {
  return (
    <div style={{ 
      backgroundColor: '#FF3333',
      color: '#000000',
      padding: '60px 60px 20px 60px', 
      margin: '60px -60px -40px -60px', 
      borderTop: '1px solid var(--border)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr', gap: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
        <div style={{ width: '60px', height: '60px', border: '2px solid #000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', letterSpacing: '-1px' }}>
          WW
        </div>
        
        <div>
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>Navigation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Live Feed</span>
            <span>History Logs</span>
            <span>Analytics</span>
            <span>Settings</span>
          </div>
        </div>
        
        <div>
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>Engine Capabilities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Turn Sequence Matching</span>
            <span>Spatial Deviation</span>
            <span>U-Turn Detection</span>
            <span>Anomaly Scoring</span>
          </div>
        </div>
        
        <div>
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>WayWatch System</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>About the Tech</span>
            <span>API Documentation</span>
            <span>FAQ</span>
            <span>Contact Core Team</span>
          </div>
        </div>
        
        <div>
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>Socials</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>GitHub</span>
            <span>DevPost</span>
            <span>Twitter</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>

      <h1 style={{ 
        fontSize: '11.5vw', 
        margin: '60px 0 0 0', 
        lineHeight: '0.8', 
        letterSpacing: '-0.04em', 
        fontWeight: '900', 
        textTransform: 'uppercase',
        color: '#000'
      }}>
        Waywatching
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000', paddingTop: '10px', marginTop: '30px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
        <span>All rights reserved WayWatch Inc.</span>
        <span>Site by Hackathon Team</span>
      </div>
    </div>
  );
};

const History = ({ trips }) => {
  return (
    <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--border)', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: 'var(--text-main)', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Executed Trip Logs</h2>
      <p style={{ color: 'var(--text-sub)', marginBottom: '25px', fontSize: '0.95rem' }}>Comprehensive audit trail of historical route executions.</p>
      
      {trips.length === 0 ? <p style={{ color: 'var(--text-sub)' }}>No logs recorded yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {trips.map((trip, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>Trip #{trip.id || (trips.length - idx)} ({trip.base_route_name || 'Standard Route'})</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>Recorded: {trip.date || 'Today'}</div>
              </div>
              <div>
                <span style={{ padding: '6px 14px', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', background: trip.status === 'ANOMALY' ? 'var(--btn-bg)' : 'var(--bg-card)', color: trip.status === 'ANOMALY' ? 'var(--btn-text)' : 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                  {trip.status || 'NORMAL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Analytics = ({ trips }) => {
  const [tripsVal, setTripsVal] = useState('00');
  const [anomalyVal, setAnomalyVal] = useState('0.0%');
  const [similarityVal, setSimilarityVal] = useState('00.0%');

  // Core Math
  const total = trips.length > 0 ? trips.length : 18; // Fallback to 18 for demo empty state
  const anomalies = trips.length > 0 ? trips.filter(t => t.status === 'ANOMALY').length : 2;
  const normalCount = total - anomalies;
  const targetAnomalyRate = ((anomalies / total) * 100).toFixed(1);
  const targetSim = trips.length > 0 ? (trips.reduce((acc, t) => acc + (parseFloat(t.similarity) || 0), 0) / trips.length).toFixed(1) : '94.6';
  const reliability = ((normalCount / total) * 100).toFixed(1);

  // Split calculations for Reliability Breakdown
  const minorDev = (anomalies > 0 ? ((anomalies * 0.5) / total) * 100 : 5.6).toFixed(1);
  const majorDev = (anomalies > 0 ? ((anomalies * 0.5) / total) * 100 : 5.5).toFixed(1);

  // Compare Logic (Gets latest 2 trips)
  const t1 = trips[0] || { id: '018', date: 'Aug 31, 19:42', similarity: 91 };
  const t2 = trips[1] || { id: '017', date: 'Aug 30, 19:38', similarity: 63 };

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setTripsVal(Math.floor(Math.random() * 89 + 10));
      setAnomalyVal((Math.random() * 20).toFixed(1) + '%');
      setSimilarityVal((Math.random() * 30 + 70).toFixed(1) + '%');
      iteration++;
      if (iteration > 12) {
        clearInterval(interval);
        setTripsVal(total.toString());
        setAnomalyVal(targetAnomalyRate + '%');
        setSimilarityVal(targetSim + '%');
      }
    }, 70);
    return () => clearInterval(interval);
  }, [total, targetAnomalyRate, targetSim]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--border)', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      
      <div>
        <h2 style={{ color: 'var(--text-main)', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Analytics / Route Intelligence</h2>
        <p style={{ color: 'var(--text-sub)', margin: 0, fontSize: '0.95rem' }}>Aggregated intelligence metrics across active delivery vectors.</p>
      </div>

      {/* 3 Core Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
        <div style={{ background: 'var(--bg-main)', padding: '30px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>TOTAL TRIPS</div>
          <div style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: '900', marginTop: '10px', fontFamily: 'monospace' }}>{tripsVal}</div>
        </div>
        <div style={{ background: 'var(--bg-main)', padding: '30px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ANOMALY RATE</div>
          <div style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: '900', marginTop: '10px', fontFamily: 'monospace' }}>{anomalyVal}</div>
        </div>
        <div style={{ background: 'var(--bg-main)', padding: '30px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>AVG SIMILARITY</div>
          <div style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: '900', marginTop: '10px', fontFamily: 'monospace' }}>{similarityVal}</div>
        </div>
      </div>

      {/* Grid: Severity & Reliability */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Anomaly Severity Distribution */}
        <div style={{ background: 'var(--bg-main)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px', color: 'var(--text-main)' }}>ANOMALY SEVERITY DISTRIBUTION</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { label: 'LOW', count: anomalies > 0 ? Math.max(1, Math.floor(anomalies * 0.53)) : 8, color: 'var(--text-main)' },
              { label: 'MEDIUM', count: anomalies > 0 ? Math.max(1, Math.floor(anomalies * 0.26)) : 4, color: '#f57c00' },
              { label: 'HIGH', count: anomalies > 0 ? Math.max(1, Math.floor(anomalies * 0.13)) : 2, color: 'var(--accent-red)' },
              { label: 'CRITICAL', count: anomalies > 0 ? Math.max(1, Math.floor(anomalies * 0.08)) : 1, color: '#8b0000' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '80px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-sub)', letterSpacing: '0.5px' }}>{item.label}</div>
                <div style={{ flex: 1, background: 'var(--border-light)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(item.count / 15) * 100}%`, background: item.color, height: '100%', borderRadius: '4px' }} />
                </div>
                <div style={{ width: '20px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'monospace' }}>{item.count}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.7rem', color: 'var(--text-sub)', fontStyle: 'italic', cursor: 'pointer' }}>Click a category to filter history logs.</div>
        </div>

        {/* Route Reliability */}
        <div style={{ background: 'var(--bg-main)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px', color: 'var(--text-main)' }}>ROUTE RELIABILITY</h3>
          
          <div style={{ display: 'flex', alignItems: 'end', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1', fontFamily: 'monospace', letterSpacing: '-2px' }}>{reliability}%</span>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-sub)', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <span><strong style={{ color: 'var(--text-main)' }}>{total}</strong> trips analyzed</span>
            <span>•</span>
            <span><strong style={{ color: 'var(--text-main)' }}>{normalCount}</strong> normal</span>
            <span>•</span>
            <span><strong style={{ color: 'var(--accent-red)' }}>{anomalies}</strong> anomalous</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
              <span>NORMAL TRIPS</span> <span style={{ fontFamily: 'monospace' }}>{reliability}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f57c00' }}>
              <span>MINOR DEVIATIONS</span> <span style={{ fontFamily: 'monospace' }}>{minorDev}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-red)' }}>
              <span>MAJOR ANOMALIES</span> <span style={{ fontFamily: 'monospace' }}>{majorDev}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Compare Trips Module */}
      <div style={{ background: 'var(--bg-main)', padding: '35px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h3 style={{ margin: '0 0 25px 0', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px', color: 'var(--text-main)', textAlign: 'center' }}>COMPARE TRIPS</h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
          
          <div style={{ textAlign: 'center', background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)', width: '200px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Trip #{t1.id}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-sub)', marginTop: '5px' }}>{t1.date}</div>
          </div>

          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-sub)', fontStyle: 'italic' }}>VS</div>

          <div style={{ textAlign: 'center', background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)', width: '200px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Trip #{t2.id}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-sub)', marginTop: '5px' }}>{t2.date}</div>
          </div>

        </div>
      </div>

    </div>
  );
};

const Settings = () => {
  const [detSensitivity, setDetSensitivity] = useState(50);
  const [turnSensitivity, setTurnSensitivity] = useState(70);
  const [anomalyThreshold, setAnomalyThreshold] = useState(70);
  const [routeProfile, setRouteProfile] = useState('DAILY COMMUTE');
  const [saved, setSaved] = useState(false);
  
  const [turnRules, setTurnRules] = useState({ unexpected: true, uturn: true, missing: true, extra: false });
  const [alertRules, setAlertRules] = useState({ major: true, uturn: true, extended: true, minor: false, changed: true });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getSensitivityLabel = (val) => {
    if (val < 30) return 'LENIENT';
    if (val < 70) return 'BALANCED';
    return 'AGGRESSIVE';
  };

  return (
    <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid var(--border)', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-main)', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>System Engine Configuration</h2>
        <p style={{ color: 'var(--text-sub)', margin: 0, fontSize: '0.95rem' }}>Fine-tune core anomaly detection thresholds, routing profiles, and alert severity logic.</p>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'var(--bg-main)', padding: '25px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '15px', color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Target Route Profile</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['DAILY COMMUTE', 'SCHOOL / CAMPUS', 'DELIVERY ROUTE', 'FLEET ROUTE', 'HIGH-SECURITY ROUTE'].map(profile => (
                <label key={profile} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  <input type="radio" name="routeProfile" checked={routeProfile === profile} onChange={() => setRouteProfile(profile)} style={{ cursor: 'pointer' }} />
                  {profile}
                </label>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '25px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <label style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Detection Sensitivity</label>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-red)' }}>{getSensitivityLabel(detSensitivity)}</span>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem', marginTop: 0, marginBottom: '15px' }}>Controls how aggressively WayWatch flags shape deviations.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: '700' }}>
              <span>LOW</span>
              <input type="range" min="0" max="100" value={detSensitivity} onChange={(e) => setDetSensitivity(e.target.value)} className="custom-slider" />
              <span>HIGH</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '25px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <label style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Turn Sequence Detection</label>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-red)' }}>{getSensitivityLabel(turnSensitivity)}</span>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem', marginTop: 0, marginBottom: '15px' }}>Influences how strongly unexpected turns affect anomaly scoring.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '20px' }}>
              <span>LOW</span>
              <input type="range" min="0" max="100" value={turnSensitivity} onChange={(e) => setTurnSensitivity(e.target.value)} className="custom-slider" />
              <span>HIGH</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.keys(turnRules).map(rule => (
                <label key={rule} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                  <input type="checkbox" checked={turnRules[rule]} onChange={() => setTurnRules({...turnRules, [rule]: !turnRules[rule]})} />
                  {rule.replace('uturn', 'U-Turns').charAt(0).toUpperCase() + rule.slice(1).replace('uturn', '')}
                </label>
              ))}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'var(--bg-main)', padding: '25px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <label style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Anomaly Threshold</label>
              <span style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent-red)', fontFamily: 'monospace' }}>{anomalyThreshold}</span>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem', marginTop: 0, marginBottom: '25px' }}>Trips scoring above {anomalyThreshold} will be heavily flagged for manual review.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '15px' }}>
              <input type="range" min="0" max="100" value={anomalyThreshold} onChange={(e) => setAnomalyThreshold(e.target.value)} className="custom-slider" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: anomalyThreshold <= 40 ? 'var(--border-light)' : 'transparent', borderRadius: '4px' }}>
                <span>NORMAL</span> <span style={{ fontFamily: 'monospace' }}>0 ──────── 40</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: anomalyThreshold > 40 && anomalyThreshold <= 70 ? 'var(--border-light)' : 'transparent', borderRadius: '4px' }}>
                <span style={{ color: '#f57c00' }}>WARNING</span> <span style={{ fontFamily: 'monospace' }}>41 ─────── 70</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: anomalyThreshold > 70 ? 'var(--accent-red-bg)' : 'transparent', borderRadius: '4px' }}>
                <span style={{ color: 'var(--accent-red)' }}>ANOMALY</span> <span style={{ fontFamily: 'monospace' }}>71 ────── 100</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '25px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '15px', color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Event Alert Rules</label>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem', marginTop: 0, marginBottom: '15px' }}>Trigger notifications based on specific severe telemetry events.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={alertRules.major} onChange={() => setAlertRules({...alertRules, major: !alertRules.major})} /> Major shape deviation</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={alertRules.uturn} onChange={() => setAlertRules({...alertRules, uturn: !alertRules.uturn})} /> Unexpected U-turn detected</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={alertRules.extended} onChange={() => setAlertRules({...alertRules, extended: !alertRules.extended})} /> Extended deviation (distance)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={alertRules.minor} onChange={() => setAlertRules({...alertRules, minor: !alertRules.minor})} /> Minor threshold slip</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}><input type="checkbox" checked={alertRules.changed} onChange={() => setAlertRules({...alertRules, changed: !alertRules.changed})} /> Route completely abandoned</label>
            </div>
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.8rem', textTransform: 'uppercase' }}>SEVERITY LEVEL</label>
              <select style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '6px 12px', outline: 'none', fontWeight: '700', fontSize: '0.75rem', borderRadius: '4px' }}>
                <option>MINOR</option>
                <option>WARNING</option>
                <option>CRITICAL</option>
              </select>
            </div>
          </div>

          <MagneticButton type="submit" style={{ padding: '20px', background: 'var(--btn-bg)', color: 'var(--btn-text)', border: 'none', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px', borderRadius: '8px', fontSize: '0.9rem' }}>
            {saved ? 'CONFIGURATION SAVED' : 'COMMIT ENGINE CONFIGURATION'}
          </MagneticButton>

        </div>
      </form>
    </div>
  );
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/trips/')
      .then(res => setTrips(res.data))
      .catch(err => {
        setTrips([
          { id: 1042, base_route_name: 'Daily Commute', status: 'NORMAL', similarity: '91', date: 'Aug 31, 2026' },
          { id: 1041, base_route_name: 'Highway Route A', status: 'ANOMALY', similarity: '63', date: 'Aug 30, 2026' }
        ]);
      });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleMouseMove = (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  };

  const handleNewTripAnalysis = (result, routeId) => {
    const newTrip = {
      id: Math.floor(Math.random() * 9000) + 1000,
      base_route_name: routeId,
      status: result.is_anomaly ? 'ANOMALY' : 'NORMAL',
      similarity: result.confidence || (100 - (result.anomaly_score || 0)),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setTrips(prev => [newTrip, ...prev]);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'live': return <TripLogger onAnalysisComplete={handleNewTripAnalysis} />;
      case 'history': return <History trips={trips} />;
      case 'analytics': return <Analytics trips={trips} />;
      case 'settings': return <Settings />;
      default: return <TripLogger onAnalysisComplete={handleNewTripAnalysis} />;
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg-main: #E5E5E5;
          --bg-card: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(235, 235, 235, 0.85) 100%);
          --text-main: #111111;
          --text-sub: #666666;
          --border: #111111;
          --border-light: #cccccc;
          --btn-bg: #111111;
          --btn-hover: #555555;
          --btn-text: #FFFFFF;
          --accent-red: #b71c1c;
          --accent-red-bg: #FFF5F5;
          --nav-bg: rgba(255, 255, 255, 0.85);
          --map-filter: none;
          --blend-mode: multiply;
          --topo-line: rgba(17, 17, 17, 0.06);
          --cursor-glow: rgba(183, 28, 28, 0.6);
        }
        [data-theme='dark'] {
          --bg-main: #1E1E1E;
          --bg-card: linear-gradient(145deg, rgba(80, 20, 20, 0.25) 0%, rgba(45, 45, 45, 0.5) 50%, rgba(35, 35, 35, 0.9) 100%);
          --text-main: #F4F4F0;
          --text-sub: #999999;
          --border: #444444;
          --border-light: #333333;
          --btn-bg: #F4F4F0;
          --btn-hover: #cccccc;
          --btn-text: #111111;
          --accent-red: #ff5252;
          --accent-red-bg: #2a0808;
          --nav-bg: rgba(30, 30, 30, 0.85);
          --map-filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          --blend-mode: screen;
          --topo-line: rgba(244, 244, 240, 0.05);
          --cursor-glow: rgba(255, 82, 82, 0.35);
        }
        
        * { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewport='0 0 10 10'><rect width='10' height='10' fill='%23111111'/></svg>"), auto !important; }
        button, a, input, select, textarea { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewport='0 0 10 10'><rect width='10' height='10' fill='%23111111'/></svg>"), pointer !important; }

        [data-theme='dark'] * { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewport='0 0 10 10'><rect width='10' height='10' fill='%23F4F4F0'/></svg>"), auto !important; }
        [data-theme='dark'] button, [data-theme='dark'] a, [data-theme='dark'] input, [data-theme='dark'] select, [data-theme='dark'] textarea { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewport='0 0 10 10'><rect width='10' height='10' fill='%23F4F4F0'/></svg>"), pointer !important; }
        
        button { transition: background-color 0.2s ease, transform 0.1s ease !important; }
        button:hover { background-color: var(--btn-hover) !important; }

        .leaflet-container { filter: var(--map-filter); transition: filter 0.4s ease; }

        .topo-bg {
          position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
          background-image: 
            repeating-radial-gradient(circle at 15% 25%, transparent 0, transparent 40px, var(--topo-line) 40px, var(--topo-line) 41.5px),
            repeating-radial-gradient(circle at 85% 75%, transparent 0, transparent 55px, var(--topo-line) 55px, var(--topo-line) 56px),
            repeating-radial-gradient(circle at 50% 120%, transparent 0, transparent 70px, var(--topo-line) 70px, var(--topo-line) 71.5px);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 0; pointer-events: none;
        }

        .sensor-glow {
          position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
          background: radial-gradient(circle 250px at var(--mouse-x, -500px) var(--mouse-y, -500px), var(--cursor-glow) 0%, transparent 70%);
          mix-blend-mode: var(--blend-mode); z-index: 1; pointer-events: none; transition: background 0.1s ease-out;
        }

        .custom-slider { -webkit-appearance: none; width: 100%; background: transparent; }
        .custom-slider::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: var(--text-main); cursor: pointer; margin-top: -6px; }
        .custom-slider::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: var(--border-light); border-radius: 2px; }
        input[type="checkbox"], input[type="radio"] { accent-color: var(--text-main); width: 16px; height: 16px; }
      `}</style>

      <div style={{ position: 'fixed', top: '25px', right: '35px', zIndex: 9999 }}>
        <MagneticButton 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ 
            background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)', 
            padding: '8px 20px', borderRadius: '30px', fontWeight: '900', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer'
          }}
        >
          {isDarkMode ? '☼ LIGHT' : '☾ DARK'}
        </MagneticButton>
      </div>

      {showWelcome && (
        <WelcomeScreen onEnterDashboard={() => setShowWelcome(false)} />
      )}

      <div 
        onMouseMove={handleMouseMove}
        style={{ 
          position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh', 
          backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden',
          transition: 'background-color 0.4s ease, color 0.4s ease'
        }}
      >
        <div className="topo-bg" />
        <div className="sensor-glow" />

        <div 
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--border)',
            padding: '10px 30px', display: 'flex', alignItems: 'center', gap: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)', zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', maxHeight: '55px', overflow: 'hidden', borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('live')}>
            <span style={{ color: 'var(--text-main)', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>WAYWATCH</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isNavHovered ? 1 : 0.85, transition: 'opacity 0.2s ease' }}>
            {['live', 'history', 'analytics', 'settings'].map(id => (
              <div 
                key={id} onClick={() => setActiveTab(id)}
                style={{
                  backgroundColor: activeTab === id ? 'var(--text-main)' : 'transparent',
                  color: activeTab === id ? 'var(--bg-main)' : 'var(--text-sub)',
                  padding: '8px 16px', fontWeight: activeTab === id ? '700' : '500', cursor: 'pointer',
                  fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease', borderRadius: '4px'
                }}
              >
                {id}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: '100px 60px 0px 60px', display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'thin', zIndex: 2 }}>
          
          <PageGuide tab={activeTab} />

          <div style={{ flex: '1 0 auto', minHeight: '85vh' }}>
            {renderContent()}
          </div>

          <Footer />

        </div>
      </div>
    </>
  );
}