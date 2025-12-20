'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/shared/Container';
import SectionHeading from '@/components/shared/SectionHeading';
import { useRouter } from 'next/navigation';
import { examApi } from '@/lib/api/examApi';

interface FreeExamPageProps {
	examType: 'barrister' | 'solicitor';
	examTitle: string;
	/**
	 * Optional explicit path to navigate to after accepting terms.
	 * If not provided, defaults to the free exam start route.
	 */
	startPath?: string;
	/**
	 * Whether this is a paid exam (default: false for free exams)
	 */
	isPaid?: boolean;
	/**
	 * Exam ID for paid exams (e.g., "barrister-set-a", "solicitor-set-b")
	 * Used to fetch duration from metadata
	 */
	examId?: string;
}

const FreeExamPage: React.FC<FreeExamPageProps> = ({
	examType,
	examTitle,
	startPath,
	isPaid = false,
	examId,
}) => {
	const router = useRouter();
	const [hasAgreed, setHasAgreed] = useState(false);
	const [isCheckingProgress, setIsCheckingProgress] = useState(true);
	const [examDuration, setExamDuration] = useState<string | null>(null);
	const [isLoadingDuration, setIsLoadingDuration] = useState(false);
	const [questionCount, setQuestionCount] = useState<number | null>(null);
	const [attemptCount, setAttemptCount] = useState<number | null>(null);

	// Check if exam is in progress - if so, skip terms and go directly to exam
	useEffect(() => {
		if (typeof window === "undefined") {
			setIsCheckingProgress(false);
			return;
		}

		// Generate possible storage keys
		const normalizedTitle = examTitle.toLowerCase().replace(/\s+/g, "-");
		const possibleKeys = [
			`free-exam-${normalizedTitle}`, // Exact match: "free-exam-barrister-exam-set-a" or "free-exam-solicitor-sample-exam"
		];
		
		// For free exams only: check both "Sample Exam" and "Free Exam" variations
		// because terms page uses "Sample Exam" but exam runner uses "Free Exam"
		// Paid exams don't need this variation check
		if (normalizedTitle.includes("sample")) {
			possibleKeys.push(`free-exam-${normalizedTitle.replace("sample", "free")}`); // "free-exam-solicitor-free-exam"
		} else if (normalizedTitle.includes("free") && !normalizedTitle.includes("set")) {
			// Only add sample variation for free exams (not paid exams with "set-a" or "set-b")
			possibleKeys.push(`free-exam-${normalizedTitle.replace("free", "sample")}`); // "free-exam-solicitor-sample-exam"
		}
		
		console.log("🔍 Checking for exam progress with keys:", possibleKeys);
		
		// Check all possible storage keys
		for (const storageKey of possibleKeys) {
			const examProgressRaw = localStorage.getItem(storageKey);
			
			if (examProgressRaw) {
				try {
					// Validate that it's actual exam progress data (has answers, bookmarks, or currentIndex)
					const examProgress = JSON.parse(examProgressRaw);
					const hasValidProgress = examProgress && (
						(examProgress.answers && Object.keys(examProgress.answers).length > 0) ||
						(examProgress.bookmarked && examProgress.bookmarked.length > 0) ||
						(typeof examProgress.currentIndex === 'number' && examProgress.currentIndex >= 0)
					);
					
					if (hasValidProgress) {
						// Exam is in progress - skip terms page and go directly to exam
						console.log("📝 Exam in progress detected, skipping terms page...", { storageKey, examTitle });
						const targetPath = startPath || `/${examType}-free-exam/start`;
						router.push(targetPath);
						return;
					} else {
						console.log("⚠️ Found localStorage key but no valid progress data:", { storageKey, examProgress });
					}
				} catch (error) {
					// Invalid JSON, ignore it
					console.log("⚠️ Invalid JSON in localStorage key:", { storageKey, error });
				}
			}
		}

		// Exam is not in progress (either finished or never started)
		// Show terms page
		console.log("✅ No exam progress found, showing terms page");
		setIsCheckingProgress(false);
	}, [examTitle, startPath, examType, router]);

	// Fetch exam metadata (duration, question count, attempt count) for paid exams
	useEffect(() => {
		if (isPaid && examId && !isCheckingProgress) {
			setIsLoadingDuration(true);
			examApi.getExamMetadata()
				.then((metadata) => {
					const examMeta = metadata[examId];
					if (examMeta) {
						if (examMeta.examTime) {
							setExamDuration(examMeta.examTime);
						}
						if (examMeta.questionCount !== undefined) {
							setQuestionCount(examMeta.questionCount);
						}
						if (examMeta.attemptCount !== undefined) {
							setAttemptCount(examMeta.attemptCount);
						}
					}
				})
				.catch((error) => {
					console.error("Failed to load exam metadata:", error);
				})
				.finally(() => {
					setIsLoadingDuration(false);
				});
		}
	}, [isPaid, examId, isCheckingProgress]);

	const handleAgree = () => {
		setHasAgreed(true);

		// If a custom target path is provided (e.g., for paid exams), use it.
		// Otherwise fall back to the default free exam start route.
		const targetPath = startPath || `/${examType}-free-exam/start`;
		router.push(targetPath);
	};

	// Show loading state while checking exam progress
	if (isCheckingProgress) {
		return (
			<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
				<Container>
					<div className="flex flex-col items-center justify-center min-h-[60vh]">
						<div className="relative mb-6">
							<div className="w-16 h-16 border-4 border-primaryColor/20 rounded-full"></div>
							<div className="absolute top-0 left-0 w-16 h-16 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
						</div>
						<p className="text-primaryText font-medium text-lg">Loading...</p>
					</div>
				</Container>
			</section>
		);
	}

	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
			<Container>
				<div className="max-w-4xl mx-auto">
					{/* Page Heading */}
					<div className="text-center mb-8 sm:mb-12">
						<SectionHeading className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-primaryText">
							{examTitle}
						</SectionHeading>
					</div>

					{/* Copyright Notice Section */}
					<div className="mb-8 sm:mb-12">
						<div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4 sm:mb-6">
								COPYRIGHT NOTICE
							</h2>
							<div className="space-y-4 text-primaryText text-sm sm:text-base leading-relaxed">
								<p>
									All material on{' '}
									<a
										href="https://www.lsobarexam.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primaryColor hover:underline font-semibold"
									>
										https://www.lsobarexam.com
									</a>{' '}
									is copyrighted and the property of LSO Bar Exam. This includes:
								</p>
								<ul className="list-disc list-inside space-y-2 ml-4">
									<li>All practice questions; and</li>
									<li>All solutions to the practice questions</li>
								</ul>
								<p>
									By taking this exam, you agree that you will not take any screenshots, photos,
									or otherwise engage in the unauthorized reproduction, dissemination, copying or
									other unauthorized use of any material on{' '}
									<a
										href="https://www.lsobarexam.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primaryColor hover:underline font-semibold"
									>
										https://www.lsobarexam.com
									</a>
									. <strong>ANYONE WHO ENGAGES IN SUCH CONDUCT WILL BE PURSUED TO THE FULLEST EXTENT OF THE LAW.</strong> As someone who is hoping to enter into the legal profession, you are highly advised not to breach copyright laws.
								</p>
							</div>
						</div>
					</div>

					{/* Exam Information Section */}
					<div className="mb-8 sm:mb-12">
						<div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4 sm:mb-6">
								EXAM INFORMATION
							</h2>
							<div className="space-y-4 text-primaryText text-sm sm:text-base leading-relaxed">
								{isPaid ? (
									// Paid Exam Information
									<>
										<div>
											<h3 className="text-lg font-semibold text-primaryText mb-2">
												Duration
											</h3>
											<p>
												{isLoadingDuration ? (
													<span className="text-primaryText/60">Loading...</span>
												) : examDuration ? (
													<span className="font-medium">This exam has a time limit of <strong>{examDuration}</strong>.</span>
												) : (
													<span className="text-primaryText/60">Duration information not available.</span>
												)}
											</p>
											<p className="mt-2 text-primaryText/80">
												The timer will start when you begin the exam and will continue running even if you navigate away from the exam page or close your browser. The exam will automatically submit when the time limit expires.
											</p>
										</div>
										{questionCount !== null && questionCount > 0 && (
											<div>
												<h3 className="text-lg font-semibold text-primaryText mb-2">
													Number of Questions
												</h3>
												<p>
													<span className="font-medium">This exam contains <strong>{questionCount} question{questionCount !== 1 ? 's' : ''}</strong>.</span>
												</p>
											</div>
										)}
										<div>
											<h3 className="text-lg font-semibold text-primaryText mb-2">
												Attempt Limits
											</h3>
											<p>
												{attemptCount !== null && attemptCount > 0 ? (
													<span className="font-medium">You have a maximum of <strong>{attemptCount === 1 ? 'one (1)' : attemptCount === 2 ? 'two (2)' : `${attemptCount}`} attempt{attemptCount > 1 ? 's' : ''}</strong> to complete this exam.</span>
												) : (
													<span className="font-medium">You have a maximum of <strong>two (2) attempts</strong> to complete this exam.</span>
												)}
											</p>
											<ul className="list-disc list-inside space-y-1 mt-2 ml-4">
												<li>An attempt is counted when you click "Finish Test" or when the exam timer expires</li>
												<li>Starting an exam and navigating away without finishing does not count as a completed attempt</li>
												<li>You can review your results after each completed attempt</li>
												{attemptCount !== null && attemptCount > 0 && (
													<li>Once you have used all {attemptCount} attempt{attemptCount > 1 ? 's' : ''}, you will no longer be able to access the exam questions</li>
												)}
											</ul>
										</div>
										<div>
											<h3 className="text-lg font-semibold text-primaryText mb-2">
												Exam Progress and Resumption
											</h3>
											<p>
												Your progress, including selected answers and bookmarked questions, is automatically saved as you proceed through the exam. You can leave the exam and return to it at any time within the same attempt, and your progress will be restored. However, <strong>the timer continues to run in the background</strong>. Once an exam is finished (either by submitting or by time expiry), you must start a new attempt if you wish to retake it (up to the maximum attempt limit).
											</p>
										</div>
									</>
								) : (
									// Free Exam Information
									<>
										<div>
											<h3 className="text-lg font-semibold text-primaryText mb-2">
												Duration
											</h3>
											<p>
												<span className="font-medium">This is a <strong>free practice exam with no time limit</strong>.</span> You can take as much time as you need to complete all questions.
											</p>
										</div>
										<div>
											<h3 className="text-lg font-semibold text-primaryText mb-2">
												Attempts
											</h3>
											<p>
												<span className="font-medium">You can take this exam <strong>as many times as you like</strong>.</span> There are no restrictions on the number of attempts.
											</p>
										</div>
										<div>
											<h3 className="text-lg font-semibold text-primaryText mb-2">
												Exam Progress
											</h3>
											<p>
												Your progress, including selected answers and bookmarked questions, is automatically saved. You can leave the exam and return to it at any time, and your progress will be restored. Since there is no timer, you can take breaks as needed without any time constraints.
											</p>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Disclaimer Section */}
					<div className="mb-8 sm:mb-12">
						<div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4 sm:mb-6">
								DISCLAIMER
							</h2>
							<div className="space-y-4 text-primaryText text-sm sm:text-base leading-relaxed">
								<p>
									LSO Bar Exam is not affiliated with the Law Society of Ontario. While we
									used our best efforts in creating these questions, we do not guarantee their
									accuracy. We will not be responsible for any actual or potential negative impact
									that these questions may have on your bar exam performance.
								</p>
							</div>
						</div>
					</div>

					{/* Agree Button */}
					<div className="text-center">
						<button
							onClick={handleAgree}
							disabled={hasAgreed}
							className="px-8 py-4 cursor-pointer bg-primaryColor text-white font-semibold text-base sm:text-lg rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{hasAgreed ? 'Terms Accepted' : 'I Agree To These Terms'}
						</button>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default FreeExamPage;

