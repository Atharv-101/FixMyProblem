import React from 'react';
import { ChevronRight } from 'lucide-react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What is FixMyProblem?",
      answer: "FixMyProblem is a decentralized platform connecting companies with technical challenges to talented university students who can solve them for a bounty. We're bridging the gap between academic talent and industry needs."
    },
    {
      question: "How do students benefit from FixMyProblem?",
      answer: "Students gain invaluable real-world experience, build a verifiable portfolio with solutions to genuine industry problems, earn significant bounties, and get recognized by leading companies—often leading to internships, job offers, or valuable professional connections."
    },
    {
      question: "How do companies benefit from FixMyProblem?",
      answer: "Companies get innovative, cost-effective solutions to their technical problems, rapid prototyping, access to a global pool of fresh talent, accelerate their R&D, and identify potential future hires before they even graduate."
    },
    {
      question: "Is there a cost for companies to post a problem?",
      answer: "Companies pay a bounty for each problem, which is awarded directly to the student whose solution is accepted. There are no upfront platform fees to post a challenge, ensuring you only pay for successful outcomes."
    },
    {
      question: "How are solutions evaluated and bounties awarded?",
      answer: "Companies rigorously review submitted solutions, providing detailed feedback and ratings. Once a company accepts a solution, the pre-determined bounty is securely released to the student, and the problem is marked as 'closed'."
    }
  ];

  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100 reveal">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-gray-900 leading-tight">
          Frequently Asked <span className="text-teal-600">Questions</span>
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-bold text-lg md:text-xl text-gray-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                  <ChevronRight className="w-6 h-6 transform transition-transform group-open:rotate-90 text-gray-400" />
                </summary>
                <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed border-t border-gray-200 pt-4">{faq.answer}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;