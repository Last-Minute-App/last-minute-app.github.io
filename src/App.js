import { useState } from "react";
import "@/App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Bell, Tag, TrendingDown, Users, Store, Smartphone } from "lucide-react";

function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    alert("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">LocalDeals</div>
          <div className="hidden md:flex gap-6">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="https://last-minute-app.github.io/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
          </div>
          <div className="flex gap-2">
            <Button data-testid="nav-download-btn">Download App</Button>
            <Button asChild variant="outline" data-testid="nav-dashboard-btn">
              <a href="https://last-minute-app.github.io/dashboard">Dashboard</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4" data-testid="hero-section">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Discover Local Deals
                <span className="block text-primary">In Real-Time</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with nearby merchants offering time-limited discounts. Save money while supporting local businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg" data-testid="hero-appstore-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg" data-testid="hero-playstore-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm text-muted-foreground">Local Merchants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$2M+</div>
                  <div className="text-sm text-muted-foreground">Saved</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBtYXJrZXRwbGFjZXxlbnwwfHx8fDE3Nzk1MzI5NzN8MA&ixlib=rb-4.1.0&q=85" 
                alt="Mobile marketplace app"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-muted/30" data-testid="features-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose LocalDeals?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to save money and discover amazing local offers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="feature-location">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Location-Based Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automatically find deals from merchants within your chosen radius. No more missing out on nearby offers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="feature-realtime">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Real-Time Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get instant access to time-sensitive deals. Merchants can push last-minute discounts to fill capacity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="feature-notifications">
              <CardHeader>
                <Bell className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Smart Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Receive personalized alerts for deals matching your preferences. Never miss a great opportunity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="feature-savings">
              <CardHeader>
                <TrendingDown className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Maximum Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Save up to 70% on local services and products. Track your total savings over time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="feature-merchants">
              <CardHeader>
                <Store className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Verified Merchants</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All merchants are verified and rated by our community. Shop with confidence.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="feature-easy">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Easy Redemption</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  One-tap redemption with QR codes. Simple, fast, and secure transactions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4" data-testid="how-it-works-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Start saving in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4" data-testid="step-1">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-2xl font-semibold">Download & Sign Up</h3>
              <p className="text-muted-foreground">
                Get the app from App Store or Google Play. Create your free account in seconds.
              </p>
            </div>
            <div className="text-center space-y-4" data-testid="step-2">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-2xl font-semibold">Browse Local Deals</h3>
              <p className="text-muted-foreground">
                Explore offers from nearby merchants. Filter by category, distance, and discount amount.
              </p>
            </div>
            <div className="text-center space-y-4" data-testid="step-3">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-2xl font-semibold">Redeem & Save</h3>
              <p className="text-muted-foreground">
                Show your QR code at checkout and enjoy instant savings. It's that simple!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 px-4 bg-muted/30" data-testid="screenshots-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground">A glimpse of our beautiful and intuitive interface</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f" 
                alt="App screenshot 1"
                className="rounded-xl shadow-lg w-full"
              />
              <p className="text-center font-medium">Browse Local Deals</p>
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1601972602237-8c79241e468b" 
                alt="App screenshot 2"
                className="rounded-xl shadow-lg w-full"
              />
              <p className="text-center font-medium">View Offer Details</p>
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1609921141835-710b7fa6e438" 
                alt="App screenshot 3"
                className="rounded-xl shadow-lg w-full"
              />
              <p className="text-center font-medium">Track Your Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4" data-testid="testimonials-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">Join thousands of happy savers and merchants</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card data-testid="testimonial-1">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  "I've saved over $500 in just two months! The real-time notifications are perfect for catching last-minute deals near my office."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    SM
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Martinez</div>
                    <div className="text-sm text-muted-foreground">Regular User</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="testimonial-2">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  "As a restaurant owner, this app helped me fill empty tables during slow hours. It's a win-win for everyone!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    JC
                  </div>
                  <div>
                    <div className="font-semibold">James Chen</div>
                    <div className="text-sm text-muted-foreground">Restaurant Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="testimonial-3">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  "Love discovering new local businesses through the app. The location feature makes it so convenient!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    EP
                  </div>
                  <div>
                    <div className="font-semibold">Emily Parker</div>
                    <div className="text-sm text-muted-foreground">Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-muted/30" data-testid="pricing-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card data-testid="pricing-consumer">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">For Consumers</CardTitle>
                <div className="text-4xl font-bold mt-4">Free</div>
                <CardDescription>Forever</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Unlimited deal browsing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Real-time notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Location-based search
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Savings tracker
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    No hidden fees
                  </li>
                </ul>
                <Button className="w-full mt-6" data-testid="pricing-consumer-btn">Download Now</Button>
              </CardContent>
            </Card>

            <Card className="border-primary border-2 relative" data-testid="pricing-merchant-basic">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <CardHeader>
                <Store className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Basic Merchant</CardTitle>
                <div className="text-4xl font-bold mt-4">$49</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Up to 50 deals/month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Real-time deal posting
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Analytics dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Customer insights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Email support
                  </li>
                </ul>
                <Button className="w-full mt-6" data-testid="pricing-basic-btn">Get Started</Button>
              </CardContent>
            </Card>

            <Card data-testid="pricing-merchant-pro">
              <CardHeader>
                <Tag className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Pro Merchant</CardTitle>
                <div className="text-4xl font-bold mt-4">$99</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Unlimited deals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Priority placement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Priority support
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" data-testid="pricing-pro-btn">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4" data-testid="faq-section">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" data-testid="faq-1">
              <AccordionTrigger className="text-left">How does LocalDeals work?</AccordionTrigger>
              <AccordionContent>
                LocalDeals connects you with nearby merchants offering time-limited discounts. Simply download the app, enable location services, and browse deals in your area. When you find an offer you like, tap to redeem and show the QR code at checkout.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" data-testid="faq-2">
              <AccordionTrigger className="text-left">Is the app really free for consumers?</AccordionTrigger>
              <AccordionContent>
                Yes! LocalDeals is 100% free for consumers. There are no subscription fees, hidden charges, or transaction fees. We make money by charging merchants a small monthly subscription to post deals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" data-testid="faq-3">
              <AccordionTrigger className="text-left">How do I redeem a deal?</AccordionTrigger>
              <AccordionContent>
                Redemption is simple! Once you find a deal you want, tap the "Redeem" button in the app. A unique QR code will be generated. Show this code to the merchant at checkout, and they'll scan it to apply your discount instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" data-testid="faq-4">
              <AccordionTrigger className="text-left">Can I save deals for later?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can save any deal to your favorites list. However, keep in mind that many deals are time-sensitive, so we recommend redeeming them before they expire. You'll receive notifications if a saved deal is about to expire.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" data-testid="faq-5">
              <AccordionTrigger className="text-left">I'm a merchant. How do I get started?</AccordionTrigger>
              <AccordionContent>
                Getting started is easy! Sign up for a merchant account through the app or our website. Choose your plan (Basic or Pro), verify your business, and you can start posting deals immediately. Our team will guide you through the setup process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" data-testid="faq-6">
              <AccordionTrigger className="text-left">What types of businesses can use LocalDeals?</AccordionTrigger>
              <AccordionContent>
                Any local business with physical locations can use LocalDeals! This includes restaurants, cafes, retail stores, salons, fitness centers, entertainment venues, and service providers. If you have unused capacity or inventory you'd like to sell at a discount, LocalDeals is perfect for you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section with Contact Form */}
      <section className="py-16 px-4 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to Start Saving?</h2>
              <p className="text-xl opacity-90">
                Join thousands of users discovering amazing local deals every day. Download now and get your first deal!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="text-lg" data-testid="cta-appstore-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
                </Button>
                <Button size="lg" variant="secondary" className="text-lg" data-testid="cta-playstore-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
                </Button>
              </div>
            </div>

            <Card className="bg-white text-foreground" data-testid="contact-form">
              <CardHeader>
                <CardTitle className="text-2xl">Get In Touch</CardTitle>
                <CardDescription>Have questions? We'd love to hear from you.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <Input 
                      type="email" 
                      placeholder="Your Email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <Textarea 
                      placeholder="Your Message" 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      data-testid="contact-message-input"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="contact-submit-btn">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted" data-testid="footer">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">LocalDeals</div>
              <p className="text-muted-foreground">
                Connecting consumers with local merchants through time-limited discounts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
                <li><a href="https://last-minute-app.github.io/dashboard" className="hover:text-primary">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>© 2025 LocalDeals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
