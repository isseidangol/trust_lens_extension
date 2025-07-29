import React, { useEffect, useState } from 'react';
import ResponseScreen from './ResponseScreen';
import 'antd/dist/reset.css';
import { Button, Typography, Spin, Steps } from 'antd';
import LoadingDots from './LoadingDots';
const { Step } = Steps;

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

//   const [response, setResponse] = useState({
//     "id": 7,
//     "site_name": "Amazon",
//     "product_name": null,
//     "categories": null,
//     "subcategories": null,
//     "product_details": "{\n  \"Color\": \"Gold\",\n  \"Size\": \"39mm\",\n  \"Magnification Strength\": \"2.0 x\"\n}",
//     "pros_cons": {
//         "pros": [
//             "Great product",
//             "Exactly as advertised",
//             "Arrived on time with no issues"
//         ],
//         "cons": []
//     },
//     "trust_score": 5,
//     "product_rating": 5,
//     "price": null,
//     "worth_buying": "Yes",
//     "created_at": "2025-07-29T05:01:45.573466+00:00Z",
//     "reviews": [
//         {
//             "id": 1,
//             "reviewer_name": "Kindle Customer",
//             "review_text": "Great Glasses! Great product. Exactly as advertised. Arrived on time with no issues.",
//             "is_verified": true
//         }
//     ]
// });

  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = scraping, 1 = analyzing
  const [error, setError] = useState('');


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
    setLoading(true)
    // setResponse(dummyResponse);
    setLoadingPhase('scraping');
    setCurrentStep(0);

    setTimeout(() => {
      setLoadingPhase('analyzing');
      setCurrentStep(1);
    }, 1000);
    chrome.runtime.sendMessage(
      { type: 'SCRAPE_PAGE', url },
      response => {
        setLoading(false);
        setLoadingPhase('');
        setCurrentStep(0);
        if (response.error) {
          console.error("response.error", response.error);
          setError(response.error)
        } else {
          console.log("response", response)
          setResponse(response);
          setError("")
        }
      }
    );
  };

  return (
    <div 
      style={{ width: 375,
        padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#1a73e8', fontSize: 24, marginBottom: 16 }}>TrustLens</h1>
      {loading ? (
        <div style={{ width: '100%', marginTop: 20 }}>
          <Steps current={currentStep} size="small" direction="vertical">
            <Step title="Scraping reviews" description={currentStep === 0 ? <LoadingDots /> : 'Done'} />
            <Step title="Analyzing reviews" description={currentStep === 1 ? <LoadingDots /> : (currentStep > 1 ? 'Done' : 'Pending')} />
          </Steps>

        </div>
      ) : !response ? (
        <>
        <Button type="primary" onClick={fetchReviews} style={{ padding: '10px 20px', fontSize: 16, borderRadius: 4 }}>
          Scrape Reviews
        </Button>
        {error && (
          <Typography.Text type="danger" style={{ marginTop: 16, display: 'block' }}>
            {error}
          </Typography.Text>
        )}
        </>
      ) : (
        <ResponseScreen data={{ ...response }} />
      )}
    </div>
  );
}