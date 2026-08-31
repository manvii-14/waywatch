import React, { useState, useEffect } from 'react';
import { saveBaseRoute, logTrip } from '../api';
import MapPicker from './MapPicker';
import MagneticButton from './MagneticButton';

export default function TripLogger({ onAnalysisComplete }) {
  const [step, setStep] = useState(1);
  const [routeId, setRouteId] = useState('');
  const [baselinePoints, setBaselinePoints] = useState([]);
  const [verifyPoints, setVerifyPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  
  // First-time visitor tooltip state
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check session storage so it only shows once per session
    const hasSeenGuide = sessionStorage.getItem('waywatch_live_guide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  const handleDismissGuide = () => {
    setShowGuide(false);
    sessionStorage.setItem('waywatch_live_guide', 'true');
  };

  const handleSaveBaseline = async (e) => {
    e.preventDefault();
    if (!routeId.trim()) return alert('Please enter a route ID.');
    if (baselinePoints.length < 2) return alert('Click at least 2 points on the map for the baseline path.');

    try {
      await saveBaseRoute({ route_id: routeId, points: baselinePoints });
      setStatusMsg('Baseline path successfully locked.');
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Error saving baseline path to server.');
    }
  };

  const handleAnalyzeTrip = async (e) => {
    e.preventDefault();
    if (verifyPoints.length < 2) return alert('Click at least 2 points on the map for the verification path.');

    try {
      const response = await logTrip({ route_id: routeId, trip_points: verifyPoints });
      setResult(response.data);
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data, routeId);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to analyze verification path.');
    }
  };

  const resetAll = () => {
    setStep(1);
    setRouteId('');
    setBaselinePoints([]);
    setVerifyPoints([]);
    setResult(null);
    setStatusMsg('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '24px 35px', border: '1px solid var(--border)', borderRadius: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Live Telemetry Feed {routeId ? `— [${routeId}]` : ''}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            {step === 1 ? 'Step 1: Define Baseline Route' : 'Step 2: Verify Trip Trajectory'}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1b3b2b', display: 'inline-block' }}></span>
            SYSTEM ONLINE
          </div>
          {step === 2 && (
            <MagneticButton 
              onClick={resetAll}
              style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}
            >
              RESET SESSION
            </MagneticButton>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1.5fr 1fr' : '1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Main Map Box */}
        <div style={{ position: 'relative', background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '30px', border: '1px solid var(--border)', borderRadius: '16px' }}>
          
          {/* 🌟 FLOATING ONBOARDING GUIDE 🌟 */}
          {showGuide && step === 1 && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '45px',
              zIndex: 9999,
              background: 'var(--bg-card)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              border: '1px solid var(--accent-red)',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              maxWidth: '320px',
              animation: 'tooltipDrop 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--accent-red)', letterSpacing: '1px' }}>SYSTEM INSTRUCTION</span>
                <button onClick={handleDismissGuide} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>&times;</button>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: '600' }}>
                You must select and lock your original baseline path <strong>first</strong>. Only then can you proceed to trace the verification path to run the anomaly engine.
              </p>
              <MagneticButton 
                onClick={handleDismissGuide} 
                style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'var(--accent-red)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px', cursor: 'pointer' }}
              >
                UNDERSTOOD
              </MagneticButton>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSaveBaseline} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>ROUTE IDENTIFIER (ROUTE_ID)</label>
                <input
                  type="text"
                  placeholder="e.g., morning_commute"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-light)', outline: 'none', fontWeight: '600' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>CLICK MAP TO PLOT EXPECTED BASELINE</label>
                <MapPicker points={baselinePoints} setPoints={setBaselinePoints} isInteractive={true} />
              </div>

              <MagneticButton
                type="submit"
                style={{ padding: '16px', cursor: 'pointer', backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)', border: 'none', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}
              >
                LOCK BASELINE & PROCEED TO VERIFY →
              </MagneticButton>
            </form>
          ) : (
            <form onSubmit={handleAnalyzeTrip} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {statusMsg && <div style={{ padding: '12px', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', fontWeight: '700', fontSize: '0.85rem' }}>{statusMsg}</div>}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>TRACE VERIFICATION PATH (OVERLAID ON BASELINE)</label>
                <MapPicker 
                  points={verifyPoints} 
                  setPoints={setVerifyPoints} 
                  baselinePoints={baselinePoints} 
                  flaggedSegments={result?.flagged_segments || []}
                  isInteractive={true} 
                />
              </div>

              <MagneticButton
                type="submit"
                style={{ padding: '16px', cursor: 'pointer', backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)', border: 'none', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}
              >
                EXECUTE ANOMALY EVALUATION
              </MagneticButton>
            </form>
          )}
        </div>

        {/* Explainable Anomaly Panel */}
        {result && (
          <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '30px', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ padding: '20px', background: result.is_anomaly ? 'var(--accent-red-bg)' : 'var(--bg-main)', border: `1px solid ${result.is_anomaly ? 'var(--accent-red)' : 'var(--border)'}`, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-sub)', letterSpacing: '1px', marginBottom: '5px' }}>EVALUATION STATUS</div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '900', color: result.is_anomaly ? 'var(--accent-red)' : 'var(--text-main)', textTransform: 'uppercase' }}>
                {result.is_anomaly ? '⚠️ ANOMALY DETECTED' : '✓ ROUTE VERIFIED NORMAL'}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                <span style={{color: 'var(--text-main)'}}>SCORE: {result.anomaly_score}</span>
                <span style={{color: 'var(--text-main)'}}>CONFIDENCE: {result.confidence}%</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-sub)', letterSpacing: '1px', marginBottom: '10px', textTransform: 'uppercase' }}>Diagnostic Analysis</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {result.reasons?.map((reason, idx) => (
                  <li key={idx} style={{ marginBottom: '6px', fontWeight: '600' }}>{reason}</li>
                )) || <li>Trajectory matches standard spatial distribution.</li>}
              </ul>
            </div>

            {(result.turns_expected || result.turns_observed) && (
              <div style={{ background: 'var(--bg-main)', padding: '20px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-sub)', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Turn Sequence Check</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-sub)', marginBottom: '4px' }}>EXPECTED</div>
                    <div style={{ fontFamily: 'monospace', background: 'var(--bg-card)', color: 'var(--text-main)', padding: '8px', border: '1px solid var(--border-light)' }}>
                      {result.turns_expected?.join(' → ') || 'None'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-sub)', marginBottom: '4px' }}>OBSERVED</div>
                    <div style={{ fontFamily: 'monospace', background: 'var(--bg-card)', color: 'var(--text-main)', padding: '8px', border: '1px solid var(--border-light)' }}>
                      {result.turns_observed?.join(' → ') || 'None'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <MagneticButton 
              onClick={() => setResult(null)}
              style={{ padding: '12px', background: 'var(--btn-bg)', color: 'var(--btn-text)', border: 'none', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Clear Analysis
            </MagneticButton>
          </div>
        )}

      </div>
    </div>
  );
}