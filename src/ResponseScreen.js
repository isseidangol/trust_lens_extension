import React, { useEffect, useState } from 'react';
import { Tabs, Tag, List, Typography } from 'antd';
import { Gauge } from '@ant-design/plots';

const { Title, Text } = Typography;

const sentimentColors = {
  positive: '#4CAF50',
  neutral: '#FFC107',
  negative: '#F44336'
};

const ResponseScreen = ({ data }) => {
    const {
        site_name,
        product_name,
        custom_rating,
        reviews,
        pros,
        cons
    } = data;

    const sentimentCounts = {
        positive: reviews.filter(r => r.rating >= 4).length,
        neutral: reviews.filter(r => r.rating === 3).length,
        negative: reviews.filter(r => r.rating <= 2).length
    };

    const trustScore = custom_rating && custom_rating.trust_lens_score && custom_rating.score_out_of
        ? Math.round((custom_rating.trust_lens_score / custom_rating.score_out_of) * 100)
        : 73; // fallback

    const gaugeConfig = {
        autoFit: true,
        data: {
            target: trustScore,
            total: 100,
            name: 'score',
            thresholds: [33.33, 66.66, 100],
        },
        scale: {
            color: {
                range: ['#F4664A', '#FAAD14', 'green'],
            },
        },
        style: {
            textContent: (target, total) => `${target}`,
            textFill: trustScore >= 66 ? 'green' : trustScore >= 33 ? '#FAAD14' : '#F4664A',
            textFontSize: 24,
            textfontWeight: 300,
            textX: '50%',
            textY: '75%',
            pointerStroke: trustScore >= 66 ? 'green' : trustScore >= 33 ? '#FAAD14' : '#F4664A',
            pointershadowColor: '#333333',
            pointershadowBlur: 10,
            pointershadowOffsetX: 5,
            pointershadowOffsetY: 5,
            pinStroke: trustScore >= 66 ? 'green' : trustScore >= 33 ? '#FAAD14' : '#F4664A',
            pinFill: trustScore >= 66 ? 'green' : trustScore >= 33 ? '#FAAD14' : '#F4664A',
            pinlinewidth: 6,
            pinshadowColor: '#333333',
            pinshadowBlur: 30,
        },
    };


    const [showGauge, setShowGauge] = useState(false);

    useEffect(() => {
        // Give it time to mount after tabs layout
        const timeout = setTimeout(() => {
            setShowGauge(true);
        }, 100); // Delay rendering Gauge slightly

        return () => clearTimeout(timeout);
        }, []);

    return(
        <div>
            <Tabs defaultActiveKey="summary" centered>
            <Tabs.TabPane tab="Summary" key="summary">
                <div style={{ padding: 4}}>
                    <div>
                        <Title level={5}>Overall Trust score</Title>
                        <div style={{ width: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {showGauge ? <Gauge {...gaugeConfig} /> : <div>Loading Gauge...</div>}
                        </div>
                    </div>

                    <div>
                        <Title level={5}>Sentiment Summary</Title>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Tag color={sentimentColors.positive}>😊 {sentimentCounts.positive} Positive</Tag>
                        <Tag color={sentimentColors.neutral}>😐 {sentimentCounts.neutral} Neutral</Tag>
                        <Tag color={sentimentColors.negative}>☹️ {sentimentCounts.negative} Negative</Tag>
                        </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <Title level={5}>Key Pros</Title>
                        {pros.map((p, i) => (
                        <Tag key={i} color="green">+ {p}</Tag>
                        ))}
                        <Title level={5} style={{ marginTop: 12 }}>Key Cons</Title>
                        {cons.map((c, i) => (
                        <Tag key={i} color="red">− {c}</Tag>
                        ))}
                    </div>
                </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Details" key="details">
                <List
                itemLayout="vertical"
                dataSource={reviews}
                style={{ padding: 4 }}
                renderItem={(item) => (
                    <List.Item>
                    <Text strong>{item.author}</Text>: <Text>{item.text}</Text> <Tag color="blue">⭐ {item.rating}</Tag>
                    </List.Item>
                )}
                />
            </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default ResponseScreen;
