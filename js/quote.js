document.addEventListener('DOMContentLoaded', function () {
	// subtitles
	function changeSub(num) {
		document.getElementById("quotes").innerText = tell[num];
	}

	var tell = [
		"welcome to wither!",
        "witches brew ..",
        "ace attorney🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤🤤",
        "directed by 21 savage",
        "gatekeep ts :3",
        "myst.lat",
		"what do you think of roleplay?",
		"i dont like it very much.",
		"make it bounce!",
		"shoutout to my bff <3",
		":)",
		"bro js typin shit LMFAOOOOOOOO",
		"keep ts niche",
		"doki doki!",
		"fun fact: ts site was made in its own coding language",
		"im jk this site was written with html css and js",
		"you also stink like sewage. - pin bfdia 21",
		"youre a BURGERRRRRRRR LMFAOOOOO",
		"Welcome! Welcome to my garden of sloth!",
		"Welcome folks, ready for some giggles?",
		"Bored..! So bored...",
		"All that glitters belongs to ME!",
		"Hardships are meant to be shared.",
		"Yeah, i know she was so surprised.",
		"Really?",
		"Oh for SURE! I mean, it wasn't really big, just a little bug, but flower went CRAZY!",
		"fun fact: the creator of this site has a shrine of eternal sugar cookie from crk",
		"Let silence speak.",
		"for any hispanic people using this website, tu madre!!!!",
		"I will never, forget what i've done.",
		"Always pleased to meet new friends!",
		"ive spent 5 minutes writing nothing but cookie run kingdom and bfdi quotes on the quote.js file somebody save me",
		"i gently open the door..",
		"ELLIOT SCHANOK",
		"815 monique lane phonk",
		"also use truffled",
		"also use frogies arcade",
		"fmhy.net",
		"shoutout to bog he helped me with class of 09 on the site, thats my twin also"
	];

	var howmany = tell.length;
	var randomIndex = Math.floor(Math.random() * howmany);

	document.getElementById("quotes").innerText = tell[randomIndex];

	function changeSplash(num) {
		var sub = "Set current splash to splash " + num + ", " + tell[num];
		document.getElementById("quotes").innerText = tell[num];
		return sub;
	}
}
)