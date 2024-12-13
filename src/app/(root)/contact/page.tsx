export default function Contact() {
  return (
    <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-12rem)] bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-4xl font-bold text-red-500 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Reach out to us for any queries, reservations, or feedback. We&apos;d love to hear from you!
      </p>
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        {/* Address */}
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-4">📍</span>
          <p className="text-gray-700 text-lg font-medium">
            123 Madani Evenue, Dhaka, BD
          </p>
        </div>

        {/* Phone Number */}
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-4">📞</span>
          <p className="text-gray-700 text-lg font-medium">+880 1456-7890</p>
        </div>

        {/* Email */}
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-4">✉️</span>
          <p className="text-gray-700 text-lg font-medium">
            contact@masimmo.com
          </p>
        </div>

        {/* Hours */}
        <div className="flex items-start">
          <span className="text-red-500 text-2xl mr-4">⏰</span>
          <div>
            <p className="text-gray-700 text-lg font-medium mb-1">
              Operating Hours:
            </p>
            <p className="text-gray-600">Monday - Friday: 11:00 AM - 10:00 PM</p>
            <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
