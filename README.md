Proof of Insight (PoI) Verifier
-------------------------------
Name: ChainInsight
-------------------------------
A lot of information we find of the internet are mislaeding not that they are wrong but the mislead people because they are  below the standard. POI meaning of Proof Of Insight is A concensus mechanism in which infomation is verified before they are put online using AI and the blockchain technolgy.
-------------------------------
Overview
-------------------------------
ChainInsight is a lightweight, AI-powered platform that lets financial analysts, researchers, and thought leaders submit original insights. The AI evaluates these insights for quality and originality, then records them permanently on a blockchain. This offers immutable proof of authorship and intellectual contribution.

Use Case
-------------------------------
 Financial analysts seeking recognition for original market insights.
 Research writers wanting timestamped verification of first publication.
 Communities tracking intellectual contributions in decentralized forums.
 Institutions verifying originality before promoting or endorsing content.

Core Features
------------------------------
1. AI Evaluation: An NLP model analyzes submitted text for originality, sentiment, and relevance.
2. Blockchain Anchoring: If the content passes evaluation, its hash is stored on-chain (Polygon/Near) as a cryptographic "PoI token".
3. User Dashboard: Users can view their verified insights, badges, and hash records.
4. PoI Badge Generator: This creates a shareable badge or token for social or professional profiles.
5. Leaderboard (Optional Extension): Ranks users by originality, frequency, or sector impact.

Architecture Diagram (Text-based Summary)
------------------------------
The flow is: User → Frontend UI → Backend (API) → AI Evaluator. 
The blockchain record and user dashboard are also part of this flow.

Tech Stack
------------------------------
1. Frontend: ReactJs .
2. Backend: NodeJs and ExpressJs
3. AI/NLP: Gemini API .
4. Blockchain: Base.
5. Hashing: SHA256.
6. Database: MongoDB.

Future Add-ons
------------------------------
1. Tokenized Insight Marketplace for trading valuable insights.
2. AI Analyst Profiles with personality and writing style.
3. Decentralized Voting for content verification.

Branding & Positioning
------------------------------
ChainInsight gives contributors "digital armor for their ideas: Original, immutable, and ready to be shared confidently". 
It's positioned as a "GitHub for thought leadership—where insight meets integrity".

How To run
1. run git clone `https:/`
2. cd frontend
3. npm install
4. cd backend
5. npm install
6. cd smartcontract
7. npm install
To run frontend: run `npm run dev`; it is will displayed at port 5173 on localhost
To run backend: run nodemon; it will be listening at port 8000 in localhost

Live url: 