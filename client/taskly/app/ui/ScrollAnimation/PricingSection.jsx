import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Switcher from "../app/MainMenu/settings/Switcher";

const calculateMonthlyPrice = (annualPrice) => {
  return Math.round((annualPrice / 12) * 100) / 100;
};

const PricingCard = ({
  title,
  price,
  annualPrice,
  features,
  notIncluded,
  isPopular,
  index,
}) => {
  const [isAnnual, setIsAnnual] = useState(title === "Pro");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const monthlySavings = Math.round(price * 12 - annualPrice);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 0, y: 50 });
  }, [controls]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const renderPricing = () => {
    if (price === 0) {
      return (
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-dominant mb-2">Free</p>
          <p className="text-sm text-text">No credit card required</p>
        </div>
      );
    }

    const displayPrice = isAnnual ? calculateMonthlyPrice(annualPrice) : price;

    return (
      <div className="mb-8 space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-dominant mb-2">
            ${displayPrice}
            <span className="text-lg font-normal text-text ml-2">/month</span>
          </p>
          {title !== "Enterprise" && title !== "Basic" && (
            <div className="flex justify-center items-center mt-2">
              <span
                className={`mr-2 ${isAnnual ? "text-gray-400" : "text-text"}`}
              >
                Monthly
              </span>
              <Switcher
                isChecked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
                className="mx-2"
              />
              <span
                className={`ml-2 ${isAnnual ? "text-text" : "text-gray-400"}`}
              >
                Annual
              </span>
            </div>
          )}
          {isAnnual && annualPrice < price * 12 && (
            <p className="text-sm text-text leading-relaxed mt-2">
              billed annually (${annualPrice}/year - save ${monthlySavings})
              {title === "Enterprise" && (
                <span className="block">per member</span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className={`bg-primary gradient-border rounded-xl shadow-xl p-8 flex flex-col ${
        isPopular ? "border-4 border-dominant" : ""
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: "transform 0.3s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {isPopular && (
        <span className="bg-dominant text-white px-2 py-2 rounded-full text-base text-center font-semibold mb-4 inline-block">
          Most Recommanded
        </span>
      )}
      <h3 className="text-2xl font-bold mb-8 text-text">{title}</h3>
      {renderPricing()}
      <ul className="mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-base text-text">
            <svg
              className="w-5 h-5 mr-3 text-dominant flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {notIncluded && (
        <ul className="mb-8 space-y-4">
          {notIncluded.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-base text-gray-400"
            >
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto">
        <Link href="/auth/login">
          <div
            disabled={title !== "Free"}
            className={` w-full py-3 px-6 rounded-lg text-base w-fullt text-center  ${
              isPopular ? "bg-dominant text-text" : "bg-gray-200 text-gray-800"
            } font-semibold hover:bg-opacity-90 transition duration-300 mt-auto`}
          >
            {title !== "Free" ? "Coming Soon" : "Join the beta!"}
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

const PricingSection = () => {
  const plans = [
    {
      title: "Free",
      price: 0,
      annualPrice: 0,
      features: [
        "2 workspaces",
        "Basic task management",
        "Limited storage (100MB)",
      ],
      notIncluded: [
        "Collaboration features",
        "Advanced customizations",
        "Integrations",
        "AI-powered features",
      ],
      isPopular: false,
    },
    {
      title: "Basic",
      price: 2.99,
      annualPrice: 35.88,
      features: [
        "Everything in Free",
        "5 workspaces",
        "Recurring tasks",
        "Advanced customizations",
        "1 integration",
      ],
      notIncluded: [
        "Collaboration features",
        "Notes",
        "AI-powered features",
        "Priority support",
      ],
      isPopular: false,
    },
    {
      title: "Pro",
      price: 8.99,
      annualPrice: 89.99,
      features: [
        "Everything in Basic",
        "10 workspaces",
        "Notes",
        "3 collaborators",
        "2 integrations",
        "Advanced AI-Powered features (20 requests/hour)",
        "Priority support",
        "Refer a friend and earn AI credits",
      ],
      notIncluded: ["Real-time comments"],
      isPopular: true,
    },
    {
      title: "Enterprise",
      price: 19.99,
      annualPrice: 159.99,
      features: [
        "Everything in Pro",
        "Unlimited workspaces",
        "Unlimited collaborations",
        "Unlimited integrations",
        "Unlimited AI features",
        "Real-time comments",
        "Custom onboarding",
        "99.9% uptime SLA",
        "Advanced analytics",
        "SAML SSO",
        "API access",
        "Really fast Support",
      ],
      isPopular: false,
    },
  ];

  const titleControls = useAnimation();

  useEffect(() => {
    titleControls.start({ opacity: 1, y: 0 });
  }, [titleControls]);

  return (
    <section id="pricing" className="px-4 py-24 md:px-8 w-full">
      <motion.h2
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-3xl lg:text-5xl font-bold text-center mb-16 text-text"
      >
        Choose Your Plan
      </motion.h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} index={index} />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
