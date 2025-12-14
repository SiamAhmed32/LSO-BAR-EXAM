import React from 'react';
import Link from 'next/link';
import Container from '@/components/shared/Container';
import Logo from '@/components/Navbar/Logo';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="bg-primaryText text-white">
			<Container>
				<div className="py-12 sm:py-16 md:py-20">
					{/* Main Footer Content */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
						{/* Company Info & Logo */}
						<div className="col-span-1">
							<Link href="/" className="inline-block mb-4">
								<Logo />
							</Link>
							<p className="text-sm text-gray-300 leading-relaxed mb-4">
								Quality, accessible bar exam prep materials aligned with the 2025-2026 LSO Barrister and Solicitor indexing materials.
							</p>
							{/* Social Links */}
							<div className="flex items-center gap-3 mt-6">
								<a
									href="#"
									aria-label="Facebook"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primaryColor flex items-center justify-center transition-colors"
								>
									<Facebook className="w-5 h-5" />
								</a>
								<a
									href="#"
									aria-label="Instagram"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primaryColor flex items-center justify-center transition-colors"
								>
									<Instagram className="w-5 h-5" />
								</a>
								<a
									href="#"
									aria-label="Twitter"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primaryColor flex items-center justify-center transition-colors"
								>
									<Twitter className="w-5 h-5" />
								</a>
								<a
									href="#"
									aria-label="LinkedIn"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primaryColor flex items-center justify-center transition-colors"
								>
									<Linkedin className="w-5 h-5" />
								</a>
							</div>
						</div>

						{/* Quick Links */}
						<div className="col-span-1">
							<h3 className="text-lg font-bold mb-4 text-secColor">Quick Links</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Practice Questions
									</Link>
								</li>
								<li>
									<Link
										href="/"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Exam Tutoring
									</Link>
								</li>
								<li>
									<Link
										href="/faq"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										FAQ
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Contact Us
									</Link>
								</li>
							</ul>
						</div>

						{/* Exam Resources */}
						<div className="col-span-1">
							<h3 className="text-lg font-bold mb-4 text-secColor">Exam Resources</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Free Mini Exams
									</Link>
								</li>
								<li>
									<Link
										href="/"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Barrister Exam Sets
									</Link>
								</li>
								<li>
									<Link
										href="/"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Solicitor Exam Sets
									</Link>
								</li>
								<li>
									<Link
										href="/"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										Professional Responsibility
									</Link>
								</li>
							</ul>
						</div>

						{/* Contact Info */}
						<div className="col-span-1">
							<h3 className="text-lg font-bold mb-4 text-secColor">Get in Touch</h3>
							<ul className="space-y-4">
								<li className="flex items-start gap-3">
									<Mail className="w-5 h-5 text-secColor mt-0.5 flex-shrink-0" />
									<a
										href="mailto:support@lsbarexam.com"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										support@lsbarexam.com
									</a>
								</li>
								<li className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-secColor mt-0.5 flex-shrink-0" />
									<a
										href="tel:+15551234567"
										className="text-sm text-gray-300 hover:text-secColor transition-colors"
									>
										+1 (555) 123-4567
									</a>
								</li>
								<li className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-secColor mt-0.5 flex-shrink-0" />
									<span className="text-sm text-gray-300">
										Ontario, Canada
									</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="border-t border-gray-700 pt-6 sm:pt-8">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							{/* Copyright */}
							<p className="text-sm text-gray-400 text-center sm:text-left">
								© {new Date().getFullYear()} LSO Bar Exam. All rights reserved.
							</p>

							{/* Legal Links */}
							<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
								<Link
									href="/privacy-policy"
									className="text-sm text-gray-400 hover:text-secColor transition-colors"
								>
									Privacy Policy
								</Link>
								<Link
									href="/terms-of-service"
									className="text-sm text-gray-400 hover:text-secColor transition-colors"
								>
									Terms of Service
								</Link>
								<Link
									href="/cookie-policy"
									className="text-sm text-gray-400 hover:text-secColor transition-colors"
								>
									Cookie Policy
								</Link>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
