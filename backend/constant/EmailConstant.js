const getOptionMailForUserOnboarding = (name, email) => {
	const mailOptions = {
		from: 'info@wedeazzy.com',
		to: email,
		subject: `Let’s Plan Your Perfect Wedding with Wedeazzy !! 💍`,
		text: `Dear ${name},

Congratulations on your journey toward a beautiful wedding! 🎉 We’re thrilled to have you join Wedeazzy, your ultimate partner in planning the wedding of your dreams.

From stunning venues to trusted vendors, we’ve got everything you need to make your big day unforgettable. Here’s how to get started:

Explore Top Venues and Vendors:
Browse through our curated list of venues and vendors tailored to your preferences.

Save Your Favorites:
Use our platform to bookmark venues and vendors you love for easy access later.

Plan Together:
Both of you can log in, share ideas, and make decisions seamlessly.

Book with Confidence:
Connect directly with your favorite vendors or venues and secure your dates hassle-free.

If you have any questions or need help navigating the platform, our support team is just an email away at [support@wedeazzy.com] or reach us directly via chat on the website.

Wishing you love, laughter, and seamless wedding planning!
Warm regards,
The Wedeazzy Team`, 
	};
	return mailOptions;
}

module.exports = getOptionMailForUserOnboarding;