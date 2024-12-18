import React from 'react';
import me from '../../assets/pictures/workingAtComputer.jpg';
import meNow from '../../assets/pictures/currentme.jpg';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>This is Solana</h3>
            <br />
            <div className="text-block">
                <p>I am pleased to announce the release of Solana, a decentralized, high-performance blockchain platform designed to enable direct, secure, and scalable transactions without the need for intermediaries. This system addresses key challenges in decentralized applications (dApps) and financial systems, including inefficiency, high costs, and scalability limitations, by introducing groundbreaking technology and innovative architecture.</p>

                <br />

                <p>

                The Solana blockchain serves as a public, immutable ledger that records all transactions transparently while being collectively maintained by a network of participants. Leveraging a unique Proof-of-History (PoH) mechanism in combination with a highly efficient Proof-of-Stake (PoS) consensus, Solana ensures the security and integrity of its network, enabling high throughput and low fees. With a focus on scalability, Solana removes traditional bottlenecks, allowing thousands of transactions per second to be processed efficiently.

                </p><br />

                <p>

                The source code for Solana is now available for review and collaborative development. I invite developers, innovators, and researchers to explore this project and contribute to its growth. I believe Solana has the potential to transform how we build and scale decentralized technologies, fostering a more accessible, transparent, and inclusive digital economy.

                </p>

                <br />

                <p>

                Sincerely,
                <br />
                Anatoly Yakovenko

                </p>
            </div>
            
        </div>
    );
};

const styles: StyleSheetCSS = {
    contentHeader: {
        marginBottom: 16,
        fontSize: 48,
    },
    image: {
        height: 'auto',
        width: '100%',
    },
    topImage: {
        height: 'auto',
        width: '100%',
        marginBottom: 32,
    },
    verticalImage: {
        alignSelf: 'center',
        marginLeft: 32,
        flex: 0.8,
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
    },
};

export default About;
