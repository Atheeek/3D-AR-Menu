import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowRight, 
  FiSmartphone, 
  FiBox, 
  FiZap, 
  FiEye, 
  FiTrendingUp, 
  FiUsers,
  FiCheckCircle,
  FiStar
} from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob [animation-delay:2s]"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10">
        
        {/* --- Navigation --- */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link 
                href="/" 
                className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent hover:scale-105 transition-transform"
              >
                AR Menu
              </Link>
              <Link
                href="/admin/login"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold text-sm text-slate-950 overflow-hidden transition-all hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105"
              >
                <span className="relative z-10">Restaurant Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>
        </nav>

        {/* --- Hero Section --- */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8 animate-fadeInUp">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm">
                <FiStar className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">The Future of Restaurant Menus</span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="block text-white">See Your Menu.</span>
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Taste the Future.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Transform your dining experience with <span className="text-amber-400 font-semibold">interactive 3D models</span> of your dishes, viewable in stunning Augmented Reality—right at the table.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link
                  href="/admin/login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-lg text-slate-950 overflow-hidden transition-all hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-bold text-lg text-white hover:bg-white/10 transition-all w-full sm:w-auto">
                  Watch Demo
                </button>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                  <span>No app required</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                  <span>Setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                  <span>Free trial included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  3x
                </div>
                <div className="text-gray-400">Higher Engagement</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  45%
                </div>
                <div className="text-gray-400">Faster Decisions</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  2.5x
                </div>
                <div className="text-gray-400">Order Value Increase</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Section header */}
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Why Choose <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AR Menu?</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Cutting-edge technology meets seamless user experience
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Feature 1 */}
              <div className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiSmartphone className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Immersive AR Experience</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Customers scan a QR code and instantly see lifelike 3D models of your food on their table—no app download required. Works on any smartphone browser.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiBox className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Easy Menu Management</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Update menu items, prices, descriptions, and photos in real-time with our intuitive dashboard. Changes reflect instantly across all tables.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Boost Sales & Engagement</h3>
                  <p className="text-gray-400 leading-relaxed">
                    3D visualization helps customers make confident decisions faster, reduces ordering errors by 40%, and increases average order value.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiEye className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Visual Storytelling</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Showcase portion sizes, ingredients, and presentation details that photos alone can't capture. Let customers explore dishes from every angle.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Customer Analytics</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Track which dishes get the most views, interaction time, and conversions. Make data-driven decisions about your menu offerings.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiZap className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Instant Setup</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Go live in under 10 minutes. Upload your menu, generate QR codes, and start impressing customers immediately. No technical skills required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- How It Works --- */}
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Simple as <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">1-2-3</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Get started in minutes, not hours
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              
              {/* Connecting lines for desktop */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"></div>

              {/* Step 1 */}
              <div className="relative text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-slate-950 text-2xl font-black relative z-10">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white">Upload Your Menu</h3>
                <p className="text-gray-400 leading-relaxed">
                  Add your dishes, descriptions, and let us handle the 3D model generation automatically.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-slate-950 text-2xl font-black relative z-10">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white">Generate QR Codes</h3>
                <p className="text-gray-400 leading-relaxed">
                  Download unique QR codes for each table or print them on your existing menu cards.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-slate-950 text-2xl font-black relative z-10">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white">Watch Orders Grow</h3>
                <p className="text-gray-400 leading-relaxed">
                  Customers scan, explore in AR, and order with confidence. Track your analytics in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Social Proof / Testimonials --- */}
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Loved by <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Restaurants</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join hundreds of restaurants already using AR Menu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Testimonial 1 */}
              <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  "Our customers absolutely love seeing the dishes in 3D before ordering. Sales have increased by 35% since we started using AR Menu."
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-bold text-white">Sarah Johnson</div>
                  <div className="text-sm text-gray-400">Owner, The Garden Bistro</div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  "Setup was incredibly easy. Within 15 minutes we had our entire menu live with 3D models. The dashboard is intuitive and powerful."
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-bold text-white">Michael Chen</div>
                  <div className="text-sm text-gray-400">Manager, Fusion Delights</div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  "This technology sets us apart from competitors. Customers are taking photos and sharing on social media—free marketing!"
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-bold text-white">Priya Patel</div>
                  <div className="text-sm text-gray-400">Chef & Owner, Spice Avenue</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Ready to Transform Your <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Dining Experience?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join the future of restaurant menus. Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/admin/login"
                className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-xl text-slate-950 overflow-hidden transition-all hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free Trial
                  <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <button className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-bold text-xl text-white hover:bg-white/10 transition-all w-full sm:w-auto">
                Schedule Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-400" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <Link 
                  href="/" 
                  className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
                >
                  AR Menu
                </Link>
                <p className="text-gray-400 text-sm mt-2">
                  Transforming dining experiences with AR technology
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
                <Link href="#" className="hover:text-amber-400 transition-colors">Features</Link>
                <Link href="#" className="hover:text-amber-400 transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-amber-400 transition-colors">About</Link>
                <Link href="#" className="hover:text-amber-400 transition-colors">Contact</Link>
                <Link href="#" className="hover:text-amber-400 transition-colors">Support</Link>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} AR Menu Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
