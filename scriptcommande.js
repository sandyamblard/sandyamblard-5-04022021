// affichage ou maquage des éléments du DOM en fonction du panier vide ou plein
let panierVide = document.getElementById('paniervide');
let panierPlein = document.getElementById("panierplein");
let formulaire = document.getElementById("formulaire");

let affichageSectionsSelonPanier = function(){
    if(localStorage.length !== 0){
   panierVide.style.display = "none";
   panierPlein.style.display = "flex";
   formulaire.style.display = "block";
   }else{
      panierVide.style.display = "flex";
      panierPlein.style.display = "none";
      formulaire.style.display = "none";
   } 
}
affichageSectionsSelonPanier();
 
   
// Pour vider le panier :
let viderLePanier = document.getElementById("viderpanier");

viderLePanier.addEventListener('click', function(){
   localStorage.clear();
   panierCompteur.innerHTML = 0;
   panierVide.style.display = "flex";
   panierPlein.style.display = "none";
   formulaire.style.display = "none";
})



// affichage des nounours contenus dans le panier :
let totalCommande = document.getElementById("total");
let idPresents = []; //array d'id pour la requete GET ensuite, 1 seule fois max par Id de nounours
let products = []; //array d'id pour envoi commande, requete POST (autant de fois chaque nounours en fonction de la quantité choisie)

for (let i=0; i<localStorage.length; i++){//1- recup des infos id, couleur et quantite depuis le panier
   let idEtCouleur = localStorage.key(i);
   let quantiteParArticle = localStorage.getItem(idEtCouleur);
   let idNounours = idEtCouleur.slice(0, 24);
   if (idPresents.includes(idNounours) == false){
       idPresents.push(idNounours);//Rajoute dans le tableau idPresents seulement si pas encore enregistré !
   }
   for(let j =0; j<quantiteParArticle; j++){
       products.push(idNounours);//rajoute dans Products, autant de fois que la quantité
   }
   let couleurNounours = idEtCouleur.slice(25, idEtCouleur.length);//recuperation de la couleur à partir de la clé de l'item de localStorage
   let couleurModifiee = couleurNounours.replace(/ /, '-');//modication dela couleur (retrait des espaces) pour pouvoir la mettre en classe des éléments a creer
   let nvRecapElement = document.createElement('div');// 2- création des div pour replissage avec éléments déjà présents dans le panier:
   nvRecapElement.innerHTML = '<img src="" alt="photo nounours" class="recap__img"><div class="recap__ligne--text"><p><a href="produit.html?id='+idNounours+'"><span class="nomnounours name'+idNounours+'">Nom + lien</span></a></p><p class="descrip">Decription dkghsk jfgkjsd jqtgskt qkftgjgg qkgjgqlghf</p><p><span>Couleur : </span>'+  couleurNounours + ' </p><p><span>Référence : </span>'+ idNounours +'</p></div><div class="recap__ligne--quantite">Quantité: <span class="qté'+idNounours+'">' + quantiteParArticle +' </div><div class="recap__ligne--prix">Total: </br><span class="recap__ligne--prixtotal">'+quantiteParArticle+'</span> €</div><div title="Retirer cet article du panier" class="poubelle" id="'+idNounours+'_'+couleurModifiee+'"><i class="far fa-trash-alt"></i></div>';
   ;
   nvRecapElement.classList.add('recap__ligne');
   nvRecapElement.classList.add('recap'+idNounours);
   nvRecapElement.setAttribute("id",'recap'+idNounours+'_'+couleurModifiee);
   panierPlein.insertBefore(nvRecapElement, totalCommande);
}

//compteur pour le prix total de commande
let total=0;
totalCommande.innerHTML = "Total à régler : "+total + '€';


// fonction pour compléter les éléments du recapitulatif après requete : à partir object obtenu
let completeRecap = function(object){
    let listeDescriptionParId = document.querySelectorAll(".recap"+object._id+" .descrip");//ajout de la description
    for(let descrip of listeDescriptionParId){
        descrip.innerHTML = object.description;
    }
    let listenameParId = document.querySelectorAll(".name"+object._id);//ajout du nom des nounours
    for(let name of listenameParId){
        name.innerHTML = object.name;
    }
    let listePhotoParId = document.querySelectorAll(".recap"+object._id+" img");//ajout référence (id)
    for(let photo of listePhotoParId){
        photo.setAttribute('src', object.imageUrl);
    }
    let listePrixParId = document.querySelectorAll(".recap"+object._id+" .recap__ligne--prixtotal");//calcul et ajout prix en fonction quantité
    for(let prix of listePrixParId){
        let recupQte = parseInt(prix.innerText, 10);
        let calculPrix = recupQte * parseInt(object.price, 10);
        total += 0.01* parseInt(calculPrix, 10); //calcul total à payer
        prix.innerHTML = calculPrix*0.01;
        totalCommande.innerHTML = "Total à régler :  "+total+'€';
    }
}

