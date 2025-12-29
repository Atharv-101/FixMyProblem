
import React from 'react';
import { LayoutDashboard, Shield, Users } from 'lucide-react';

const ImpactStories: React.FC = () => {
  const stories = [
    {
      title: "From Confusion to Clarity",
      description: "✔ Project submitted on time <br> ✔ Passed final evaluation <br> ✔ Gained confidence to debug independently",
      icon: <LayoutDashboard className="w-8 h-8 text-blue-600" />,
      image: "https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg",
      alt: "From Confusion to Clarity"
    },
    {
      title: "Learning Beyond College",
      description: "✔ Practical skills developed <br> ✔ Industry-ready mindset <br> ✔ Exposure to real workflows",
      icon: <Shield className="w-8 h-8 text-green-600" />,
      image: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg",
      alt: "Learning Beyond College"
    },
    {
      title: "Enhancing User Engagement for Giant",
      description: "✔ MVP built in weeks <br> ✔ Clear technical roadmap <br>✔ Reduced development cost",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      image: "https://images.pexels.com/photos/12935040/pexels-photo-12935040.jpeg",
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
