import React from 'react';
import Header from '../components/Header1'; // Adjust path as needed
import Footer from '../components/Footer1'; // Adjust path as needed

const TermsPage = () => {
  return (
    <div className="min-h-screen  flex flex-col bg-white text-gray-800">
      <Header />

      <main className="flex-grow w-full px-4 py-12 sm:px-8 lg:px-16">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-12">
            Terms & Conditions
          </h1>

          <section className="space-y-12 text-base sm:text-lg leading-relaxed">
            {/* Legal Sections */}
            {[
              {
                title: '1. Electronic Record Compliance',
                text:
                  'This document is an electronic record in accordance with the Information Technology Act, 2000 and its applicable rules. No physical or digital signature is required.',
              },
              {
                title: '2. Publication as per Law',
                text:
                  'This document is published under Rule 3(1) of the IT (Intermediaries Guidelines) Rules, 2011, covering rules, privacy, and terms for ',
                linkText: 'https://lzycrazy.com',
                linkHref: 'https://lzycrazy.com',
              },
              {
                title: '3. Platform Ownership',
                text:
                  'The Platform is owned by LZYCRAZY PRIVATE LIMITED, based in Noida, India (the “Platform Owner”).',
              },
              {
                title: '4. Agreement to Terms',
                text:
                  'By using the Platform, you agree to be legally bound by these Terms and applicable policies. Terms may change without notice.',
              },
              {
                title: '5. User Definition',
                text:
                  '“You” refers to any person accessing or transacting on the Platform.',
              },
              {
                title: '6. Acceptance of Terms',
                text:
                  'Using the Platform implies agreement with these Terms. Please read carefully before proceeding.',
              },
            ].map((item, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                <p>
                  {item.text}
                  {item.linkText && (
                    <a
                      href={item.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline ml-1"
                    >
                      {item.linkText}
                    </a>
                  )}
                </p>
              </div>
            ))}

            {/* Divider */}
            <hr className="my-10 border-gray-300" />

            {/* General Conditions Section */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              General Conditions of Use
            </h2>

            <div className="space-y-8">
              {[
                { title: 'A. Account Responsibility', text: 'You are responsible for accurate registration and all activity through your account.' },
                { title: 'B. Accuracy of Information', text: 'No guarantee is made on content accuracy. You use content at your own risk.' },
                { title: 'C. User Risk', text: 'You are responsible for determining the suitability of the services offered.' },
                { title: 'D. Intellectual Property Rights', text: 'All content belongs to the Platform Owner or licensors. No transfer of rights is implied.' },
                { title: 'E. Misuse and Unauthorized Use', text: 'Unauthorized uploads or misuse may lead to legal action.' },
                { title: 'F. Service Charges', text: 'Services are chargeable for a period of one month. No post-period liability exists.' },
                { title: 'G. Prohibited Use', text: 'You may not use the Platform for illegal or prohibited activities under law.' },
                { title: 'H. Third-Party Links', text: 'We are not responsible for third-party website content or policies.' },
                { title: 'I. Binding Agreement', text: 'Any transaction forms a legally binding agreement with the Platform Owner.' },
                { title: 'J. Indemnification', text: 'You agree to indemnify us against legal claims from misuse or breach of terms.' },
                { title: 'K. Force Majeure', text: 'Neither party is liable for non-performance due to unforeseen events beyond control.' },
                { title: 'L. Governing Law', text: 'These Terms are governed by Indian law.' },
                { title: 'M. Jurisdiction', text: 'Disputes shall be subject to courts in Gautam Buddha Nagar, Uttar Pradesh.' },
                { title: 'N. Contact', text: 'For questions, contact us via details on the Platform.' },
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
