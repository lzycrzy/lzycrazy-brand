import React from 'react';
import Header from '../components/Header1';
import Footer from '../components/Footer1';
import { FaInfoCircle, FaDatabase, FaUserShield, FaShareAlt, FaLock, FaClock, FaUserCheck, FaEdit, FaSyncAlt, FaUser } from 'react-icons/fa';

const sections = [
  { id: 'intro', label: 'Introduction', icon: <FaInfoCircle /> },
  { id: 'info', label: 'Information We Collect', icon: <FaDatabase /> },
  { id: 'usage', label: 'How We Use Info', icon: <FaUserShield /> },
  { id: 'sharing', label: 'Sharing Info', icon: <FaShareAlt /> },
  { id: 'security', label: 'Data Security', icon: <FaLock /> },
  { id: 'retention', label: 'Data Retention & Deletion', icon: <FaClock /> },
  { id: 'rights', label: 'Your Rights', icon: <FaUserCheck /> },
  { id: 'consent', label: 'Consent', icon: <FaEdit /> },
  { id: 'changes', label: 'Policy Changes', icon: <FaSyncAlt /> },
  { id: 'grievance', label: 'Grievance Officer', icon: <FaUser /> },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <main className="flex-grow flex w-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 sticky top-15 h-screen p-10 border-r border-gray-200 bg-gray-50">
          <nav className="space-y-4 text-sm font-medium">
            {sections.map(sec => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                {sec.icon}
                <span>{sec.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-grow px-4 py-29 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl sm:text-4xl font-bold text-center text-gray-900 mb-15">
              Privacy Policy
            </h1>

            <section id="intro">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" /> 1. Introduction
              </h2>
              <p>This Privacy Policy outlines how LZYCRAZY PRIVATE LIMITED and its affiliates (collectively referred to as "LZYCRAZY PRIVATE LIMITED", "we", "our", or "us") collect, use, share, protect, and otherwise process your personal information through our website https://lzycrazy.com (hereinafter referred to as the Platform).</p>
              <p>You may browse certain sections of the Platform without registering. However, by accessing the Platform, providing your personal data, or availing services/products, you expressly agree to be bound by this Privacy Policy, our Terms of Use, and applicable service/product terms, and to be governed by the laws of India, including those related to data protection and privacy.</p>
              <p>If you do not agree, please do not access or use the Platform.</p>
              <p><strong>Note:</strong> We do not offer any product or service outside India. All personal data will primarily be stored and processed in India.</p>
            </section>

            <section id="info">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaDatabase className="text-green-600" /> 2. Information We Collect
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Name, date of birth, address, email ID, mobile/telephone number, photo and video</li>
                <li>Documents submitted for identity/address verification</li>
                <li>Preferences, behavioural data, and transaction history</li>
                <li>Information collected via cookies, log files, device identifiers, etc.</li>
                <li>Data shared with third-party partners while using our services</li>
              </ul>
              <p>When sharing information with third-party platforms or service providers, please review their respective privacy policies. We are not responsible for third-party data practices.</p>
              <p>If you receive a suspicious request for personal information (e.g., banking passwords or OTPs) claiming to be from us, do not respond. Report the issue to your local law enforcement.</p>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaUserShield className="text-indigo-600" /> 3. How We Use Your Information
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Provide, customize, and improve our services</li>
                <li>Process transactions and fulfill orders</li>
                <li>Communicate service updates, offers, and promotions</li>
                <li>Detect, prevent, and investigate fraud or security issues</li>
                <li>Resolve disputes or troubleshoot problems</li>
                <li>Conduct research, surveys, and customer behavior analysis</li>
                <li>Comply with legal obligations</li>
                <li>Enforce our Terms of Use and policies</li>
              </ul>
              <p>You may opt out of marketing communication by updating your preferences.</p>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaShareAlt className="text-pink-600" /> 4. Sharing of Your Information
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Within our group companies and affiliates for service enhancement</li>
                <li>With third-party service providers (logistics, payment partners, etc.)</li>
                <li>With government agencies or law enforcement, if required under law or legal process</li>
                <li>To protect our legal rights, users, and the public when necessary</li>
              </ul>
              <p>We ensure that third parties adhere to appropriate data security standards.</p>
            </section>

            <section id="security">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaLock className="text-red-600" /> 5. Data Security
              </h2>
              <p>We employ reasonable security practices to protect your personal information. This includes secure servers, encryption, and access control protocols.</p>
              <p><strong>Disclaimer:</strong> Internet-based transmissions are never 100% secure. You acknowledge and accept the associated risks when sharing data online. Keep your login credentials confidential at all times.</p>
            </section>

            <section id="retention">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaClock className="text-yellow-600" /> 6. Data Retention and Deletion
              </h2>
              <p>You can request account deletion through the Platform settings or by contacting us.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Retain certain information to comply with legal obligations</li>
                <li>Delay deletion if services, claims, or grievances are pending</li>
                <li>Retain data to prevent fraud or misuse</li>
              </ul>
              <p>Once deleted, your account and associated information will not be recoverable.</p>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaUserCheck className="text-teal-600" /> 7. Your Rights
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Access and update your personal information</li>
                <li>Request data correction</li>
                <li>Withdraw previously granted consent (refer section 9)</li>
              </ul>
            </section>

            <section id="consent">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaEdit className="text-orange-600" /> 8. Consent
              </h2>
              <p>By accessing our Platform or submitting your information, you consent to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Collection, storage, processing, and sharing of your data as per this Privacy Policy</li>
                <li>Being contacted by us or our partners via SMS, call, email, or messaging apps</li>
              </ul>
              <p>If you are submitting someone else's information, you confirm you have their consent.</p>
              <p>You may withdraw your consent by writing to our Grievance Officer (details below). Mention “Withdrawal of consent for processing personal data” in the subject line. We may verify such requests before processing.</p>
              <p>Withdrawing consent may restrict your access to certain services.</p>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaSyncAlt className="text-blue-500" /> 9. Changes to This Privacy Policy
              </h2>
              <p>We reserve the right to modify this policy at any time to reflect changes in legal, regulatory, or business requirements. Check this page periodically for updates.</p>
              <p>We may notify you of significant changes, as required by law.</p>
            </section>

            <section id="grievance">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaUser className="text-purple-600" /> 10. Grievance Officer
              </h2>
              <p><strong>Name:</strong> Mr. Hasan<br />
                <strong>Designation:</strong> CEO & Director<br />
                <strong>Company:</strong> LZYCRAZY PRIVATE LIMITED<br />
                <strong>Address:</strong> Sector 29, Noida, India<br />
                <strong>Email:</strong> info@lzycrazy.com<br />
                <strong>Working Hours:</strong> Monday – Saturday (10:00 AM – 5:00 PM)
              </p>
            </section>

            <hr className="my-12 border-gray-300" />

            <section>
              <h2 className="text-3xl font-bold text-center mb-4">Refund & Cancellation Policy</h2>
              <p>1. Once services have been availed and payment has been successfully made through any of the available online payment methods, <strong>no cancellation or refund</strong> will be permitted.</p>
              <p className="mt-4">2. This policy is subject to revision at the discretion of LZYCRAZY PRIVATE LIMITED, without prior notice. You are advised to review the latest terms before availing services.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
