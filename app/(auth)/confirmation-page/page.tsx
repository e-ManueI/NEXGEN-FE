"use client";
import { Brain, Rocket, Zap } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFacebookF,
//   faXTwitter,
//   faInstagram,
// } from "@fortawesome/free-brands-svg-icons";

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br bg-[url('/pattern-bg.svg')] from-blue-50/50 to-white bg-cover bg-no-repeat">
      <header className="container mx-auto px-4 py-6">
        <div className="text-brand-dark font-lato text-2xl font-bold">
          NEXGEN
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col items-center px-4 py-12 text-center">
        {/* Headline */}
        <h1 className="text-brand-dark font-lato max-w-3xl text-3xl font-bold sm:text-4xl md:text-5xl">
          Thank you for submitting your samples to NexGen AI for analysis
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-base text-gray-600 sm:text-lg">
          Because this is an early iteration of the model, we are processing
          your results and will inform you via email within 24 hours when the
          results are ready. Thanks for your patience.
        </p>

        {/* Trusted Badge */}
        <div className="text-brand bg-brand/10 mt-8 rounded-full px-4 py-2 text-sm font-medium">
          Trusted by over 1000+ adopters
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3 md:gap-8">
          {/* Card 1: Intelligent Automation */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-baseline gap-4">
              <div className="bg-brand/10 text-brand mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Intelligent Automation
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur. Ut justo dictumst dolor
              in. Lectus sed viverra non commodo diam. Arcu nullam amet enim
              purus semper commodo diam. In risus gravida amet id non.
            </p>
          </div>

          {/* Card 2: Predictive Intelligence */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-baseline gap-4">
              <div className="text-brand bg-brand/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Predictive Intelligence
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur. Ut justo dictumst dolor
              in. Lectus sed viverra non commodo diam. Arcu nullam amet enim
              purus semper commodo diam. In risus gravida amet id non.
            </p>
          </div>

          {/* Card 3: Seamless Experience */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-baseline gap-4">
              <div className="text-brand bg-brand/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Seamless Experience
              </h3>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur. Ut justo dictumst dolor
              in. Lectus sed viverra non commodo diam. Arcu nullam amet enim
              purus semper commodo diam. In risus gravida amet id non.
            </p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-12 flex gap-4">
          {/* TODO: Add social media icons if needed */}
          {/* <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
          >
            <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
          </a> */}
        </div>
      </main>
    </div>
  );
}
