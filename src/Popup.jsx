import React, { useEffect, useState } from 'react';
import ResponseScreen from './ResponseScreen';
import { Button, Typography } from 'antd';
import 'antd/dist/reset.css';

/* global chrome */

const dummyResponse = {
  site_name: "amazon.com",
  product_name: "Example Product",
  custom_rating: {
    trust_lens_score: 73,
    score_out_of: 100
  },
  reviews: [
    { author: "Alice", text: "Excellent build quality!", rating: 5 },
    { author: "Bob", text: "Battery life is okay.", rating: 3 },
    { author: "Carol", text: "Stopped working after a week.", rating: 1 },
    { author: "Dan", text: "Love the display and performance.", rating: 4 },
    { author: "Eve", text: "Disappointing customer service.", rating: 2 }
  ],
  pros: ["Great build", "Fast performance", "Nice display"],
  cons: ["Short battery", "Poor support", "Breaks easily"]
};

export default function Popup() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(()=>{
    chrome.tabs.query({active:true, currentWindow: true},
      (tabs) => {
        const current = tabs[0];
        if( current && current.url){
          setUrl(current.url);
        }
      }
    )
  },[])

  const fetchReviews = async () => {
    console.log('url',url)
    setResponse(dummyResponse);
    // chrome.runtime.sendMessage(
    //   { type: 'SCRAPE_PAGE', url },
    //   response => {
    //     if (response.error) {
    //       console.error(response.error);
    //     } else {
    //       console.log("response")
    //       setResponse(response);
    //     }
    //   }
    // );
  };

  return (
    <div 
      style={{ width: 375,
        padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#1a73e8', fontSize: 24, marginBottom: 16 }}>TrustLens</h1>
      {!response ? (
        <Button type="primary" onClick={fetchReviews} style={{ padding: '10px 20px', fontSize: 16, borderRadius: 4 }}>
          Scrape Reviews
        </Button>
      ) : null}
      {response ? (
        <ResponseScreen data={{ ...response }} />
      ) : (
        <p style={{ color: '#666', fontSize: 14 }}>No review data found.</p>
      )}
    </div>
  );
}