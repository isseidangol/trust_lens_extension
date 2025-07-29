import React, { useEffect, useState, useMemo} from 'react';
import { Tabs, Tag, List, Typography } from 'antd';
import { Gauge } from '@ant-design/plots';

const { Title, Text } = Typography;

const sentimentColors = {
  positive: '#4CAF50',
  neutral: '#FFC107',
  negative: '#F44336'
};

const ResponseScreen = ({ data }) => {
    const [showGauge, setShowGauge] = useState(false);

    useEffect(() => {
        // Give it time to mount after tabs layout
        const timeout = setTimeout(() => {
            setShowGauge(true);
        }, 100); // Delay rendering Gauge slightly

        return () => clearTimeout(timeout);
        }, []);

    const sentimentCounts = useMemo(() => {
        if (!Array.isArray(data?.reviews)) {
        return { positive: 0, neutral: 0, negative: 0 };
        }
        return data.reviews.reduce(
        (acc, r) => {
            const rating = r.rating || 3;
            if (rating >= 4) acc.positive++;
            else if (rating === 3) acc.neutral++;
            else acc.negative++;
            return acc;
        },
        { positive: 0, neutral: 0, negative: 0 }
        );
    }, [data?.reviews]);

    const trustScore = typeof data.trust_score === 'number' ? (data.trust_score * 10) : 0;
    const maxTrustScore = 100;
    const gaugePercentage = Math.round((trustScore / maxTrustScore) * 100);
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

      // --- Pros & Cons ---
    const pros = Array.isArray(data.pros_cons?.pros) ? data.pros_cons.pros : [];
    const cons = Array.isArray(data.pros_cons?.cons) ? data.pros_cons.cons : [];

      // --- Worth Buying ---
    const worthBuying = data.worth_buying ? (
        <Tag color={data.worth_buying.toLowerCase() === 'yes' ? 'green' : 'red'}>
        {data.worth_buying}
        </Tag>
    ) : null;

    const isValidData = data && typeof data === 'object';

    if (!isValidData) {
        return (
            <div style={{ padding: 16, textAlign: 'center' }}>
            <Typography.Title level={5} type="danger">Something went wrong</Typography.Title>
            <Typography.Text>
                There was an issue while rendering the results. Please try again.
            </Typography.Text>
            </div>
        );
    }

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

                    {worthBuying && (
                        <div style={{ textAlign: 'center', margin: '12px 0' }}>
                            <Text strong>Worth Buying? </Text>
                            {worthBuying}
                        </div>
                        )}

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
                dataSource={Array.isArray(data.reviews) ? data.reviews : []}
                style={{ padding: 4 }}
                renderItem={(item) => (
                    <List.Item>
                    <Text strong>{item.reviewer_name}</Text>: <Text>{item.review_text}</Text> <Tag color="blue">⭐ {item.rating}</Tag>
                    </List.Item>
                )}
                />
            </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default ResponseScreen;
