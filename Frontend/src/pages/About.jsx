import React from "react";
import {
  Target,
  Lightbulb,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  Palette,
} from "lucide-react";
import logo from "../assets/logo.png";

const BiocratAboutPage = () => {
  const coreValues = [
    {
      title: "Innovation",
      description:
        "We encourage creative thinking and the development of novel solutions to challenges in biotechnology.",
      icon: <Lightbulb className="w-8 h-8" />,
    },
    {
      title: "Collaboration",
      description:
        "We believe in the power of teamwork and interdisciplinary collaboration to achieve common goals.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Excellence",
      description:
        "We are committed to maintaining high standards in all our activities and projects.",
      icon: <Award className="w-8 h-8" />,
    },
    {
      title: "Learning",
      description:
        "We foster a culture of continuous learning and professional development among our members.",
      icon: <Target className="w-8 h-8" />,
    },
    {
      title: "Impact",
      description:
        "We aim to make a positive impact on the biotechnology field and society through our initiatives.",
      icon: <TrendingUp className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-800">
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">

          {/* History Section */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
                    Our Journey
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Our History
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Founded in 2018, Biocrats Club began as a collective of
                  motivated IIT Indore students from the Biosciences and
                  Biomedical Engineering community. What started as a small
                  initiative has grown into a vibrant interdisciplinary platform
                  that brings together biology, engineering, and technology
                  under one umbrella.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Over the years, the club has hosted a wide range of workshops,
                  seminars, and competitions, encouraging collaboration across
                  diverse academic backgrounds. Driven by curiosity and
                  innovation, Biocrats Club continues to foster excellence and
                  create meaningful impact within the academic ecosystem and
                  beyond.
                </p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwA-ucNHARD-w3eHuHF4InRTGhQ2Gjt_v5GpEl0pDCa3BWOs1bv1ts6pxYhbF0Kkn3oZhmooYJmkpaFVr1kfdbz-B6yCNl3Bh334CByaVo9ft5PCBE9CiGqtMIAxs4jL47qVxLP0Oz-mmcG59MT0RXw9sdJrUHXC72HC0HogH7C9weN1Vi5YzL69IKGu3ECQBrNZ0GkyoIzpe_cQRxdntcwm5u8HxI_Ta8Mu7WtPzRQZI9HcVCaS-9ExumiuR1vn4c1259AA71uJnV"
                  alt="Biocrats History"
                  loading="lazy"
                  className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl transform group-hover:scale-[1.02] transition duration-300"
                />
              </div>
            </div>
          </div>

          {/* Logo Credit Section - Redesigned */}
          <div className="mb-24 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="flex items-center gap-3">
                  
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                    Visual Identity
                  </span>
                </div>
                <div className="prose prose-slate lg:prose-lg max-w-none">
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-200 pl-4">
                    "Where engineering ingenuity meets biological innovation:
                    Presenting the Official Logo of the Biocrats Club, IIT
                    Indore!"
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    This logo beautifully captures the essence of the
                    Biocrats Club, IIT Indore, symbolizing the union of biology
                    and technology. The DNA helix at the center reflects the
                    core of life sciences, while the surrounding icons represent
                    the diverse fields of biomedical engineering and
                    biosciences—spanning from computational biology and
                    microscopy to molecular chemistry and healthcare innovation.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    It is a testament to interdisciplinary collaboration and a
                    commitment to advancing science for a better tomorrow.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-md">
                    🌱🔬✨ Logo Credit: Nandini S. (MTech in Biomedical Engineering)
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <img
                    src={logo}
                    alt="Official Biocrats Logo"
                    loading="lazy"
                    className="absolute inset-8 w-48 h-48 md:w-64 md:h-64 object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative group lg:order-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByaVbab5I8S3S2U4HPtAkmFNnBF9GfqNfhKmBaJcCZVCtvfopUGvXVzNwC-_Lnhvq4ihjfA7Zkdho-ceuxthkLKvGNvpR9KWMD2mDcc1pslnVFi1rC8xSikgW7k0bq3HnyAxvnkPFWMnDM75ugL4vQRhGSd3r6P7TFhT-_hvldq0bhVJhEtq_Jfaxn4rlg1aGMgZdVmBzQowD_kcjt7RM4q2-xR2LDaj0gcBjKVnCMlzzH3ZH0UdQm30i2wE_fyjHQRvCZ3oLabdyy"
                  alt="Biocrats Vision"
                  loading="lazy"
                  className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl transform group-hover:scale-[1.02] transition duration-300"
                />
              </div>

              <div className="space-y-6 lg:order-2">
                <div className="inline-block">
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
                    Our Direction
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Vision & Mission
                </h2>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Vision
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    To be a leading student-led interdisciplinary club in India,
                    driving research, innovation, and learning in biosciences
                    and biomedical engineering.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-l-4 border-indigo-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Mission
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    To provide a platform for students to explore and engage
                    with biotechnology through workshops, seminars, projects,
                    and competitions. We strive to foster a collaborative and
                    innovative environment, encouraging continuous skill
                    development and meaningful contributions to the field.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
                Our Foundation
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
                Core Values
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What Makes Us Unique */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="relative text-center max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  What Sets Us Apart
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Makes Us Unique
              </h2>

              <p className="text-xl leading-relaxed text-blue-50 mb-8">
                Biocrats Club stands out due to our focus on hands-on learning
                and practical application of biotechnology concepts. Our
                projects and workshops are designed to provide students with
                real-world experience, preparing them for future careers in the
                field.
              </p>

              <p className="text-xl leading-relaxed text-blue-50">
                We emphasize networking and collaboration, connecting students
                with industry professionals and researchers to build lasting
                relationships and opportunities.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BiocratAboutPage;