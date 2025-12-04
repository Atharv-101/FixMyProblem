import React from 'react';
import { FileText, Shield, Scale } from 'lucide-react';

interface LegalPageProps {
  type: 'PRIVACY' | 'TERMS';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isPrivacy = type === 'PRIVACY';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const icon = isPrivacy ? <Shield className="w-8 h-8 mr-3 text-blue-600" /> : <Scale className="w-8 h-8 mr-3 text-green-600" />;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 flex items-center">
          {icon} {title}
        </h1>
        <p className="text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 mb-8">
          <strong>Disclaimer:</strong> This content is for demonstration purposes only. It is placeholder text and should not be considered legal advice. Please consult with a legal professional to draft your actual Privacy Policy and Terms of Service.
        </p>

        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {isPrivacy ? (
            <>
              <h2>1. Introduction</h2>
              <p>Welcome to FixMyProblem. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website fixmyproblem.com (the "Site") and use our services.</p>
              
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Data</h3>
              <p>We collect personally identifiable information that you voluntarily provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, when you participate in activities on the Site, or otherwise when you contact us.</p>
              <ul>
                <li><strong>Identity Data:</strong> Name, username, date of birth.</li>
                <li><strong>Contact Data:</strong> Email address, telephone numbers.</li>
                <li><strong>Profile Data:</strong> University name (for students), company name (for companies), bio, skills, website URL, profile picture.</li>
                <li><strong>Financial Data:</strong> Bounty amounts (for transactions). We do not store full payment card details.</li>
              </ul>

              <h3>2.2 Usage Data</h3>
              <p>We automatically collect certain information when you visit, use, or navigate the Site. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Site, and other technical information.</p>
              
              <h2>3. How We Use Your Information</h2>
              <p>We use personal information collected via our Site for various business purposes, including:</p>
              <ul>
                <li>To facilitate account creation and logon process.</li>
                <li>To manage user accounts and provide services (problem posting, solution submission).</li>
                <li>To send administrative information (updates, security alerts, support messages).</li>
                <li>To respond to your inquiries and offer support.</li>
                <li>To enable user-to-user communications (e.g., between companies and students).</li>
                <li>To request feedback and contact you about your use of our Site.</li>
                <li>To enforce our terms, conditions, and policies.</li>
                <li>To protect our services (e.g., fraud monitoring and prevention).</li>
              </ul>

              <h2>4. Disclosure of Your Information</h2>
              <p>We may process or share your data that we hold based on the following legal basis:</p>
              <ul>
                <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
                <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</p>

              <h2>6. Your Privacy Rights</h2>
              <p>You have certain rights under applicable data protection laws, including the right to:</p>
              <ul>
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Withdraw your consent.</li>
              </ul>
              <p>If you would like to exercise any of these rights, please contact us at support@fixmyproblem.com.</p>
            </>
          ) : (
            <>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using FixMyProblem (the "Platform"), you agree to be bound by these Terms of Service ("Terms"), all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
              
              <h2>2. Use of the Platform</h2>
              <h3>2.1 Eligibility</h3>
              <p>You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant that you have the right, authority, and capacity to enter into this Agreement.</p>
              
              <h3>2.2 User Accounts</h3>
              <p>You are responsible for maintaining the confidentiality of your account password and are responsible for all activities that occur under your account. You agree to notify FixMyProblem immediately of any unauthorized use of your account.</p>

              <h3>2.3 Prohibited Conduct</h3>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul>
                <li>Using the Platform for any illegal or unauthorized purpose.</li>
                <li>Harassing, abusing, or harming another person.</li>
                <li>Attempting to interfere with the proper working of the Platform.</li>
                <li>Submitting false or misleading information.</li>
                <li>Violating any laws in your jurisdiction (including but not limited to copyright laws).</li>
              </ul>

              <h2>3. Intellectual Property</h2>
              <p>All content on the Platform, including text, graphics, logos, images, and software, is the property of FixMyProblem or its content suppliers and protected by intellectual property laws.</p>
              <p>When a student submits a solution, they grant the company posting the problem a perpetual, irrevocable, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such solution in any media.</p>

              <h2>4. Bounties and Payments</h2>
              <p>Companies agree to pay the specified bounty for accepted solutions. FixMyProblem acts as a facilitator for these transactions and is not responsible for any tax obligations or disputes between users regarding bounties.</p>
              <p>Once a solution is accepted by a company, the bounty is irrevocably released to the student. All payments are final.</p>

              <h2>5. Disclaimers</h2>
              <p>The Platform and its services are provided on an "as-is" and "as-available" basis. FixMyProblem makes no warranties, expressed or implied, and hereby disclaims all other warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              
              <h2>6. Limitation of Liability</h2>
              <p>In no event shall FixMyProblem or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FixMyProblem's website, even if FixMyProblem or a FixMyProblem authorized representative has been notified orally or in writing of the possibility of such damage.</p>

              <h2>7. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;