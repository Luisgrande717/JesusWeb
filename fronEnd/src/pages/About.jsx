const About = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-primary-100">
            Bringing transparency and trust to auto maintenance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              We started AutoMaintenance with a simple mission: to eliminate the anxiety and uncertainty
              that comes with car repairs. We understand how stressful it can be to leave your vehicle
              at a shop, wondering what's really happening to it.
            </p>
            <p className="text-gray-600 mb-4">
              That's why we built a platform that keeps you connected to your car's repair journey
              every step of the way. With real-time updates, photo documentation, and transparent
              pricing, you're always in the know.
            </p>
            <p className="text-gray-600">
              Our team of certified mechanics has over 50 years of combined experience, and we're
              passionate about providing honest, high-quality service that you can trust.
            </p>
          </div>

          <div className="bg-gray-100 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold mb-1">Transparency First</h4>
                  <p className="text-gray-600 text-sm">We believe in complete openness about our work and pricing</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold mb-1">Quality Service</h4>
                  <p className="text-gray-600 text-sm">Every repair is done to the highest standards</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold mb-1">Customer Focus</h4>
                  <p className="text-gray-600 text-sm">Your satisfaction and peace of mind are our top priorities</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold mb-1">Innovation</h4>
                  <p className="text-gray-600 text-sm">We use technology to make auto repair better for everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary-50 rounded-xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2000+</div>
              <div className="text-gray-600">Repairs Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
