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
		"i still think this is ass, the worst site ive seen in months, just being honest - mongolixzq in the tn discord",
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
		"shoutout to bog he helped me with class of 09 on the site, thats my twin also",
		"(715) 390-0424",
		"if you see this, on the game page press the up arrow key twice",
		"fun fact: the creator of this site is a huge fan of pinkpantheress, explaining one of the links being pinkpantheress.top",
		"if u see this do ur classwork bro get them grades up",
		"best site btw",
		"hotline miami 👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀",
		"'i hope you get jumped' - aubrey",
		"'robert shut the fuck up you piece of shit faggot' - violet",
		"'slit your wrists and show me on camera' - deborah",
		"'hes looking for fresh meat. stop being friends with him' - violet",
		"'robert is a plebian bitchlet who deserved to get aborted' - violet",
		"'robert is a fucking manwhore' - violet",
		"deborah: Ok tranny deborah: Girl wannabe deborah: Gender crosser deborah: Faggot deborah: Nipple sucker (all of these are chat logs from a whatsapp gc of someone harassing me bc i used to be trans)",
		"all of the quotes with actual people in there have said those things ab me btw, i just added them on here bc i thought ts was the funniest coping mechanism oat"
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
