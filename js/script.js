
const url = "https://api.instabuy.com.br/apiv3/layout?subdomain=organicos";

const container = document.querySelectorAll('[main-container]')[0]; //onde será adicionado as celulas

fetch(url, { method: 'get' })
    .then(resp => resp.json())
    .then(content => getData(content))
    .then(data => setElements(data, container))
    .catch(err => showError(err, container));


function getData(content) {
    if (content.status != 'success') {
        console.log(content.status);
        throw content.data;
    }
    return content.data;
}

/* Funçao controladora: adiciona elementos e controla dados */
function setElements(data, container) {
    const banners = data.banners;
    const collections = data.collection_items;
    let zoneSlug;
    let pagina = '';

    collections.forEach(collection => {
        collection.items.forEach(item => {
            pagina += product(item, collection.slug);
        });
    })

    container.innerHTML = pagina;
    selectCollection(collections);
}

function showError(err, container) {
    container.innerHTML = `<span id='error'>Não foi possível carregar os itens</span>`;
    console.log(err)
}


/*----- Functions de celula -----*/

/* Cria a célula de cada produto, com suas características */
function product(itemData, zoneSlug) {
    let preco = getPreco(itemData);
    let obj = `
    <div class="productCel" from="${zoneSlug}">
        <div class="productImg">
            <picture>
                <img src="https://ibassets.com.br/ib.item.image.medium/m-${itemData.images[0]}"
                    alt="${itemData.slug}">
            </picture>
        </div>
        <div class="productText">
            <div class="productTitle">${itemData.name}</div>
            <div class="productBrand"></div>
            <div class="productPrice">${preco}</div>
        </div>
    </div>`;

    return obj;

}

/* Retorna preços e tipo de unidade de algum item */
function getPreco(itemData) { //default price
    let unit = itemData.unit_type;
    let precos = itemData.prices
    let string = '';

    if (precos.length === 1) {
        string = 'R$ ' + (precos[0].price).toFixed(2).replace('.', ',') + ' <span class="productUnit">' + unit + '</span>';
    } else {
        for (let i = 0; i < precos.length; i++) {
            string += 'R$' + (precos[i].price).toFixed(2).replace('.', ',') + '(' + precos[i].title + ')' + '<span class="productUnit">' + unit + '</span>' + '<br>';
        }
    }
    return string;
}

/* Cria as categorias no <select> */
function selectCollection(collections) {
    const selector = document.querySelector('[category-selector]');
    selector.innerHTML = ('<option value="Todos">Todos</option>');
    collections.forEach(collection => {
        console.log(collection.title);
        selector.innerHTML += (`<option value="${collection.slug}">${collection.title}</option>`);
    })

    selector.addEventListener('change', () => {
        if (selector.value == 'Todos') {
            document.querySelectorAll(`[from]`).forEach(e => { e.style.display = 'inline-block'; })
        } else {
            document.querySelectorAll(`[from]`).forEach(e => { e.style.display = 'none'; })
            document.querySelectorAll(`[from="${selector.value}"`).forEach(e => { e.style.display = 'inline-block'; })
        }
    })
}
