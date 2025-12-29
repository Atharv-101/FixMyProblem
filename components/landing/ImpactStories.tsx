
import React from 'react';
import { LayoutDashboard, Shield, Users } from 'lucide-react';

const ImpactStories: React.FC = () => {
  const stories = [
    {
      title: "Optimizing Supply Chain Logistics for GlobalFlow",
      description: "A student team developed a machine learning model that reduced GlobalFlow's logistics costs by 15% through route optimization.",
      icon: <LayoutDashboard className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1628126131338-04a43878b209?q=80&w=2070&auto=format&fit=crop",
      alt: "Supply Chain Optimization"
    },
    {
      title: "Developing a Secure Microservice for FinTech Innovations",
      description: "Our student expert designed and implemented a secure, scalable microservice architecture, enhancing FinTech's transaction processing by 20%.",
      icon: <Shield className="w-8 h-8 text-green-600" />,
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
      alt: "Secure Microservice Development"
    },
    {
      title: "Enhancing User Engagement for E-Commerce Giant PixelMart",
      description: "Through advanced data analytics, a student helped PixelMart revamp their recommendation engine, leading to a 10% increase in user engagement.",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      image: "https://images.unsplash.com/photo-1497215729113-d15ee6b0a5a0?q=80&w=2070&auto=format&fit=crop",
      alt: "User Engagement Enhancement"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
          Our <span className="text-teal-600">Impact Stories</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
          Real problems, real solutions, real impact. See how FixMyProblem drives success.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm text-left flex flex-col items-center animate-fade-in-up hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                {story.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 text-center">{story.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed text-center">{story.description}</p>
              <img src={story.image} alt={story.alt} className="w-full h-40 object-cover rounded-lg mt-6 border border-gray-200"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStories;
