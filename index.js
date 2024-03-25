// Keyword feature
import fs from "fs";

// Initialise keywordDB if it does not exist
if (!fs.existsSync("./plugins/keyword-manager/keywordDB.json")) {
	fs.writeFileSync("./plugins/keyword-manager/keywordDB.json", "{}", "utf8");
}

// Load keywordDB from file
let keywordDB = JSON.parse(
	fs.readFileSync("./plugins/keyword-manager/keywordDB.json", "utf8")
);

export function processKeyword(msg) {
	if (msg.content.startsWith("/add")) {
		addKeyword(msg);
	} else if (msg.content.startsWith("/edit")) {
		editKeyword(msg);
	} else if (msg.content.startsWith("/remove")) {
		removeKeyword(msg);
	} else if (msg.content.startsWith("/list")) {
		listKeywords(msg);
	} else {
		// Echo stored keywords' contents
		const keyword = msg.content;
		if (keywordDB[keyword]) {
			msg.replyText(keywordDB[keyword].content);
		}
	}
}

function addKeyword(msg) {
	// msg.content = "/add newKeyword::New Content That Is Pretty Long::Category"
	const keyword = msg.content.split("::")[0].split(" ")[1];
	const content = msg.content.split("::")[1];
	const category = msg.content.split("::")[2] || "unsorted";
    const categoryLowerCase = category.toLowerCase();
	if (!keywordDB[keyword]) {
		keywordDB[keyword] = { content, category: categoryLowerCase };
		fs.writeFileSync(
			"./plugins/keyword-manager/keywordDB.json",
			JSON.stringify(keywordDB, null, 2),
			"utf8"
		);
		msg.replyText(`${keyword} has been added with category ${categoryLowerCase}`);
	} else {
		msg.replyText(`${keyword} already exists`);
	}

	// Reload keywordDB from file
	keywordDB = JSON.parse(
		fs.readFileSync("./plugins/keyword-manager/keywordDB.json", "utf8")
	);
}

function editKeyword(msg) {
	// msg.content = "/add newKeyword::New Content That Is Pretty Long::Category"
	const keyword = msg.content.split("::")[0].split(" ")[1];
	const content = msg.content.split("::")[1];
	const category = msg.content.split("::")[2] || "unsorted";
    const categoryLowerCase = category.toLowerCase();
    console.log(categoryLowerCase);
	if (keywordDB[keyword]) {
		keywordDB[keyword] = { content, category: categoryLowerCase };
		fs.writeFileSync(
			"./plugins/keyword-manager/keywordDB.json",
			JSON.stringify(keywordDB, null, 2),
			"utf8"
		);
		msg.replyText(
			`${keyword} has been updated with category ${categoryLowerCase}`
		);
	} else {
		msg.replyText(`${keyword} does not exist`);
	}

	// Reload keywordDB from file
	keywordDB = JSON.parse(
		fs.readFileSync("./plugins/keyword-manager/keywordDB.json", "utf8")
	);
}

function removeKeyword(msg) {
	// msg.content = "/remove keyword"
	const keyword = msg.content.split(" ")[1];
	if (keywordDB[keyword]) {
		delete keywordDB[keyword];
		fs.writeFileSync(
			"./plugins/keyword-manager/keywordDB.json",
			JSON.stringify(keywordDB, null, 2),
			"utf8"
		);
		msg.replyText(`${keyword} has been removed`);
	} else {
		msg.replyText(`${keyword} does not exist`);
	}

	// Reload keywordDB from file
	keywordDB = JSON.parse(
		fs.readFileSync("./plugins/keyword-manager/keywordDB.json", "utf8")
	);
}

function listKeywords(msg) {
	// Sample JSON : { "keyword": { "content": "content", "category": "category" }
	const keywordDB = JSON.parse(
		fs.readFileSync("./plugins/keyword-manager/keywordDB.json", "utf8")
	);
	const categories = {};

	Object.keys(keywordDB).forEach((keyword) => {
		const { category } = keywordDB[keyword];
		if (!categories[category]) {
			categories[category] = [];
		}
		categories[category].push(keyword);
	});

	const sortedCategories = Object.keys(categories).sort(); // Sort categories alphabetically

	let replyMessage = "Keyword List\n\n" + '\u200b'.repeat(500);
	sortedCategories.forEach((category) => {
		replyMessage += `# ${category.charAt(0).toUpperCase() + category.slice(1)} : \n${categories[category].join("\n")}\n\n`;
	});

	msg.replyText(replyMessage);
}
