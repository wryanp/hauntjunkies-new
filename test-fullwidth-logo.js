import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 0;">
				<img src="https://hauntjunkies.com/mccloudmanor-logo.jpg" alt="McCloud Manor" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto;" />
			</td>
		</tr>
		<tr>
			<td align="center" style="padding: 20px 20px 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #fffffe; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
					<tr>
						<td style="padding: 40px; text-align: center;">
							<h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #000001;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0; font-size: 16px; color: #666666;">We're excited to terrify you at McCloud Manor.</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;

const { data, error } = await resend.emails.send({
	from: 'Haunt Junkies <noreply@hauntjunkies.com>',
	to: ['vilonte1@gmail.com'],
	subject: '🎃 Full Width Logo Test',
	html
});

if (error) console.error('Error:', error);
else console.log('✅ Sent! Email ID:', data.id);
