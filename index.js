
///GENERAL POUR TOUTES LES PAGES ///////////
//- 1- fonction pour afficher le coompteur a coté de l'icone du panier de la topbar :
let panierCompteur = document.getElementById('paniercompteur');
let count = 0;


//recup des items clés du panier : 
  for (let i=0; i<localStorage.length; i++){
      let valeur = localStorage.key(i);
      let quantiteParArticle = localStorage.getItem(valeur);
      count += parseInt(quantiteParArticle, 10);
      panierCompteur.innerHTML = count;;
  }


  //////////////////////////////////////////



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

// creation requete ajax avec promesse
const getInfos = function(url){
    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest();
        request.onload = function(){
            if (request.status == 200){
                resolve(
                result = JSON.parse(request.response),
                console.log(result)
                )
                
            }else if (request.onerror || request.status !=200){
                reject(console.log("serveur indisponible, " + "readyState = " + request.readyState));
            }
        }
        request.open('GET', url);
        request.send()
    })
}

//Appel API et AFFICHAGE DYNAMIQUE DES PRODUITS SUR PAGE INDEX
getInfos('http://localhost:3000/api/teddies')
.then(listeNounours => 
        createArticleIndex(listeNounours),
    )
.catch(console.error);




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