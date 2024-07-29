const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

// new Email(user, url).sendWelcome();
module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.name = user.name.split(' ')[0];
		this.url = url;
		this.from = `Yousef Hadder <${process.env.MAILTRAP_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: process.env.MAIL_USERNAME,
					pass: process.env.MAIL_PASSWORD,
					clientId: process.env.OAUTH_CLIENTID,
					clientSecret: process.env.OAUTH_CLIENT_SECRET,
					refreshToken: process.env.OAUTH_REFRESH_TOKEN,
				},
			});
		}
		// Using mailtrap for development
		return nodemailer.createTransport({
			host: process.env.MAILTRAP_HOST,
			port: process.env.MAILTRAP_PORT,
			auth: {
				user: process.env.MAILTRAP_USERNAME,
				pass: process.env.MAILTRAP_PASSWORD,
			},
		});
	}

	async sendEmail(template, subject) {
		// 1) Render the HTML email pug template
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				firstName: this.name,
				url: this.url,
				subject,
			},
		);
		// 2) Define the email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: subject,
			html,
			text: convert(html),
		};

		// 3) Create a transporter and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.sendEmail('welcome', 'Welcome to the Natours family!');
	}

	async sendPasswordReset() {
		await this.sendEmail(
			'passwordReset',
			'Your password reset token (valid for 10 minutes)',
		);
	}
};
