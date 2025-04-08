import "./css/PrivacyPolicy.css";
import Header from "../components/Header";
const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="container">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date: April 11, 2025</strong>
        </p>

        <section>
          <h2>1. What Information We Collect</h2>
          <p>
            When you use CINENICHE, we may collect the following types of
            personal data:
          </p>
          <ul>
            <li>
              <strong>Personal Information</strong>: When you sign up, we may
              collect your name, email address, and other contact details.
            </li>
            <li>
              <strong>Usage Data</strong>: We collect information on how you
              interact with our platform, such as movies you watch or search
              for.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies</strong>: We use cookies
              to improve user experience, store preferences, and analyze website
              traffic.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Data</h2>
          <p>
            We only process your data for specific and lawful purposes,
            including:
          </p>
          <ul>
            <li>To provide and personalize our movie streaming service.</li>
            <li>To manage user accounts and preferences.</li>
            <li>
              To communicate with you about updates, content, or changes to our
              service.
            </li>
            <li>
              To improve the performance, functionality, and security of our
              website and application.
            </li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2>3. Legal Basis for Processing</h2>
          <p>
            Under the GDPR, we rely on the following legal bases to process your
            personal data:
          </p>
          <ul>
            <li>
              <strong>Consent</strong>: For optional cookies and marketing
              communications.
            </li>
            <li>
              <strong>Contract</strong>: When processing is necessary to fulfill
              our service agreement with you.
            </li>
            <li>
              <strong>Legitimate Interests</strong>: To improve our service and
              prevent fraud.
            </li>
            <li>
              <strong>Legal Obligation</strong>: When required to comply with
              applicable laws.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>We use cookies to:</p>
          <ul>
            <li>1. Keep you logged in.</li>
            <li>2. Store your user preferences.</li>
            <li>3. Analyze site traffic and usage patterns.</li>
          </ul>
          <p>
            You can manage your cookie preferences through your browser
            settings. Optional cookies (e.g., for analytics) will only be set
            with your consent.
          </p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to
            fulfill the purposes for which it was collected, including any
            legal, accounting, or reporting requirements.
          </p>
        </section>

        <section>
          <h2>6. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information. We may share data
            with trusted service providers who assist us in operating our
            service, only under strict data processing agreements.
          </p>
          <p>
            We may also share data if required by law or to protect our legal
            rights.
          </p>
        </section>

        <section>
          <h2>7. Your Rights Under GDPR</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data ("right to be forgotten").</li>
            <li>Object to or restrict certain data processing.</li>
            <li>Withdraw consent at any time.</li>
            <li>Lodge a complaint with a data protection authority.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <strong>[insert contact email]</strong>.
          </p>
        </section>

        <section>
          <h2>8. Data Security</h2>
          <p>
            We take appropriate technical and organizational measures to protect
            your data, including encryption, access control, and regular
            security audits.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Significant
            changes will be communicated on our website or through email
            notification.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have questions or concerns about this policy or how we handle
            your data, contact:
          </p>
          <p>
            <strong>CINENICHE Data Protection Officer</strong>
          </p>
          <p>
            Email: <strong>Cineniche@support.com</strong>
          </p>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
