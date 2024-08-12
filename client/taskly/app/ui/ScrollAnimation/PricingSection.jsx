const PricingCard = ({ title, price, features, isPopular }) => (
  <div
    className={`bg-white rounded-lg shadow-lg p-6 ${
      isPopular ? "border-2 border-blue-500" : ""
    }`}
  >
    {isPopular && (
      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-3xl font-bold mb-6">
      ${price}
      <span className="text-sm font-normal">/month</span>
    </p>
    <ul className="mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-2">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button
      disabled={true}
      className={`w-full py-2 px-4 rounded ${
        isPopular ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
      } font-semibold hover:bg-opacity-90 transition duration-300`}
    >
      Coming Soon
    </button>
  </div>
);

const PricingSection = () => {
  const plans = [
    {
      title: "Basic",
      price: 9,
      features: ["1 workspace", "10 projects", "Basic support"],
      isPopular: false,
    },
    {
      title: "Pro",
      price: 19,
      features: [
        "5 workspaces",
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
      ],
      isPopular: true,
    },
    {
      title: "Enterprise",
      price: 49,
      features: [
        "Unlimited workspaces",
        "Unlimited projects",
        "Dedicated support",
        "Custom integrations",
      ],
      isPopular: false,
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Choose Your Plan
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
