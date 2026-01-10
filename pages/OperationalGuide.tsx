
import React, { useState } from 'react';
import { 
  ArrowLeft, Terminal, Cpu, Zap, ShieldCheck, Code2, 
  Rocket, GraduationCap, HelpCircle, CheckCircle2, 
  Star, Clock, Lock, Wand2, Building2, Shield, 
  BrainCircuit, Trophy, ChevronDown, ChevronUp, AlertTriangle, 
  Layers, Activity, BookOpen, KeyRound, Eye
} from 'lucide-react';

interface ProblemData {
  title: string;
  story: string;
  engProblem: string;
  expected: string;
  current: string;
  context: string;
  whyHard: string;
  impact: string;
  difficulty: string;
  tags: string[];
}

interface SolutionData {
  rootCause: string;
  concepts: string[];
  approach: string;
  outcome: string;
  evaluation: string;
}

const problems: ProblemData[] = [
  {
    title: "The Phantom Geofence Failure",
    story: "Imagine a pizza shop that only delivers to people inside a magic circle drawn on a map. One day, the magic circle breaks. People standing right next to the shop are told, 'Sorry, you are too far away,' while people in another country are told, 'Pizza is on the way!'",
    engProblem: "The mobile app’s GPS coordinates are being sent to the backend, but the spatial query used to check if a user is within a 'delivery polygon' is returning incorrect results or failing at high precision.",
    expected: "A user within a 5km radius should see 'Available'; a user at 5.1km should see 'Unavailable.'",
    current: "Users at 100 meters see 'Unavailable,' and the app hangs while trying to 'find location.'",
    context: "React Native Frontend, Node.js Backend, PostgreSQL with PostGIS extension for location data.",
    whyHard: "GPS data is 'noisy' (it jumps around). Polygons can have thousands of points, making math slow. Converting 'addresses' to 'dots on a map' (geocoding) is often delayed.",
    impact: "Lost sales, frustrated hungry customers, and high customer support costs.",
    difficulty: "Medium",
    tags: ["Geofencing", "PostGIS", "Spatial Queries", "Lat/Long Precision"]
  },
  {
    title: "Distributed Cache Invalidation Nightmare",
    story: "You go to a store and see a toy for $10. You go to the checkout, and the computer says $50. You run back to the shelf—it still says $10. The store manager is confused because he changed the price on his computer an hour ago, but the shelves didn't listen.",
    engProblem: "The system uses a high-speed 'memory' (Cache) to show prices quickly. When the main database price is updated, the cache is not being cleared or updated, leading to 'stale data.'",
    expected: "As soon as the Admin updates the price to $50, every user sees $50 immediately.",
    current: "Some users see $10, some see $50, and some see an error.",
    context: "Java Spring Boot Microservices, Redis for Caching, MySQL Database.",
    whyHard: "In a 'Distributed System,' you have many copies of the cache. Telling all of them to 'forget the old price' at the same time is like trying to get 100 people in different rooms to clap at once without a conductor.",
    impact: "Legal risks (false advertising), massive financial loss if prices are too low, and loss of user trust.",
    difficulty: "Hard",
    tags: ["Redis", "Cache Invalidation", "Eventual Consistency", "Race Conditions"]
  },
  {
    title: "The Flash-Sale Connection Pool Exhaustion",
    story: "A famous singer is selling concert tickets at midnight. Millions of fans arrive at the same second. The website looks fine for a moment, then suddenly everyone gets a black screen that says 'Please try again later.' The servers aren't broken, but they are 'stuck.'",
    engProblem: "Each visitor needs a 'pipe' (connection) to talk to the database. The server only has 100 pipes. When 1,000,000 people arrive, the first 100 take the pipes and don't let go fast enough. Everyone else waits until the system crashes.",
    expected: "The system should handle the queue or tell people to wait in an orderly fashion without crashing the database.",
    current: "Database CPU hits 100%, and the entire platform goes offline for 2 hours.",
    context: "Python/Django App, PostgreSQL Database, AWS Auto-scaling enabled.",
    whyHard: "Auto-scaling adds more 'Servers,' but you can't easily auto-scale a single 'Database.' Adding more servers actually makes the problem worse because they all try to grab the remaining pipes.",
    impact: "Zero revenue during the most important hour of the year and terrible PR.",
    difficulty: "Very Hard",
    tags: ["Connection Pooling", "Scalability", "Database Bottlenecks", "Load Balancing"]
  },
  {
    title: "The Analytics Data Gap Disaster",
    story: "A king wants to know how many people are entering his castle. He hires a guard to count them. The guard only counts people wearing hats. At the end of the day, the king thinks only 10 people visited, but 1,000 people actually came in (990 didn't have hats).",
    engProblem: "The 'events' (clicks, views) sent from the frontend to the analytics server are being blocked by browser extensions (Ad-blockers) or are being lost because the network connection is slow.",
    expected: "100% of purchase attempts should be recorded in the dashboard.",
    current: "The dashboard shows 40% fewer sales than the actual bank account shows.",
    context: "JavaScript Frontend, Segment/Mixpanel for Analytics, Server-side event tracking.",
    whyHard: "If you track on the client side, blockers stop you. If you track on the server side, you lose 'context' (like what the user clicked before the error).",
    impact: "Marketing teams waste millions of dollars on ads that 'look' like they aren't working but actually are.",
    difficulty: "Medium",
    tags: ["Data Integrity", "Client vs Server Tracking", "Event Pipelines"]
  },
  {
    title: "Sybil Attack & Fake Review Injection",
    story: "A new restaurant opens. Suddenly, 5,000 people write 'This food is poison!' on their website. But the restaurant hasn't even served 100 people yet. The 'people' writing the reviews are actually robots controlled by a competitor.",
    engProblem: "The API endpoint for 'SubmitReview' has no rate-limiting or identity verification, allowing a single script to generate thousands of entries.",
    expected: "Only real customers who bought a meal should be able to leave one review per day.",
    current: "50,000 reviews appear in 10 minutes from 'Guest' accounts.",
    context: "Node.js API, MongoDB, No Authentication required for 'Read' but 'Write' is open.",
    whyHard: "Robots can pretend to be different people by changing their 'IP address.' If you make the security too high, real customers get annoyed and leave.",
    impact: "Total destruction of platform trust. Real businesses leave the platform.",
    difficulty: "Medium",
    tags: ["Rate Limiting", "Captcha", "Bot Mitigation", "API Security"]
  },
  {
    title: "Distributed Transaction Partial Failure",
    story: "You buy a toy online. The bank takes your money. But the warehouse never gets the message to ship the toy. You have no toy, and the bank says 'The money is gone.' The two computers stopped talking halfway through the deal.",
    engProblem: "The 'Payment Service' succeeded, but the 'Inventory Service' failed or timed out. There was no 'Rollback' mechanism to give the money back.",
    expected: "Either both the money is taken AND the toy is shipped, or NEITHER happens.",
    current: "Money is taken, inventory is unchanged, user is angry.",
    context: "Microservices (Payment, Order, Inventory) using REST APIs to talk.",
    whyHard: "In microservices, 'Service A' doesn't know if 'Service B' actually finished the job or just got disconnected. This is the 'Two Generals' Problem' in computer science.",
    impact: "Customer trust is destroyed, and manual work is required to fix thousands of orders.",
    difficulty: "Very Hard",
    tags: ["Distributed Transactions", "Saga Pattern", "Idempotency", "Microservices"]
  },
  {
    title: "Lack of Request Idempotency",
    story: "You press the 'Buy' button on a video game. The internet is slow, so you press it 5 times really fast. When your dad looks at the credit card bill, he was charged 5 times for the same game!",
    engProblem: "The backend processes every 'POST' request it receives as a new order, even if they are identical and sent within milliseconds of each other.",
    expected: "No matter how many times you click 'Buy,' you are only charged once for that specific cart.",
    current: "Multiple orders are created for a single click-spasm.",
    context: "Ruby on Rails Backend, Stripe API Integration.",
    whyHard: "You have to distinguish between a user wanting to buy 'two of the same thing' and a 'duplicate request' caused by a laggy UI.",
    impact: "Massive refund fees (Stripe keeps their fee even if you refund!) and customer rage.",
    difficulty: "Medium",
    tags: ["Idempotency Keys", "API Design", "Race Conditions"]
  },
  {
    title: "Frontend State Race Condition",
    story: "You are using an app to find a bus. You click 'Bus A,' then quickly click 'Bus B.' For a split second, the app shows the map for 'Bus B,' but then it suddenly jumps back and shows you the info for 'Bus A.' You get on the wrong bus!",
    engProblem: "Two asynchronous API calls were made. The second call (Bus B) finished faster than the first call (Bus A). The app updated with the latest data to arrive, not the latest data requested.",
    expected: "The UI should always show the data for the most recent button the user clicked.",
    current: "Old data overwrites new data because it arrived late.",
    context: "React/Redux Frontend, slow external Transit API.",
    whyHard: "Developers often forget that 'Order of sending' is not 'Order of receiving' in web requests.",
    impact: "Users think the app is 'glitchy' and stop using it for critical tasks.",
    difficulty: "Easy",
    tags: ["Asynchronous JS", "Race Conditions", "Request Cancellation"]
  },
  {
    title: "Broken Object Level Authorization (BOLA)",
    story: "Every student has a digital locker. You notice that your locker URL is lockers.com/student/123. You change the 123 to 124 in the address bar. Suddenly, you are inside the teacher's locker!",
    engProblem: "The server checks if you are a 'Logged in user,' but it doesn't check if you own the specific 'Object' (the locker) you are asking for.",
    expected: "The server should say 'Access Denied' if Student 123 tries to see Locker 124.",
    current: "Anyone can see any data just by changing a number in the URL.",
    context: "Node.js/Express, REST API, JWT Authentication.",
    whyHard: "It's easy to remember to check who the user is, but hard to remember to check what they are allowed to touch every single time.",
    impact: "Massive data leak, legal lawsuits, and total company shutdown.",
    difficulty: "Founder Level",
    tags: ["Cybersecurity", "BOLA/IDOR", "Authorization", "API Security"]
  },
  {
    title: "GDPR Compliance Failure",
    story: "You tell a secret to 10 friends. Later, you say, 'Please forget that secret.' 9 friends forget, but 1 friend wrote it in his diary and refuses to erase it. Now your secret is still out there, and you are worried.",
    engProblem: "When a user clicks 'Delete My Account,' their data is removed from the Users table, but their email and phone number still exist in Backups, Logs, and Marketing Email Lists.",
    expected: "Every trace of the user's personal info is erased or hidden across all systems within 30 days.",
    current: "The user gets a 'Happy Birthday' email from the company 2 months after deleting their account.",
    context: "Microservices architecture, S3 for logs, Snowflake for Data Warehouse, Mailchimp for emails.",
    whyHard: "Data spreads like a virus. It’s in logs, data warehouses, third-party tools, and physical backups. Finding every copy is a massive coordination task.",
    impact: "Fines of up to 4% of global revenue (GDPR) and massive brand damage.",
    difficulty: "Hard",
    tags: ["Compliance", "Data Privacy", "GDPR", "Data Governance"]
  }
];

