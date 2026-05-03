export default function Footer() {
  return (
    <footer className="bg-[#FEFEFF] px-6 md:px-[8vw] border-t border-navy/5 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-24 border-t border-navy/5 pt-16">
          <div className="flex flex-col gap-6">
            <h3 className="text-navy font-bold text-[18px]">Popular Guides</h3>
            <nav className="flex flex-col gap-4">
              {[
                "San Francisco 3-Day Itinerary",
                "London with Kids",
                "Kyoto 3-Day Itinerary",
                "Paris 5-Day Itinerary",
                "Japan 7-Day Itinerary",
                "Tokyo 5-Day Itinerary",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-navy/60 hover:text-terracotta transition-colors text-[15px] font-medium"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-6">
            <h3 className="text-navy font-bold text-[18px]">Platform</h3>
            <nav className="flex flex-col gap-4">
              {["Explore", "How it Works", "Pricing", "Wishlist"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-navy/60 hover:text-terracotta transition-colors text-[15px] font-medium"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-6">
            <h3 className="text-navy font-bold text-[18px]">Support</h3>
            <nav className="flex flex-col gap-4">
              {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-navy/60 hover:text-terracotta transition-colors text-[15px] font-medium"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t border-navy/5 flex flex-col md:flex-row justify-between items-center gap-4 text-navy/40 text-[13px] font-medium">
          <p>© {new Date().getFullYear()} NomadGo. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-terracotta transition-colors">Privacy</a>
            <a href="#" className="hover:text-terracotta transition-colors">Terms</a>
            <a href="#" className="hover:text-terracotta transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
