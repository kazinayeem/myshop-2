import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to our store – your go-to destination for quality products,
          unbeatable prices, and exceptional service. We&apos;re here to make
          shopping simple, personal, and enjoyable.
        </p>
      </div>

      {/* Company Story */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <Image
          src="/about-us.jpg"
          alt="Our Story"
          width={600}
          height={400}
          className="rounded-xl shadow-md object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Journey
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Started in 2023, our eCommerce platform was built on a passion for
            innovation and convenience. What began as a small startup has now
            grown into a trusted marketplace, loved by thousands of happy
            customers.
          </p>
          <p className="text-gray-600 mt-4">
            We believe shopping should be fun, seamless, and tailored to your
            needs.
          </p>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="bg-gray-100 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Our Mission
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <Image
              src="/icons/quality.png"
              alt="Quality"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-gray-700">Top Quality</h3>
            <p className="text-gray-600 text-sm mt-2">
              We carefully curate the best products from around the world for
              you.
            </p>
          </div>
          <div className="p-4">
            <Image
              src="/icons/support.png"
              alt="Support"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-gray-700">
              Customer Support
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Our team is here 24/7 to make your experience smooth and
              enjoyable.
            </p>
          </div>
          <div className="p-4">
            <Image
              src="/icons/fast-delivery.png"
              alt="Delivery"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-gray-700">
              Fast Delivery
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Speedy and secure shipping so your products reach you in no time.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Join Thousands of Happy Shoppers
        </h2>
        <p className="text-gray-600 mb-6">
          Explore our collections and discover what makes us different.
        </p>
        <Link
          href="/product"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
