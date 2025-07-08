import React from 'react';
import Header from './Header1';
import Footer from './Footer1';
import { CheckCircle, FileText, ShieldCheck, Info, Users, AlertTriangle } from 'lucide-react';

const sections = [
  {
    id: 'electronic',
    title: '1. Electronic Record Compliance',
    icon: CheckCircle,
    image: 'https://cdn-icons-png.flaticon.com/512/681/681494.png',
    content: 'This document is an electronic record in accordance with the Information Technology Act, 2000 and its applicable rules. No physical or digital signature is required.'
  },
  {
    id: 'publication',
    title: '2. Publication as per Law',
    icon: FileText,
    image: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
    content: 'This document is published under Rule 3(1) of the IT (Intermediaries Guidelines) Rules, 2011, covering rules, privacy, and terms for https://lzycrazy.com.'
  },
  {
    id: 'ownership',
    title: '3. Platform Ownership',
    icon: ShieldCheck,
    image: 'https://cdn-icons-png.flaticon.com/512/1828/1828490.png',
    content: 'The Platform is owned by LZYCRAZY PRIVATE LIMITED, based in Noida, India (the "Platform Owner").'
  },
  {
    id: 'agreement',
    title: '4. Agreement to Terms',
    icon: Info,
    image: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
    content: 'By using the Platform, you agree to be legally bound by these Terms and applicable policies. Terms may change without notice.'
  },
  {
    id: 'userdef',
    title: '5. User Definition',
    icon: Users,
    image: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
    content: '“You” refers to any person accessing or transacting on the Platform.'
  },
  {
    id: 'acceptance',
    title: '6. Acceptance of Terms',
    icon: AlertTriangle,
    image: 'https://cdn-icons-png.flaticon.com/512/1038/1038720.png',
    content: 'Using the Platform implies agreement with these Terms. Please read carefully before proceeding.'
  }
];

const conditions = [
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
];

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <main className="flex-grow  w-full flex flex-col lg:flex-row">
        <aside className="hidden lg:flex flex-col w-64 p-6 border-r border-gray-200 sticky top-15 h-screen overflow-y-auto bg-gray-50">
          <h2 className="text-lg font-semibold mb-6 text-gray-700">Sections</h2>
          <ul className="space-y-4">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className="flex items-center text-gray-700 hover:text-blue-600">
                  <img src={sec.image || "/missing.png"} alt={sec.title || "Section Icon"} className="w-5 h-5 mr-2 rounded object-cover" loading="lazy" />
                  <span className="text-sm font-medium">{sec.title.replace(/^[0-9]+\. /, '')}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-4xl font-bold mt-6 text-gray-900 mb-15 text-center">Terms & Conditions</h1>

            <section className="space-y-26">
              {sections.map((item, idx) => (
                <div id={item.id} key={idx} className="scroll-mt-20">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img src={item.image || "/missing.png"} alt={item.title || "Item Image"} className="w-32 h-32 object-contain rounded-md shadow-md" loading="lazy" />
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <item.icon className="w-6 h-6 mr-2 text-blue-600" />
                        {item.title}
                      </h2>
                      <p className="text-base sm:text-lg leading-relaxed text-gray-700">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              <hr className="my-10 border-gray-300" />

              <h2 className="text-3xl font-bold text-gray-900 mb-6">General Conditions of Use</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {conditions.map((cond, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
                    <h3 className="font-semibold text-md text-gray-800 mb-1">{cond.title}</h3>
                    <p className="text-sm text-gray-700">{cond.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
