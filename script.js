
//Fonction pour creation cartes de présentation produits sur page index
let listeProduits = document.getElementById('listeproduits');

let createArticleIndex = function(array){
    for(let ligne of array){
        let nvArticle = document.createElement('div');
        nvArticle.innerHTML = '<a href="produit.html"><div class="produit__pict"><img src="'+ ligne.imageUrl + '" alt="image nounours"></div><div class="produit__legende"><p class="produit__legende--nom">' + ligne.name + '</p><p class="produit__legende--prix">Prix : ' + ligne.price * 0.01 + ' €' + '</p></div></a>';
        nvArticle.classList.add('produit');
        listeProduits.append(nvArticle);
    }
    
}

const getInfos = function(url){
    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest();
        request.onload = function(){
            if (request.status == 200){
                resolve(
                result = JSON.parse(request.response),
                )
                
            }else if (request.onerror || request.status !=200){
                reject(console.log("serveur indisponible"));
            }
        }
        request.open('GET', url);
        request.send()
    })
}


getInfos('http://localhost:3000/api/teddies')
.then(listeNounours => 
        createArticleIndex(listeNounours),
    )
.catch(console.error);



/* HTML a INTRODUIRE DANS NOUVEL ARTICLE:
createArticleIndex().innerHTML = '<a href="produit.html"><div class="produit__pict"><img src="'+ nounoursListe[0].imageUrl + 'alt="image nounours"></div><div class="produit__legende"><p class="produit__legende--nom">' + nounoursListe[0].name + '</p><p class="produit__legende--prix">prix :' + nounoursListe[0].price + '€' + '</p></div></a>',*/


///////////////////////////////////////////////////////////////////////


/*COde ok mais pas de prommesses...*/

/*let request = new XMLHttpRequest();
request.open('GET', 'http://localhost:3000/api/teddies');
request.onreadystatechange = function(){
    if (request.readyState == 4 && request.status == 200) {
        nounoursListe = JSON.parse(request.response),

        essai.innerHTML = nounoursListe[0].name,
        console.log(nounoursListe);
    }
};
request.send();*/


/////////////////




/*PB : erreur captee par console pour tous les ready stade hors 4 et ça bugg???????????????????????????*/
/*const getInfos = function(url){
    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if (request.readyState == 4 && request.status == 200){
                resolve(
                nounoursListe = JSON.parse(request.response),
                createArticleIndex().innerHTML = "ok",
                 essai.innerHTML = nounoursListe[0].name,
                 console.log(nounoursListe));
            }else{reject(request), console.log("stade ready state :" + request.readyState)
            }
        }
        request.open('GET', url);
        request.send()
    })
}*/


/////



/*Ne marche pas non plus....
const getInfos = async function(){
    let response = await fetch('http://localhost:3000/api/teddies');
    if(response.ok){
        let donnees = await response.json();
        console.log(donnees);
    }else{
        console.log("erreur");
    }
}*/