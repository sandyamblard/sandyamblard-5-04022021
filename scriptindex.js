
//Fonctions pour creation cartes de présentation produits sur page index
let listeProduits = document.getElementById('listeproduits');

let createArticleIndex = function(arrayOfObjects){
    for(let object of arrayOfObjects){
        let nvArticle = document.createElement('div');
        nvArticle.innerHTML = '<a href="produit.html?id=' + object._id + '"><div class="produit__pict"><img src="'+ object.imageUrl + '" alt="image nounours"></div><div class="produit__legende"><p class="produit__legende--nom">' + object.name + '</p><p class="produit__legende--prix">Prix : ' + object.price * 0.01 + ' €' + '</p></div></a>';
        nvArticle.classList.add('produit');
        listeProduits.append(nvArticle);
    }
    
}


//Appel API et AFFICHAGE DYNAMIQUE DES PRODUITS SUR PAGE INDEX
getInfos('http://localhost:3000/api/teddies')
.then(listeNounours => 
        createArticleIndex(listeNounours),
    )
.catch(console.error);

