export default function Footer() {
    return (

        <footer className="bg-gradient-to-r from-slate-800 to-slate-700 text-white mt-16">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-green-400">HealthCare Pro</h3>
                        <p className="text-slate-300 mb-4">
                            Your trusted partner in health and wellness. Providing innovative healthcare solutions with cutting-edge technology and compassionate care.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-400">Services</h3>
                        <div className="space-y-2">
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">AI Health Plans</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Nurse Tracking</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Emergency Response</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Telemedicine</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Health Monitoring</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-400">Support</h3>
                        <div className="space-y-2">
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Help Center</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Contact Us</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Terms of Service</a>
                            <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">FAQ</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-400">Contact Info</h3>
                        <div className="space-y-2 text-slate-300">
                            <p><i className="fas fa-phone w-4"></i> +91 98765 43210</p>
                            <p><i className="fas fa-envelope w-4"></i> support@healthcarepro.com</p>
                            <p><i className="fas fa-map-marker-alt w-4"></i> 123 Health Street, Ahmedabad, Gujarat</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-600 mt-8 pt-8 text-center text-slate-400">
                    <p>&copy; 2025 HealthCare Pro. All rights reserved. Made with ❤ for better health.</p>
                </div>
            </div>
        </footer>
    );
}