import React from 'react';
import Header from '../components/Header1';
import Footer from '../components/Footer1';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />

      <main className="flex-grow w-full px-4 py-12 sm:px-8 lg:px-16">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900">
            Privacy Policy
          </h1>

          <section className="space-y-10 text-base sm:text-lg leading-relaxed">
            {/* Privacy Policy Sections */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                This Privacy Policy outlines how LZYCRAZY PRIVATE LIMITED and its affiliates (collectively
                referred to as "we", "our", or "us") collect, use, share, protect, and process your personal information
                through our website <a href="https://lzycrazy.com" className="text-blue-600 underline">https://lzycrazy.com</a> (the "Platform").
              </p>
              <p>
                By accessing or using our Platform, submitting your personal data, or availing services/products, you agree to this Privacy Policy, our Terms of Use, and all applicable laws of India. If you do not agree, please do not use the Platform.
              </p>
              <p><strong>Note:</strong> We do not offer any services outside India. All personal data is primarily stored and processed in India.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Name, DOB, address, email, phone, photo, and video</li>
                <li>Documents for identity/address verification</li>
                <li>Preferences, behavior, and transaction history</li>
                <li>Cookies, log files, device identifiers, etc.</li>
                <li>Information shared with third-party partners</li>
              </ul>
              <p className="mt-2">We are not responsible for third-party privacy practices. Report suspicious requests to law enforcement.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Provide and improve our services</li>
                <li>Process transactions and communicate updates</li>
                <li>Prevent fraud or security threats</li>
                <li>Research and analyze user behavior</li>
                <li>Comply with laws and enforce our policies</li>
              </ul>
              <p className="mt-2">You can opt-out of marketing by updating your preferences.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sharing of Your Information</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>With affiliates for service enhancement</li>
                <li>With third-party service providers</li>
                <li>With authorities when legally required</li>
              </ul>
              <p className="mt-2">We ensure data security compliance by our partners.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p>
                We employ secure servers, encryption, and access control. However, no internet transmission is 100% secure. Keep your login details confidential.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention and Deletion</h2>
              <p>
                You may request account deletion. However, we may retain data for:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Legal compliance</li>
                <li>Pending claims or disputes</li>
                <li>Fraud prevention</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p>You may access, update, or request corrections of your data, and withdraw consent as described in section 9.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Consent</h2>
              <p>
                By using the Platform, you consent to data processing and communication via SMS, email, or messaging apps. For others' data, you confirm their consent.
              </p>
              <p>To withdraw consent, contact our Grievance Officer (see below).</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p>We may modify this policy at any time due to legal or business updates. Review this page periodically for changes.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Grievance Officer</h2>
              <p>
                <strong>Name:</strong> Mr. Hasan<br />
                <strong>Designation:</strong> CEO & Director<br />
                <strong>Company:</strong> LZYCRAZY PRIVATE LIMITED<br />
                <strong>Address:</strong> Sector 29, Noida, India<br />
                <strong>Email:</strong>{' '}
                <a href="mailto:info@lzycrazy.com" className="text-blue-600 underline">info@lzycrazy.com</a><br />
                <strong>Working Hours:</strong> Mon – Sat (10:00 AM – 5:00 PM)
              </p>
            </div>
          </section>

          {/* Divider */}
          <hr className="my-12 border-gray-300" />

          {/* Refund & Cancellation Policy */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-gray-900">
            Refund & Cancellation Policy
          </h1>

          <section className="space-y-6 text-base sm:text-lg leading-relaxed">
            <div>
              <p>
                1. Once services have been availed and payment has been successfully made through any available online method, <strong>no cancellation or refund</strong> will be permitted.
              </p>
              <p className="mt-4">
                2. This policy may be revised at the sole discretion of LZYCRAZY PRIVATE LIMITED, without prior notice. You are advised to review the latest policy before availing services.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