const solutions: SolutionData[] = [
  {
    rootCause: "Floating point precision errors in SQL or using a 'Bounding Box' instead of a true 'Polygon Check.'",
    concepts: ["Computational Geometry", "Coordinate Reference Systems (CRS)"],
    approach: "Switch to a dedicated spatial database engine like PostGIS. Use the ST_Contains function. Implement 'Point Snapping' to handle noisy GPS data.",
    outcome: "Success looks like accurate geofence detection (within 1-2 meters) and high throughput for location queries.",
    evaluation: "Does the student suggest using a geometric library? Do they mention GPS noise?"
  },
  {
    rootCause: "No 'Cache Eviction' logic on the update path.",
    concepts: ["Cache Invalidation", "TTL (Time to Live)", "Pub/Sub"],
    approach: "Use the 'Cache-Aside' pattern. When an Admin updates a price, the code must explicitly call cache.delete(product_id). Alternatively, use Redis Pub/Sub to notify all instances.",
    outcome: "Prices update globally within 100ms of the database commit.",
    evaluation: "Does the student identify that the update and the cache are disconnected? Do they suggest 'TTL' as a fallback?"
  },
  {
    rootCause: "Fixed connection pool size and slow-running queries holding onto connections.",
    concepts: ["Connection Pooling", "Queueing Theory", "Throughput"],
    approach: "Implement a 'Virtual Waiting Room.' Use a Database Proxy (like PgBouncer). Optimize the checkout query to be O(1) and wrap it in a very short timeout.",
    outcome: "System remains responsive for browsing even if the checkout queue is long.",
    evaluation: "Do they recognize that more servers can hurt the database? Do they suggest a queue?"
  },
  {
    rootCause: "Over-reliance on client-side JS tracking.",
    concepts: ["Web-beacons", "Ad-blocking", "Server-side Proxy"],
    approach: "Implement 'Hybrid Tracking.' Send 'Mission Critical' data (like sales) from the Server-to-Server API. Use a first-party proxy for client-side events.",
    outcome: "Data gap between bank accounts and dashboard shrinks from 40% to <2%.",
    evaluation: "Do they suggest server-side tracking for reliability?"
  },
  {
    rootCause: "Lack of rate-limiting and missing 'Proof of Purchase' check.",
    concepts: ["Sybil Attacks", "Rate Limiting", "RBAC"],
    approach: "Add an API Gateway with Rate Limiting. More importantly, check the database for a SuccessfulOrder linked to that UserID and ProductID before allowing the POST.",
    outcome: "Zero fake reviews from non-customers; automated bot-spam is blocked at the gateway.",
    evaluation: "Do they suggest connecting the review to a purchase? Do they mention rate-limiting?"
  },
  {
    rootCause: "Lack of atomicity across network boundaries.",
    concepts: ["Atomicity", "Saga Pattern", "Compensation Logic"],
    approach: "Use the 'Saga Pattern.' If Service B fails, Service A must receive an event to 'Undo' (Compensate) the previous action. Use a Message Broker (RabbitMQ/Kafka).",
    outcome: "Inventory and payments are always in sync; no more 'ghost orders'.",
    evaluation: "Does the student suggest an 'Undo' or 'Retry' mechanism?"
  },
  {
    rootCause: "Non-idempotent API design.",
    concepts: ["Idempotency", "Unique Constraints"],
    approach: "The Frontend generates a unique 'Request-ID' (UUID). The Backend stores this ID in a table for 24 hours. If a second request arrives, return the cached result.",
    outcome: "Users can click 'Buy' as many times as they want; only one charge is generated per transaction ID.",
    evaluation: "Do they mention 'Idempotency Keys'?"
  },
  {
    rootCause: "Unhandled 'Out-of-order' async responses.",
    concepts: ["Promises", "AbortController", "Debouncing"],
    approach: "Use an AbortController to cancel the previous request when a new button is clicked. Or, timestamp each request and discard older responses.",
    outcome: "The UI state perfectly mirrors the user's latest selection without flickering.",
    evaluation: "Do they mention canceling old requests?"
  },
  {
    rootCause: "Missing 'Ownership' check in the query.",
    concepts: ["IDOR (Insecure Direct Object Reference)", "Middleware"],
    approach: "Change the query from SELECT * FROM lockers WHERE id = 124 to SELECT * FROM lockers WHERE id = 124 AND owner_id = current_user_id. Use middleware validation.",
    outcome: "Total isolation of user data; URL-guessing no longer leaks information.",
    evaluation: "Do they suggest including user_id in the WHERE clause?"
  },
  {
    rootCause: "Data silos and lack of a central 'Deletion Event.'",
    concepts: ["Data Lineage", "Event-Driven Architecture"],
    approach: "Create a 'User Deleted' event in a Message Bus (Kafka). Every microservice must listen and run its own 'Scrubbing Script.' Use Anonymization for logs.",
    outcome: "Full automated compliance with GDPR 'Right to be Forgotten' across all data stores.",
    evaluation: "Do they suggest an event-driven approach to notify all systems?"
  }
];

