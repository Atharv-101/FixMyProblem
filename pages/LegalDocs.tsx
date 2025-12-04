import React from 'react';

interface LegalDocsProps {
  type: 'PRIVACY' | 'TERMS';
}

const LegalDocs: React.FC<LegalDocsProps> = ({ type }) => {
  return (
    <div className="min-h-screen bg-white pt-20 px-4">
      <div className="max-w-3xl mx-auto prose">
        <h1 className="text-3xl md:text-4xl">{type === 'PRIVACY' ? 'Privacy Policy' : 'Terms of Service'}</h1>
        <p>Content for {type.toLowerCase()} page goes here. This is a demo placeholder.</p>
      </div>
    </div>
  );
};

export default LegalDocs;