const socket = io();

socket.on("sendProducts", (products) => {
	updateProductsList(products);
});

const updateProductsList = (products) => {
	const $container = document.getElementById("listProducts");

	$container.innerHTML = "";

	products.forEach((prod) => {
		const div = document.createElement("div");
		div.innerHTML += `<div>
    <h3>${prod.title}</h3>
    <p>${prod.description}</p>
    <p>${prod.price}</p>
    <div id="thumbnail"></div>
    <p>${prod.code}</p>
    <p>${prod.stock}</p>
    </div>
    `;

		const $thumbnail = div.querySelector("#thumbnail");

		prod.thumbnail.forEach((img) => {
			$thumbnail.innerHTML += `<img src="${img}" alt="thumbnail" />`;
		});
		$container.appendChild(div);
	});
};

const form = document.getElementById("formPost");
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	try {
		const target = e.target;
		const { title, description, stock, price, thumbnail, code } = target;

		const thumbnailArray = thumbnail.value.split(" ");

		console.log(thumbnailArray);

		const newProduct = {
			title: title.value,
			description: description.value,
			stock: parseInt(stock.value),
			price: parseInt(price.value),
			thumbnail: thumbnailArray,
			code: code.value,
		};

		newProduct.status = true;
		socket.emit("addProduct", newProduct);
	} catch (err) {
		console.log(err.message);
	} finally {
		form.reset();
	}
});

socket.on("error", (err) => {
	alert(err.error);
});

const $deletebtn = document.getElementById("delete-prod-btn");

$deletebtn.addEventListener("click", async (e) => {
	e.preventDefault();
	try {
		const id = parseInt(document.getElementById("id-prod").value);

		socket.emit("deleteProduct", id);
	} catch (err) {
		console.log(err.message);
	} finally {
		document.getElementById("id-prod").value = "";
	}
});

socket.on("productosupdated", (products) => {
	updateProductsList(products);
});