const OperationalGuide: React.FC<{ onBack: () => void; onAuth: () => void; }> = ({ onBack, onAuth }) => {
  const [openProblemIndex, setOpenProblemIndex] = useState<number | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-paper pt-32 px-4 md:px-10 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <HelpCircle className="w-[600px] h-[600px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 reveal">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(255,95,95,1)] mb-4">
                    <Wand2 className="w-3.5 h-3.5 text-citrus animate-pulse" />
                    Protocol: Industry Curriculum
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-forest decoration-8 underline-offset-8">
                    The Blueprint.
                </h1>
                <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mt-6">
                    Training students to think like <span className="text-black">Real Engineers</span> by solving high-stakes industry roadblocks. 😁
                </p>
            </div>
            <button 
                onClick={onBack}
                className="tactile-btn px-6 py-3 bg-white border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3"
            >
                <ArrowLeft className="w-4 h-4" /> Return to Base
            </button>
        </div>

        {/* Introduction Section */}
        <div className="tactile-card p-10 md:p-16 bg-white rounded-[3rem] border-4 border-black mb-20 reveal">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-citrus rounded-2xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <BrainCircuit className="w-10 h-10 text-black" />
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Beyond Theory.</h2>
                    <p className="text-lg font-bold text-gray-500">FixMyProblem does not teach syntax. It teaches systems. 🪄</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 text-lg font-bold text-gray-700 leading-relaxed italic">
                <p>
                    "The difference between a student and an engineer is the ability to diagnose root causes in complex, noisy environments. Our curriculum exposes you to the 'Ghosts in the Machine'—bugs that exist between services, across networks, and inside the minds of users."
                </p>
                <p>
                    "Study the roadblocks below. These are extreme real-world scenarios. Use the Answer Key only after you have drafted your own execution plan in your mind. This is how we build the top 1% of talent." 😁
                </p>
            </div>
        </div>

        {/* Problems Gallery */}
        <div className="space-y-12 mb-20">
            <h2 className="text-3xl font-black uppercase tracking-widest flex items-center gap-4">
                <Terminal className="w-10 h-10 text-coral" /> Active System Roadblocks
            </h2>
            
            <div className="grid gap-8">
                {problems.map((p, i) => (
                    <div key={i} className="tactile-card bg-white rounded-[2.5rem] border-2 border-black overflow-hidden reveal">
                        <div 
                            className={`p-8 cursor-pointer transition-colors flex flex-col md:flex-row justify-between items-center gap-6 ${openProblemIndex === i ? 'bg-paper' : 'hover:bg-citrus/5'}`}
                            onClick={() => setOpenProblemIndex(openProblemIndex === i ? null : i)}
                        >
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black shrink-0">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter group-hover:text-coral transition-colors">{p.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border border-black/10 ${p.difficulty === 'Very Hard' || p.difficulty === 'Founder Level' ? 'bg-coral text-white' : 'bg-forest text-white'}`}>
                                            {p.difficulty}
                                        </span>
                                        {p.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-gray-100 text-gray-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0">
                                {openProblemIndex === i ? <ChevronUp className="w-8 h-8" /> : <ChevronDown className="w-8 h-8" />}
                            </div>
                        </div>

                        {openProblemIndex === i && (
                            <div className="p-8 md:p-12 border-t-2 border-black/5 bg-white space-y-10 animate-pop-in">
                                {/* Story Section */}
                                <section>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> The Story (Simple)</h4>
                                    <div className="p-6 bg-citrus/10 border-2 border-black rounded-2xl italic font-bold text-gray-600 leading-relaxed">
                                        "{p.story}"
                                    </div>
                                </section>

                                {/* Technical Breakdown */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <section>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Engineering Problem</h4>
                                        <p className="text-sm font-bold text-gray-800 leading-relaxed">{p.engProblem}</p>
                                    </section>
                                    <section>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> System Context</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {p.context.split(',').map(c => (
                                                <span key={c} className="bg-paper px-3 py-1 border border-black/5 rounded-lg text-xs font-black">{c.trim()}</span>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Comparison Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-forest/5 border-2 border-forest/10 rounded-2xl">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-forest mb-2">Expected Behavior</h4>
                                        <p className="text-sm font-bold text-gray-600 italic">"{p.expected}"</p>
                                    </div>
                                    <div className="p-6 bg-coral/5 border-2 border-coral/10 rounded-2xl">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-coral mb-2">Current Behavior</h4>
                                        <p className="text-sm font-bold text-gray-600 italic">"{p.current}"</p>
                                    </div>
                                </div>

                                {/* Deep Dive */}
                                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t-2 border-black/5">
                                    <section>
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2"><KeyRound className="w-5 h-5 text-coral" /> Why this is hard</h4>
                                        <p className="text-gray-500 font-bold leading-relaxed">{p.whyHard}</p>
                                    </section>
                                    <section>
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-forest" /> Business Impact</h4>
                                        <p className="text-gray-500 font-bold leading-relaxed">{p.impact}</p>
                                    </section>
                                </div>

                                {/* Interactive Answer Toggle */}
                                <div className="pt-10 flex flex-col items-center">
                                    <button 
                                        onClick={() => setShowAnswerKey(showAnswerKey === i ? null : i)}
                                        className={`tactile-btn px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${showAnswerKey === i ? 'bg-black text-white' : 'bg-citrus text-black hover:bg-black hover:text-white'}`}
                                    >
                                        {showAnswerKey === i ? <><Eye className="w-4 h-4" /> Conceal Audit</> : <><Zap className="w-4 h-4" /> Reveal Answer Key</>}
                                    </button>
                                    
                                    {showAnswerKey === i && (
                                        <div className="mt-10 w-full p-8 md:p-12 bg-gray-50 border-4 border-black rounded-[3rem] space-y-10 animate-pop">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-forest text-citrus rounded-2xl flex items-center justify-center border-2 border-black">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                                <h5 className="text-3xl font-black tracking-tighter">Verified Extraction Plan.</h5>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                    <section>
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-coral mb-2">Root Cause Diagnosis</h6>
                                                        <p className="text-sm font-bold text-gray-700 leading-relaxed">{solutions[i].rootCause}</p>
                                                    </section>
                                                    <section>
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-coral mb-2">Core Engineering Concepts</h6>
                                                        <div className="flex flex-wrap gap-2">
                                                            {solutions[i].concepts.map(c => (
                                                                <span key={c} className="bg-black text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{c}</span>
                                                            ))}
                                                        </div>
                                                    </section>
                                                </div>
                                                <div className="space-y-6">
                                                    <section>
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-forest mb-2">High-Level Approach</h6>
                                                        <p className="text-sm font-bold text-gray-700 leading-relaxed italic">"{solutions[i].approach}"</p>
                                                    </section>
                                                    <section>
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-forest mb-2">Expected Outcome</h6>
                                                        <p className="text-sm font-bold text-gray-700 leading-relaxed">{solutions[i].outcome}</p>
                                                    </section>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t-2 border-black/5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Trophy className="w-6 h-6 text-citrus fill-citrus" />
                                                    <h6 className="text-[10px] font-black uppercase tracking-[0.3em]">Mentor Evaluation Criteria</h6>
                                                </div>
                                                <p className="text-sm font-bold text-gray-500 italic">"Mentor verdict node: {solutions[i].evaluation}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 p-12 bg-citrus rounded-[4rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="w-64 h-64" /></div>
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic">Mastered the Blueprint?</h2>
                <p className="text-xl font-bold text-black opacity-60 leading-relaxed mb-10">
                    Apply your knowledge to real simulations in the Sandbox or earn real bounties in the active grid. The mission awaits. 😁
                </p>
                <button 
                  onClick={onAuth}
                  className="tactile-btn px-12 py-5 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-forest transition-all"
                >
                  Synchronize Node <Rocket className="inline-block ml-3 w-6 h-6" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalGuide;
