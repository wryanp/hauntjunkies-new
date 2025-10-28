// Test script to verify font rendering in emails
// Run with: node test-email-font.js

const testHTML = `
<!DOCTYPE html>
<html>
<head>
	<style>
		@font-face {
			font-family: 'Karma';
			src: url('data:font/truetype;charset=utf-8;base64,${require('fs').readFileSync('./static/fonts/Karma-FreeVersion.ttf', 'base64')}') format('truetype');
			font-weight: normal;
			font-style: normal;
		}
		body {
			font-family: Arial, sans-serif;
			padding: 20px;
			background: #f4f4f4;
		}
		.test-karma {
			font-family: 'Karma', 'Palatino Linotype', 'Book Antiqua', Palatino, 'Times New Roman', Georgia, serif;
			font-size: 48px;
			color: #a41214;
			margin: 20px 0;
		}
		.test-normal {
			font-family: Arial, sans-serif;
			font-size: 24px;
			margin: 20px 0;
		}
	</style>
</head>
<body>
	<h1>Font Test Email</h1>
	<div class="test-karma">
		<p>Testing Karma Font:</p>
		<p>HAUNT JUNKIES</p>
		<p>McCloud Manor</p>
		<p>LLLLLLL (seven L's)</p>
		<p>The quick brown fox jumps over the lazy dog</p>
		<p>1234567890</p>
	</div>
	<div class="test-normal">
		<p>Testing Arial (fallback):</p>
		<p>HAUNT JUNKIES</p>
		<p>McCloud Manor</p>
		<p>LLLLLLL (seven L's)</p>
	</div>
	<hr>
	<p>If you can see all seven L's in both fonts above, the font is working correctly.</p>
</body>
</html>
`;

console.log("Test HTML generated. Send this via Resend to test font rendering.");
console.log("\nTo test, you can:");
console.log("1. Save this HTML to a file and open in browser");
console.log("2. Send via your email service");
console.log("3. Check if all L characters render correctly");
console.log("\nHTML length:", testHTML.length, "characters");