//Requete et completion des éléments à partir de varaible idPresents (array):
for (let idAChercher of idPresents){
    getInfos('http://localhost:3000/api/teddies/' + idAChercher)
        .then(objetobtenu => completeRecap(objetobtenu))
        .catch(error => console.log(error));
}




////Icones "poubelles" et removeItem //////
let listPoubelles = document.getElementsByClassName("poubelle");//ciblage de toutes les poubelles 

for(let i=0; i < listPoubelles.length; i++){//pr chaque poubelle : recup de la valeur de l'id = Id_CouleurModifiée
    let idRecupere = listPoubelles[i].getAttribute("id");
    let idPourComparaisonItemLS = idRecupere.replace(/-/, ' ');//changement des - par des espaces pour retrouver la syntaxe des clés des items localStorage
    let idPourRequetePrix = idRecupere.slice(0,24);//preparation Id nounours pour future requete pour récupérer prix total
                            
    listPoubelles[i].addEventListener('click', function(e){//écoute du click sur la poubelle
        e.preventDefault;
        let qteARetirer = localStorage.getItem(idPourComparaisonItemLS); //recup qté à enlever au panier
       
        localStorage.removeItem(idPourComparaisonItemLS);
        
        let divARetirer = document.getElementById("recap"+idRecupere);//retrait div correspondaante
        divARetirer.style.display = "none";
        
        affichageSectionsSelonPanier();//affichage des différentes section suivant si panier devenu vide ou non
 
        count -= qteARetirer;//changement affichage du nombre au compteur panier
        panierCompteur.innerHTML = count;
        
        //recalcul du prix total de commande : requete pour obtenir prix de l'item
        let calculPrixARetirer = function(prixUnitaire){
            let prixARetirer = qteARetirer * prixUnitaire*0.01;
            total -=prixARetirer,10;
            totalCommande.innerHTML = "Total à régler : "+total + '€';
        }
        getInfos('http://localhost:3000/api/teddies/' + idPourRequetePrix).then(ojet => calculPrixARetirer(ojet.price)).catch(error => console.log(error));
        //animation du compteur du panier :
        panierCompteur.classList.add("count--grow");//animation pour compteur pour visualiser l'ajout dans le panier
        setTimeout(enleveClassAnimation, 600);
        

    })
}




/////////////FORMULAIRE ET VALIDATION DE COMMANDE////////////////
//1- sauvegarde des différents inputs de formulaire :
let allInputs = document.querySelectorAll('.formulaire input');
let inputFirstName = document.getElementById('firstname');
let inputLastName = document.getElementById('lastname');
let inputAdress = document.getElementById('adress');
let inputCity = document.getElementById('city');
let inputEmail = document.getElementById('email');


//écoute de la validité des inputs et animation si invalide :
//les patterns valides des différents inputs ont été entrés directement dans le html avec l'attribut pattern
for(i=0; i<allInputs.length; i++){
    let  input = allInputs[i];
    allInputs[i].addEventListener('invalid', ()=>{
        input.classList.add("invalid");
    })
}
for(i=0; i<allInputs.length; i++){
    let  input = allInputs[i];
    allInputs[i].addEventListener('focus', ()=>{
        input.classList.remove("invalid");
    })
}



//2-REQUETE POST
//récup de l'url courante pour la modifier (pour redirection vers page confirmation si requete post ok)
let urlActuelle = window.location.toString();
let urlModifiee = urlActuelle.replace(/commande/, "confirmation");


//Fonction pour la requete POST:
 const postInfos = function(objetjson){
    return new Promise(function(resolve, reject){
        let postrequest = new XMLHttpRequest();
        postrequest.open('POST', 'http://localhost:3000/api/teddies/order');
        postrequest.setRequestHeader('Content-type', 'application/json');
        postrequest.onreadystatechange = function(){
            if (this.readyState === 4){
                if (this.status === 201) { //PS : le serveur renvoie une réponse 201
                    resolve(result = JSON.parse(postrequest.response),
                    sessionStorage.setItem("Numéro de commande :", result.orderId), //sauvegarde numero de commande obtenu
                    document.location.href = urlModifiee //si reception de la réponse redirection vers page confirmation
                )}else {
                    reject(postrequest.status)
                }
            }
        }
        postrequest.send(objetjson);
    })
 }

 
 //3-Ecoute du formulaire :
formulaire.addEventListener('submit', function(e){
    e.preventDefault();
    
    sessionStorage.setItem("Prix payé", total); //sauvegarde prix total pour la page suivante
    
    let contact = {//creation de l'objet contact à partir des donnes du formulaire
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAdress.value,
        city: inputCity.value,
        email: inputEmail.value,
    }

    let envoi =  JSON.stringify({"contact": contact, "products": products});//préparation pour envoi au serveur
     

    // envoi au serveur et recup des infos de commande
    postInfos(envoi)/*.then(document.location.href = urlModifiee)*/
        .then(localStorage.clear()) //vidange du panier
        .catch(erreur => console.log(erreur));
    
       
})













