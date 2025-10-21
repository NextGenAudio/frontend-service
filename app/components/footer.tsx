"use client"

import { Music, Github, Twitter, Mail, Instagram, Facebook, Linkedin } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="bg-black/30 backdrop-blur-xl border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent text-white [text-shadow:_0_1px_5px_rgb(251_146_60_/_40%)]">
                SoneX 
              </span>
            </div>
            <p className="text-white leading-relaxed">
              The next generation music streaming platform with glassmorphism design and professional audio features.
            </p>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <span>🎵</span>
              <span>Crafted with passion for music lovers</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <div className="space-y-3">
              <a
                href="/player-home"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                Home
              </a>
              <a
                href="/profile"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                My Profile
              </a>
              <a
                href="/upload"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                Upload Music
              </a>
              <a
                href="/artist-request"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                Become an Artist
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Support</h4>
            <div className="space-y-3">
              <a
                href="#help"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                Help Center
              </a>
              <a
                href="#contact"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                Contact Us
              </a>
              <a
                href="#docs"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                Documentation
              </a>
              <a
                href="#faq"
                className="block text-white hover:text-orange-400 transition-colors hover:translate-x-1 transform duration-200"
              >
                FAQ
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Connect With Us</h4>
            <p className="text-white mb-4 text-sm">Follow us on social media for updates</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white text-sm">
              © 2025 SoneX. All rights reserved. Built with glassmorphism and love.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-white hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-white hover:text-orange-400 transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-white hover:text-orange-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
