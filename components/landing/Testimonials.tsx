
import React from 'react';
import { MessageSquareText } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      quote: "FixMyProblem transformed my coding skills. Solving real company issues gave me an edge in interviews and a portfolio I'm proud of!",
      author: "Priya Sharma",
      role: "Student, IIT Delhi",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "We struggled with a niche bug for weeks. FixMyProblem delivered a brilliant solution from a talented student in days. Incredible platform!",
      author: "Mark Davis",
      role: "CTO, InnovateX",
      avatar: "https://randomuser.me/api/portraits/men/34.jpg"
    },
    {
      quote: "The bounties are great, but the recognition and direct feedback from companies are priceless. Highly recommend for any student looking to stand out.",
      author: "Ahmed Khan",
      role: "Student, BITS Pilani",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
  ];

  return (
    <section className="py-24 px-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
          What Our Users Are <span className="text-pink-600">Saying</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
          Hear from students and companies who are already benefiting from FixMyProblem.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm text-left flex flex-col justify-between transition-all hover:shadow-md animate-fade-in-up">
              <MessageSquareText className="w-10 h-10 text-blue-500 mb-6 flex-shrink-0" />
              <p className="text-gray-800 text-base md:text-lg italic mb-6 leading-relaxed flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center mt-auto">
                <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-500" />
                <div>
                  <p className="font-bold text-gray-900 text-md">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
