// initialize variable
let carsList

fetch("http://localhost:3000/api/cars", {
	method: "GET",
	headers: {
		"x-api-key": "secret_phrase_here",
		"Content-Type": "application/json",
		Accept: "application/json",
	},
})
	.then((res) => {
		if (!res.ok) {
			console.log("your API isn't working !!!")
		}
		res.json().then((data) => {
			console.log(data)
			carsList = data // Mise à jour de la liste des voitures avec les données récupérées
			writeDom()  // APRÈS que les données aient été récupérées 
		})
	})
	.catch((error) =>
		console.error("Erreur lors de la récupération des voitures :", error)
	)
	
function writeDom() {
	carsList.forEach((game) => {
		const articleContainer = document.querySelector(".row");
		articleContainer.innerHTML += `<article class="col">
							<div class="card shadow-sm">
								<img src="${game.carImage}" alt="${game.carName}" class="card-img-top" />

								<div class="card-body">
									<h3 class="card-title">${game.carName}</h3>
									<p class="card-text">
										${game.carYear}
									</p>
									<div
										class="d-flex justify-content-between align-items-center"
									>
										<div class="btn-group">
											<button
												type="button"
												class="btn btn-sm btn-outline-secondary view"
												data-bs-toggle="modal" data-bs-target="#exampleModal"
												data-view-id="${game.id}"
											>
												View
											</button>
											<button
												type="button"
												class="btn btn-sm btn-outline-secondary edit"
												data-bs-toggle="modal" data-bs-target="#exampleModal"
												data-edit-id="${game.id}"
											>
												Edit
											</button>
										</div>
									</div>
								</div>
							</div>
						</article>`;
	});
}

writeDom();

// Gestion des boutons Edit
let editButtons = document.querySelectorAll(".edit");
editButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		editModal(e.target.getAttribute("data-edit-id"));
	});
});

// Gestion des boutons View
let viewButtons = document.querySelectorAll(".view");
viewButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		viewModal(e.target.getAttribute("data-view-id"));
	});
});


function modifyModal(modalTitle, modalBody) {
	// Écrire le nom du jeu dans le titre du modal
	document.querySelector(".modal-title").textContent = modalTitle
	// Écrire dans le corps du modal
	document.querySelector(".modal-body").innerHTML = modalBody
	// Écrire dans le footer
	document.querySelector(".modal-footer").innerHTML = `
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
			Close
		</button>
		<button type="submit" data-bs-dismiss="modal" class="btn btn-primary">Submit</button>
</form>`
}
function viewModal(gameId) {
	// console.log(gameId, carsList)
	// Trouvez le jeu en fonction de son identifiant
	const result = carsList.findIndex((game) => game.id === parseInt(gameId))
	// passer une image comme corps du modal
	const modalBody = `<img src="${carsList[result].imageUrl}" alt="${carsList[result].title}" class="img-fluid" />`
	modifyModal(carsList[result].title, modalBody)
	// edit footer
	// Écrire dans le footer
	document.querySelector(".modal-footer").innerHTML = `
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
			Close
		</button>
</form>`
}
function editModal(gameId) {
	// Trouvez le jeu en fonction de son identifiant
	const result = carsList.findIndex((game) => game.id === parseInt(gameId))
	// Injectez le formulaire dans le corps du modal
	fetch("./form.html").then((data) => {
		data.text().then((form) => {
			// Modifiez le titre et le corps du modal
			const selectedGame = carsList[result]
			modifyModal("Mode Edition", form)
			modifyFom({
				title: selectedGame.title,
				year: selectedGame.year,
				imageUrl: selectedGame.imageUrl,
			})
			document
			.querySelector('button[type="submit"]')
			.addEventListener("click", () => updateGames(title.value, year.value, imageUrl.value, gameId))
		})
		
	})
}
function modifyFom(gameData) {
	const form = document.querySelector("form")
	form.title.value = gameData.title
	form.year.value = gameData.year
	form.imageUrl.value = gameData.imageUrl
}
function updateGames(title, year, imageUrl, gameId) {
	// Trouvez le jeu en fonction de son identifiant
	const index = carsList.findIndex((game) => game.id === parseInt(gameId));

	// Mettez à jour les données du jeu
	carsList[index].title = title;
	carsList[index].year = year;
	carsList[index].imageUrl = imageUrl;

	// Réinitialisez le contenu HTML
	document.querySelector(".row").innerHTML = ""; // Supprimez les anciens articles du DOM.
	writeDom(); // Réinsérez les articles mis à jour.

	// Réinitialisez les gestionnaires pour les boutons Edit
	editButtons = document.querySelectorAll(".edit");
	editButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			editModal(e.target.getAttribute("data-edit-id"));
		});
	});

	// Réinitialisez les gestionnaires pour les boutons View
	viewButtons = document.querySelectorAll(".view");
	viewButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			viewModal(e.target.getAttribute("data-view-id"));
		});
	});
}
