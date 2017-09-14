module.exports = function(siteName) {
	return `
		<header class="header">
			<strong class="main-logo">
				<a href="home.html">
					<img src="../images/webpack-logo.png" alt="${siteName}" />
				</a>
			</strong>
			<nav>
				<ul class="main-nav">
					<li><a href="home.html">Home</a></li>
					<li><a href="about.html">About</a></li>
					<li><a href="contact.html">Contact</a></li>
				</ul>
			</nav>
		</header>
	`;
};