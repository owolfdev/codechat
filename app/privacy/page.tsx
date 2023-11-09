// "use client";

import React from "react";
import ReactMarkdown from "react-markdown";

let markdown = ``;

function About() {
  return (
    <div className="flex flex-col sm:gap-4 gap-6 max-w-3xl w-full pt-10 pb-24 px-4">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <ReactMarkdown className="text-lg sm:text-base flex flex-col sm:gap-4 gap-6">
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default About;

markdown = `
Last Updated: Fri Nov 10, 2023

**1. Introduction**

Welcome to CodeChat ("we," "our," or "us"). At CodeChat, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, website, and related services (collectively referred to as the "Service").

By accessing or using the Service, you agree to this Privacy Policy. If you do not agree with our practices, please do not use the Service.

**2. Information We Collect**

a. **Information You Provide:** When you sign up for an account, use the Service, or communicate with us, you may provide us with personal information, including but not limited to your name, email address, profile picture, and any other information you choose to share.

b. **Code Snippets and Conversations:** CodeChat may collect and store the code snippets and conversations you share on the platform.

c. **Device Information:** We may collect information about the device you use to access the Service, including device type, operating system, unique device identifiers, and mobile network information.

**3. How We Use Your Information**

a. **To Provide and Improve the Service:** We use your information to deliver, maintain, and enhance the Service, including troubleshooting, data analysis, and research to improve our features and user experience.

b. **Communication:** We may use your contact information to communicate with you about the Service, updates, and promotional offers. You can opt-out of promotional communications at any time.

c. **Security:** We use your information to monitor and enhance the security of our Service, prevent fraud, and ensure compliance with our Terms of Service.

**4. Sharing Your Information**

a. **With Other Users:** Code snippets and conversations you share on the Service will be visible to other users you communicate with.

b. **Third-Party Service Providers:** We may share your information with third-party service providers who assist us in providing the Service, such as hosting, data analytics, and customer support.

c. **Legal Compliance:** We may disclose your information if required by law, to protect our rights, or to respond to legal requests, including law enforcement and government authorities.

**5. Data Retention**

We will retain your personal information for as long as necessary to provide the Service and as required by applicable laws. You may request the deletion of your account and associated data by contacting us at [contact@email.com].

**6. Security**

We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.

**7. Your Choices**

You can access, update, or delete your account information by logging into your account settings. You may also contact us to exercise your rights related to your personal data.

**8. Changes to this Privacy Policy**

We may update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to periodically review this Privacy Policy for any updates.

**9. Contact Us**

If you have questions or concerns about this Privacy Policy or our data practices, please contact us at [contact@email.com].

By using CodeChat, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.`;
