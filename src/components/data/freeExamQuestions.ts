export type FreeQuestionOption = {
	id: string;
	text: string;
};

export type FreeQuestion = {
	id: number;
	category: string;
	text: string;
	options: FreeQuestionOption[];
};

export const barristerFreeQuestions: FreeQuestion[] = [
	{
		id: 1,
		category: 'Civil Litigation',
		text:
			'Milan, a civil litigator, recently filed a statement of claim on behalf of his client. After filing, he realizes he may have included an error in the damages calculation that could potentially expose him to a professional liability claim if the matter proceeds further. Milan believes the mistake is minor and unlikely to affect the outcome. What should he do?',
		options: [
			{ id: 'a', text: 'Do nothing because the error is minor and unlikely to lead to a claim.' },
			{ id: 'b', text: 'Notify his client of the error and let the client decide whether to report to the insurer.' },
			{ id: 'c', text: 'Promptly notify his professional liability insurer.' },
			{ id: 'd', text: 'Correct the error in future filings without reporting it.' },
		],
	},
	{
		id: 2,
		category: 'Professional Responsibility',
		text:
			'A lawyer learns that a client has provided inaccurate financial disclosure in an ongoing civil matter. The client insists that the lawyer continue without correcting the record. What must the lawyer do?',
		options: [
			{ id: 'a', text: 'Continue acting but warn the client about perjury.' },
			{ id: 'b', text: 'Withdraw and avoid informing the court.' },
			{ id: 'c', text: 'Advise the client to correct the record and, if refused, seek to withdraw.' },
			{ id: 'd', text: 'Disclose the inaccuracy to the court immediately without consulting the client.' },
		],
	},
	{
		id: 3,
		category: 'Criminal Procedure',
		text:
			'A duty counsel lawyer receives a Crown disclosure package containing privileged defence notes in error. What should the lawyer do first?',
		options: [
			{ id: 'a', text: 'Read the notes to understand the Crown case.' },
			{ id: 'b', text: 'Return the notes and notify the Crown promptly.' },
			{ id: 'c', text: 'Keep the notes but ignore them at trial.' },
			{ id: 'd', text: 'File the notes with the court as an exhibit.' },
		],
	},
	{
		id: 4,
		category: 'Family Law',
		text:
			'During a custody dispute, a client tells their lawyer they intend to relocate the child without notice. What is the lawyer’s best course of action?',
		options: [
			{ id: 'a', text: 'Advise against relocation and explain legal risks; decline to assist if they persist.' },
			{ id: 'b', text: 'Assist with relocation to maintain client loyalty.' },
			{ id: 'c', text: 'Notify the other parent immediately.' },
			{ id: 'd', text: 'File an urgent motion without consulting the client.' },
		],
	},
	{
		id: 5,
		category: 'Ethics',
		text:
			'A lawyer is offered tickets to a major sporting event by opposing counsel during settlement negotiations. What should the lawyer do?',
		options: [
			{ id: 'a', text: 'Accept the tickets to maintain goodwill.' },
			{ id: 'b', text: 'Decline the tickets to avoid any perception of compromised integrity.' },
			{ id: 'c', text: 'Accept only if the value is under a nominal threshold.' },
			{ id: 'd', text: 'Ask the client if accepting is permissible.' },
		],
	},
	{
		id: 6,
		category: 'Civil Procedure',
		text:
			'Opposing counsel serves materials after the deadline set in a timetable. What is the appropriate response?',
		options: [
			{ id: 'a', text: 'Ignore the materials entirely.' },
			{ id: 'b', text: 'Serve a reply and note the delay for costs or scheduling purposes.' },
			{ id: 'c', text: 'Immediately bring a contempt motion.' },
			{ id: 'd', text: 'Return the materials unread.' },
		],
	},
	{
		id: 7,
		category: 'Evidence',
		text:
			'A client wants to tender a document that appears to be altered. What must the lawyer do?',
		options: [
			{ id: 'a', text: 'Use the document if it helps the case.' },
			{ id: 'b', text: 'Advise the client about authenticity concerns and refuse to use it if integrity is doubtful.' },
			{ id: 'c', text: 'Let the court decide without comment.' },
			{ id: 'd', text: 'Destroy the document.' },
		],
	},
	{
		id: 8,
		category: 'Professional Responsibility',
		text:
			'A lawyer receives confidential information from a prospective client, but the lawyer cannot take the retainer. Later, a different client has adverse interests. What should the lawyer do?',
		options: [
			{ id: 'a', text: 'Act for the new client because no retainer was signed.' },
			{ id: 'b', text: 'Act for the new client but screen the prior information.' },
			{ id: 'c', text: 'Decline the new client if confidential information could be relevant.' },
			{ id: 'd', text: 'Sell the conflict waiver to the highest bidder.' },
		],
	},
	{
		id: 9,
		category: 'Criminal Law',
		text:
			'A client insists on giving evidence that the lawyer believes will be false. What should the lawyer do?',
		options: [
			{ id: 'a', text: 'Allow the client to testify in narrative and avoid eliciting the falsehood.' },
			{ id: 'b', text: 'Elicit the testimony as usual to protect the client’s interests.' },
			{ id: 'c', text: 'Disclose the anticipated falsehood to the court immediately.' },
			{ id: 'd', text: 'Withdraw without further action.' },
		],
	},
	{
		id: 10,
		category: 'Practice Management',
		text:
			'A lawyer’s trust account shows a small unexplained surplus after a matter concludes. What should the lawyer do?',
		options: [
			{ id: 'a', text: 'Transfer the surplus to the general account as miscellaneous revenue.' },
			{ id: 'b', text: 'Investigate, attempt to return to the client, and follow trust rules for unclaimed funds.' },
			{ id: 'c', text: 'Donate the surplus to charity without documentation.' },
			{ id: 'd', text: 'Ignore it because the amount is minor.' },
		],
	},
];

export const solicitorFreeQuestions: FreeQuestion[] = barristerFreeQuestions.map((q) => ({
	...q,
	category: q.category === 'Civil Litigation' ? 'Solicitor Practice' : q.category,
}));

