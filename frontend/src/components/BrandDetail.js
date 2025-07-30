import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadBrandData();
  }, [id]);

  const loadBrandData = async () => {
    try {
      // Load brand info and responses
      const [brandResponse, responsesResponse] = await Promise.all([
        axios.get(`/brands`), // We'll filter by ID on frontend for simplicity
        axios.get(`/responses/brand/${id}`)
      ]);

      // Find the specific brand
      const brandData = brandResponse.data.find(b => b.id === parseInt(id));
      setBrand(brandData);
      setResponses(responsesResponse.data);
    } catch (error) {
      console.error('Error loading brand data:', error);
      alert('Failed to load brand data');
    } finally {
      setLoading(false);
    }
  };

  const generateResponse = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(`/responses/generate/${id}`);
      
      // Add new response to the list
      setResponses([{
        ...response.data,
        rating: null,
        rating_id: null
      }, ...responses]);
    } catch (error) {
      console.error('Error generating response:', error);
      alert('Failed to generate response');
    } finally {
      setGenerating(false);
    }
  };

  const rateResponse = async (responseId, rating) => {
    try {
      const response = await axios.post(`/responses/${responseId}/rate`, { rating });
      
      // Update the response in our list
      setResponses(responses.map(r => 
        r.id === responseId 
          ? { ...r, rating: response.data.rating, rating_id: response.data.id }
          : r
      ));
    } catch (error) {
      console.error('Error rating response:', error);
      alert('Failed to rate response');
    }
  };

  if (loading) {
    return <div className="loading">Loading brand details...</div>;
  }

  if (!brand) {
    return (
      <div className="error-page">
        <h2>Brand not found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="brand-detail">
      {/* Header */}
      <header className="brand-detail-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <div className="brand-info">
            <h1>{brand.name}</h1>
            {brand.prompt && <p className="brand-prompt">{brand.prompt}</p>}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="brand-detail-main">
        <div className="section-header">
          <h2>AI Responses</h2>
          <button 
            onClick={generateResponse} 
            disabled={generating}
            className="generate-btn"
          >
            {generating ? 'Generating...' : '🤖 Generate Response'}
          </button>
        </div>

        {/* Responses list */}
        <div className="responses-list">
          {responses.length === 0 ? (
            <div className="empty-state">
              <p>No responses yet. Generate your first AI response!</p>
            </div>
          ) : (
            responses.map(response => (
              <div key={response.id} className="response-card">
                <div className="response-content">
                  <p>{response.response_text}</p>
                </div>
                
                <div className="response-footer">
                  <div className="response-meta">
                    <small>{new Date(response.created_at).toLocaleString()}</small>
                  </div>
                  
                  <div className="response-rating">
                    <button 
                      onClick={() => rateResponse(response.id, true)}
                      className={`rating-btn ${response.rating === true ? 'active positive' : ''}`}
                    >
                      👍
                    </button>
                    <button 
                      onClick={() => rateResponse(response.id, false)}
                      className={`rating-btn ${response.rating === false ? 'active negative' : ''}`}
                    >
                      👎
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default BrandDetail;